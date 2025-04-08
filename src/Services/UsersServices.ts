import {InputUserType} from "../IO Types/InputUserType";
import {ObjectId} from "mongodb";
import {UsersRepo} from "../Repositories/UsersRepo";
import {UserDBType} from "../Data Types/UserDBType";
import {hash} from "bcrypt";


export const UsersServices ={
    async CreateUser(content: InputUserType) {
    let CreateResult = {}
        try {
    if (await UsersRepo.ShowUser(content.email) !== null) {
        throw {message: 'email should be unique',field: 'email' }
    }}
    catch(error){
        return CreateResult =  {
            ['id']: null,
            ['errorsMessages']: [error]
        }
    }
    try {
        if (await UsersRepo.ShowUser(content.login) !== null) {
            throw {message: 'login should be unique',field: 'login' }
        }
    }
        catch(error){
            return CreateResult =  {
                ['id']: null,
                ['errorsMessages']: [error]
            }
    }

        const passHash = await hash(content.password, 10)
        const user ={
            login: content.login,
            email: content.email,
            passwordHash:passHash,
            _id: new ObjectId(),
            createdAt: new Date().toISOString(),
            refreshToken: '',
            emailConfirmation: {
                confirmationCode: '',
                expirationDate: new Date,
                isConfirmed: true},
            passwordRecovery: {
                recoveryCode: '',
                expirationDate: new Date,
            },
        } as UserDBType

        return CreateResult =  {
            ['id']: await UsersRepo.SetUpNewUser(user),
            ['errorsMessages']: null
        }
    },

    async DeleteUser(id: string): Promise<boolean> {
        return await UsersRepo.DeleteUser(id)
    }

}