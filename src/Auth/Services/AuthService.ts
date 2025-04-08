import {UsersRepo} from "../../Repositories/UsersRepo";
import {compare, hash} from "bcrypt";
import {CustomError, HttpStatuses, InvalidCredentialsError, NotFoundError} from "../../helpers/ErrorHandler";
import {jwtService} from "./JwtService";
import {ObjectId} from "mongodb";
import {DevicesRepo} from "../../Security/Repositories/DevicesRepo";
import {DeviceDBType} from "../../Data Types/DeviceDBType";
import {RefreshTokenPayloadType} from "../Types/RefreshTokenPayloadType";
import {randomUUID} from "node:crypto";
import {nodemailerService} from "../adapters/nodemailer-adapter";
import {emailExamples} from "../adapters/EmailExamples";
import {InputNewPassType} from "../../IO Types/InputNewPassType";


export const AuthServices ={
    async LoginUser(content: { loginOrEmail:string, password:string, ip: string, title:string }){
    const foundUser = await UsersRepo.ShowUser(content.loginOrEmail)

    if (!foundUser)
    {throw new InvalidCredentialsError('Wrong Credentials', [{message:'Wrong Login or email', field:'loginOrEmail' }]);}
        else {
            if (!(await compare(content.password, foundUser.passwordHash))){
                throw new InvalidCredentialsError('Wrong Credentials', [{message:'Wrong Password', field:'password'}]);
            }

        const deviceId = new ObjectId()

        const accessToken= await jwtService.createToken(foundUser._id ,deviceId)
        const refreshToken= await jwtService.createRToken(foundUser._id ,deviceId)

        const  RPayload = await jwtService.decodeRToken(refreshToken)
        const device = {
            ip: content.ip,
            title: content.title,
            iat: RPayload.iat,
            exp: RPayload.exp,
            _id: RPayload.deviceId,
            userId: RPayload.userId
        }

        const res = await DevicesRepo.AddDevice(device)
        if (!res) {throw new CustomError('Unexpected error',
            HttpStatuses.ServerError,
            [{message: 'No update happened in db', field: 'null'}])}

    return {accessToken, refreshToken}}
    },

    async checkAccessToken(authHeader: string){
        const [type, token] = authHeader.split(' ');

        const result = await jwtService.verifyToken(token);

        return result
    },

    async refreshAccessToken(rToken: string){
    const payload  = await jwtService.verifyRToken(rToken)  //ошибка валидации выбрасывается в jwtService

        const foundDevice = await DevicesRepo.ShowDevice(payload.deviceId)

    if(!foundDevice) {
        throw new InvalidCredentialsError('Token is not valid',
            [{message:'REFRESH_ERROR:Refresh token is depreciated', field:'token'}])
    }

    if (payload.iat!==foundDevice.iat)
        {throw new InvalidCredentialsError('Token is not valid',
            [{message:'LOGOUT_ERROR:User has been already logged out', field:'token'}])}
    else {
        const newRToken = await jwtService.createRToken(payload.userId, payload.deviceId)
        const newAToken = await jwtService.createToken(payload.userId, payload.deviceId)

        const newRPayload:RefreshTokenPayloadType = await jwtService.decodeRToken(newRToken)
        const UpdDevice:DeviceDBType = {...foundDevice, iat:newRPayload.iat, exp:newRPayload.exp};

        const res = await DevicesRepo.UpdateDevice(UpdDevice)
        if (!res)
        {throw new NotFoundError('Device not found in repo')} //чтобы проверить работу фильтра при апдейте

        return {newRToken, newAToken}
       }
    },

    async LogoutUser(rToken:string){
        const payload:RefreshTokenPayloadType  = await jwtService.verifyRToken(rToken)

        const foundDevice = await DevicesRepo.ShowDevice(payload.deviceId)
        if (!foundDevice){throw new InvalidCredentialsError('Token is incorrect',
            [{message:'Device not found based on token data', field:'userId'}])}

        if (payload.iat!==foundDevice.iat)
        {throw new InvalidCredentialsError('Token is not valid',
            [{message:'LOGOUT_ERROR:User has been already logged out', field:'token'}])}

        const res = await DevicesRepo.DeleteDevice(foundDevice._id.toString())

        if (!res) {
            throw new InvalidCredentialsError('Token is not valid',
                [{message:'LOGOUT_ERROR:User has been already logged out', field:'token'}])
        }
    },

    async passwordRecovery(email: string){

        const foundUser = await UsersRepo.ShowUser(email)
        if (!foundUser)
        {return}

        foundUser.passwordRecovery.recoveryCode = randomUUID() + '-rq'
        foundUser.passwordRecovery.expirationDate = new Date(Date.now()+86400000) //текущая + сутки в мс
        await UsersRepo.UpdateUser(foundUser)  //в принципе можно не проверять на ошибку обновления(наверное)

        nodemailerService
            .sendEmail(
                foundUser.email,
                foundUser.passwordRecovery.recoveryCode,
                emailExamples.passwordRecoveryEmail
            )
            .catch(err => console.error('email not sent, exception:', err))

        return
    },

    async newPassword(content:InputNewPassType){
        const isUuid = new RegExp
        (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-rq$/i)  //rq - отличие passConfCode от EmailConfCode
            .test(content.recoveryCode)

        if (!isUuid) {throw new CustomError("Invalid confirmation code",
            HttpStatuses.BadRequest,
            [{message:'Confirmation code does not match regexp', field:'recoveryCode'}])}

        const foundUser = await UsersRepo.ShowUser(content.recoveryCode) //TODO проверить, что поиск адаптирован
        if (foundUser===null) {throw new CustomError("Invalid recovery code",
            HttpStatuses.BadRequest,
            [{message:'Invalid recovery code',field:'recoveryCode' }])}

        if (Date.now() > foundUser.passwordRecovery.expirationDate.getTime()){throw new CustomError("Confirmation error",
            HttpStatuses.BadRequest,
            [{message:'Confirmation code has been expired', field:'code'}])}

        foundUser.passwordRecovery.recoveryCode = ''  //сбрасываем код после использования
        const passhash = await hash(content.newPassword, 10)
        foundUser.passwordHash = passhash  //обновляем хэш пароля в дб

        const res = await UsersRepo.UpdateUser(foundUser)  // обновляем юзера

        return;
    }
}