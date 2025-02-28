import {InputUserType} from "../IO Types/InputUserType";
import {ObjectId} from "mongodb";
import {UsersRepo} from "../Repositories/UsersRepo";
import {UserDBType} from "../Data Types/UserDBType";
import {hash} from "bcrypt";

export let errorsMessages={}

export const UsersServices ={
    async CreateUser(content: InputUserType) {
try {
    if (await UsersRepo.ShowUser(content.email) !== null) {
        throw {field: 'email', message: 'email should be unique'}
    }}
catch(error){
        errorsMessages = error;
    }
    try {
        if (await UsersRepo.ShowUser(content.login) !== null) {
            throw {field: 'login', message: 'login should be unique'}
        }
    }
        catch(error){ return error;}


        const passHash = await hash(content.password, 10)
        const user ={
            login: content.login,
            email: content.email,
            passwordHash:passHash,
            _id: new ObjectId(),
            createdAt: new Date().toISOString()
        } as UserDBType

        return await UsersRepo.SetUpNewUser(user)
    },

    async DeleteUser(id: string): Promise<boolean> {
        return await UsersRepo.DeleteUser(id)
    }


}