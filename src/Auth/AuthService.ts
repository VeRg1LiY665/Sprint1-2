import {InputLoginType} from "../IO Types/InputLoginType";
import {UsersRepo} from "../Repositories/UsersRepo";
import {compare} from "bcrypt";


export const AuthServices ={
    async LoginUser(content: InputLoginType){
const foundUser = await UsersRepo.ShowUser(content.loginOrEmail)

if (!foundUser){return false}
        return compare(content.password, foundUser.passwordHash);
    }


}