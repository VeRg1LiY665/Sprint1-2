import {InputLoginType} from "../../IO Types/InputLoginType";
import {UsersRepo} from "../../Repositories/UsersRepo";
import {compare} from "bcrypt";
import {CustomError, HttpStatuses, InvalidCredentialsError} from "../../helpers/ErrorHandler";
import {jwtService} from "./JwtService";


export const AuthServices ={
    async LoginUser(content: InputLoginType){
const foundUser = await UsersRepo.ShowUser(content.loginOrEmail)

if (!foundUser){throw new InvalidCredentialsError('Wrong Credentials', [{message:'Wrong Login or email', field:'loginOrEmail' }]);}
        else {
            if (!(await compare(content.password, foundUser.passwordHash))){
                throw new InvalidCredentialsError('Wrong Credentials', [{message:'Wrong Password', field:'password'}]);
            }

        const accessToken= await jwtService.createToken(foundUser._id.toString())
        const refreshToken= await jwtService.createRToken(foundUser._id.toString())

    const user = {...foundUser, refreshToken:refreshToken}

    const res = await UsersRepo.UpdateUser(user)
    if (!res) {throw new CustomError('Unexpected error',
        HttpStatuses.ServerError,
        [{message: 'No update happened in db', field: 'null'}])}

    return {accessToken, refreshToken}}
    },

    async checkAccessToken(authHeader: string){
        const [type, token] = authHeader.split(' ');

        const result = await jwtService.verifyToken(token);

        if (!result) { throw new InvalidCredentialsError('Wrong Credentials', [{message:'Wrong token', field:'null' }])
        }
        else {return result}
    },

    async refreshAccessToken(rToken: string){
    const payload  = await jwtService.verifyRToken(rToken)
    if (payload===null) {throw new InvalidCredentialsError('Token is incorrect',[{message:'Wrong refresh Token', field:'token'}]);}

    const foundUser = await UsersRepo.ShowUser(payload.userId)
    if (foundUser===null){throw new InvalidCredentialsError('Token is incorrect',[{message:'User not found based on token data', field:'userId'}])}

    if(rToken===foundUser.refreshToken) {
        const newRToken = await jwtService.createRToken(payload.userId)
        const newAToken = await jwtService.createToken(payload.userId)

        const UpdUser = {...foundUser, refreshToken: newRToken};
        const res = await UsersRepo.UpdateUser(UpdUser)
        if (!res) {
            throw new CustomError('Unexpected error',
                HttpStatuses.ServerError,
                [{message: 'No update happened in db', field: 'null'}])
        }

        return {newRToken, newAToken}
    }
    else {throw new InvalidCredentialsError('Token is not valid',[{message:'REFRESH_ERROR:Refresh token is depreciated', field:'token'}])}
    },

    async LogoutUser(rToken:string){
        const payload  = await jwtService.verifyRToken(rToken)
        if (payload===null) {throw new InvalidCredentialsError('Token is incorrect',[{message:'Wrong refresh Token', field:'token'}]);}

        const foundUser = await UsersRepo.ShowUser(payload.userId)
        if (foundUser===null){throw new InvalidCredentialsError('Token is incorrect',[{message:'User not found based on token data', field:'userId'}])}

        if (rToken===foundUser.refreshToken) {
            const UpdUser = {...foundUser, refreshToken: ''}
            const res = await UsersRepo.UpdateUser(UpdUser)
            if (!res) {
                throw new CustomError('Unexpected error',
                    HttpStatuses.ServerError,
                    [{message: 'No update happened in db', field: 'null'}])
            }
        }
        else {throw new InvalidCredentialsError('Token is not valid', [{message:'LOGOUT_ERROR:User has been already logged out', field:'token'}])}
    }
}