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

    async ConfirmEmail(code: string){
        const isUuid = new RegExp
        (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
            .test(code)

    if (!isUuid) {throw new CustomError("Invalid confirmation code",
                            HttpStatuses.BadRequest,
                            [{field:'null', message:'Confirmation code does not match regexp'}])}

    const foundUser = await UsersRepo.ShowUser(code)
     if (foundUser===null) {throw new CustomError("Invalid confirmation code",
                                      HttpStatuses.BadRequest,
                                      [{field:'code', message:'Invalid confirmation code'}])}

     if (foundUser.emailConfirmation.isConfirmed===true) {throw new CustomError("Confirmation error",
                                                                    HttpStatuses.BadRequest,
                                                                    [{field:'null', message:'Email has been already confirmed'}])}

     if (Date.now() - foundUser.emailConfirmation.expirationDate.getTime() > 86400000){throw new CustomError("Confirmation error", //сутки в мс
                                                                           HttpStatuses.BadRequest,
                                                                           [{field:'code', message:'Confirmation code has been expired'}])}
    return //то же, что выше - exceptions падают в хэндлер, поэтому возвращаю void
     },

    async ResendEmail(email: string){
        const foundUser = await UsersRepo.ShowUser(email)
        if (!foundUser){throw new CustomError("Invalid email address",
                                    HttpStatuses.BadRequest,
                                    [{field:'null', message:'User with this email does not exist'}])}

        if (foundUser.emailConfirmation.isConfirmed===true) {throw new CustomError("Confirmation error",
                                                                       HttpStatuses.BadRequest,
                                                                       [{field:'email', message:'Email has been already confirmed'}])}

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