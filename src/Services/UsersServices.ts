import {InputUserType} from "../IO Types/InputUserType";
import {ObjectId} from "mongodb";
import {UsersRepo} from "../Repositories/UsersRepo";
import {UserDBType} from "../Data Types/UserDBType";
import {hash} from "bcrypt";
import {injectable} from "inversify";

@injectable()
export class UsersServices {
    constructor(protected usersRepo: UsersRepo) {}
    async CreateUser(content: InputUserType) {
        let CreateResult = {}
        try {
            if (await this.usersRepo.ShowUser(content.email) !== null) {
                throw {message: 'email should be unique',field: 'email' }
            }}
        catch(error){
            return CreateResult =  {
                ['id']: null,
                ['errorsMessages']: [error]
            }
        }
        try {
            if (await this.usersRepo.ShowUser(content.login) !== null) {
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
        const user = new UserDBType(
            new ObjectId(),
            content.login,
            content.email,
            passHash,
            new Date().toISOString(),
            {
                confirmationCode: '',
                expirationDate: new Date,
                isConfirmed: true},
            {
                recoveryCode: '',
                expirationDate: new Date
            }
        )

        return CreateResult =  {
            ['id']: await this.usersRepo.SetUpNewUser(user),
            ['errorsMessages']: null
        }
    }

    async DeleteUser(id: string): Promise<boolean> {
        return await this.usersRepo.DeleteUser(id)
    }
}

