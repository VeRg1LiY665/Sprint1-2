import {UsersRepo} from "../../Repositories/UsersRepo";
import {InputUserType} from "../../IO Types/InputUserType";
import {
    CustomError,
    DuplicatedEmailError,
    DuplicatedLoginError,
    HttpStatuses
} from "../../helpers/ErrorHandler";
import {hash} from "bcrypt";
import {ObjectId} from "mongodb";
import {UserDBType} from "../../Data Types/UserDBType";
import {nodemailerService} from "../adapters/nodemailer-adapter";
import {emailExamples} from "../adapters/EmailExamples";
import {randomUUID} from "node:crypto";
import {InputResendEmailType} from "../../IO Types/InputResendEmailType";
import {InputConfirmEmailType} from "../../IO Types/InputConfirmEmailType";

export const RegServices={
    async RegisterUser(content: InputUserType){
    if (await UsersRepo.ShowUser(content.email) !== null) {
        throw new DuplicatedEmailError('User already exists')}

    if (await UsersRepo.ShowUser(content.login) !== null) {
        throw new DuplicatedLoginError('User already exists')}

    const passHash = await hash(content.password, 10)

        const user ={
            login: content.login,
            email: content.email,
            passwordHash:passHash,
            _id: new ObjectId(),
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: new Date,
                isConfirmed: false}
        } as UserDBType

    const res = await UsersRepo.SetUpNewUser(user)
        if (res.length > 0) {
            nodemailerService
                .sendEmail(
                    user.email,
                    user.emailConfirmation.confirmationCode,
                    emailExamples.registrationEmail
                )
                .catch(err => console.error('email not sent, exception:', err));
        }
        return //попробую вернуть void, все равно exceptions падают в хэндлер
    },

    async ConfirmEmail(content: InputConfirmEmailType){
        const isUuid = new RegExp
        (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
            .test(content.code)

    if (!isUuid) {throw new CustomError("Invalid confirmation code",
                            HttpStatuses.BadRequest,
                            [{message:'Confirmation code does not match regexp', field:'code'}])}

    const foundUser = await UsersRepo.ShowUser(content.code)
     if (foundUser===null) {throw new CustomError("Invalid confirmation code",
                                      HttpStatuses.BadRequest,
                                      [{message:'Invalid confirmation code',field:'code' }])}

     if (foundUser.emailConfirmation.isConfirmed===true) {throw new CustomError("Confirmation error",
                                                                    HttpStatuses.BadRequest,
                                                                    [{message:'Email has been already confirmed', field:'code'}])}

     if (Date.now() - foundUser.emailConfirmation.expirationDate.getTime() > 86400000){throw new CustomError("Confirmation error", //сутки в мс
                                                                           HttpStatuses.BadRequest,
                                                                           [{message:'Confirmation code has been expired', field:'code'}])}
     foundUser.emailConfirmation.isConfirmed = true

     const res = await UsersRepo.UpdateUser(foundUser) //TODO сюда тоже throw exception?
     return //то же, что выше - exceptions падают в хэндлер, поэтому возвращаю void
     },

    async ResendEmail(content: InputResendEmailType){
        const foundUser = await UsersRepo.ShowUser(content.email)

        if (foundUser===null){throw new CustomError("Invalid email address",
                                    HttpStatuses.BadRequest,
                                    [{message:'User with this email does not exist', field:'email'}])}

        if (foundUser.emailConfirmation.isConfirmed===true) {throw new CustomError("Confirmation error",
                                                                       HttpStatuses.BadRequest,
                                                                       [{message:'Email has been already confirmed', field:'email'}])}

        foundUser.emailConfirmation.confirmationCode = randomUUID()
        const res = await UsersRepo.UpdateUser(foundUser)
        if (!res) {throw new CustomError("Confirmation code resend error",
            HttpStatuses.ServerError,
            [{message:'No user update happened', field:'confirmationCode'}])}

        nodemailerService
            .sendEmail(
                foundUser.email,
                foundUser.emailConfirmation.confirmationCode,
                emailExamples.registrationEmail
            )
            .catch(err => console.error('email not sent, exception:', err))
    return
    }
}