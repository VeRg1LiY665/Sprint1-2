import {InputLoginType} from "../../IO Types/InputLoginType";
import {UsersRepo} from "../../Repositories/UsersRepo";
import {compare} from "bcrypt";
import {InvalidCredentialsError} from "../../helpers/ErrorHandler";
import {jwtService} from "./JwtService";


export const AuthServices ={
    async LoginUser(content: InputLoginType){
const foundUser = await UsersRepo.ShowUser(content.loginOrEmail)

if (!foundUser){throw new InvalidCredentialsError('Wrong Credentials', [{field:'loginOrEmail' , message:'Wrong Login or email'}]);}
        else {
            if (!(await compare(content.password, foundUser.passwordHash))){
                throw new InvalidCredentialsError('Wrong Credentials', [{field:'password', message:'Wrong Password'}]);
            }
        return await jwtService.createToken(foundUser._id.toString());}
    },

    async checkAccessToken(authHeader: string){
        const [type, token] = authHeader.split(' ');

        const result = await jwtService.verifyToken(token);

        if (!result) { throw new InvalidCredentialsError('Wrong Credentials', [{field:'null' , message:'Wrong token'}])
        }
        else {return result}
    },
}