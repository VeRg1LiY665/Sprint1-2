import {Request, Response, NextFunction} from 'express';
import {usersPaginationQueries} from "../../helpers/pagination-values";
import {UsersQRepo} from "../../Repositories/UsersQRepo";
import {UsersServices} from "../../Services/UsersServices";
import {NotFoundError} from "../../helpers/ErrorHandler";
import {injectable} from "inversify";

@injectable()
export class UsersController {
    constructor(protected usersServices: UsersServices,
                protected usersQRepo: UsersQRepo) {}

 async getUsers(req: Request, res: Response) {
    const {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} = usersPaginationQueries(req)
    const users = await this.usersQRepo.ShowAllUsers({pageNumber, pageSize, sortBy, sortDirection,searchLoginTerm, searchEmailTerm})
    const usersCount = await this.usersQRepo.UsersCounter(searchLoginTerm, searchEmailTerm)
    const result = await this.usersQRepo.PaginationMap({pageNumber, pageSize, usersCount, users})
    res.status(200).json(result)
}

 async createUser(req: Request, res: Response, next:NextFunction) {
    try { //пока что так ради тестов, вообще нужно переделать на custom error вместо бросания объекта между слоями
        const CreateResult = await this.usersServices.CreateUser(req.body)
        if (CreateResult.id === null) {
            res.status(400).json({errorsMessages: CreateResult.errorsMessages})
        } else {
            const result = await this.usersQRepo.ShowUserByID(CreateResult.id);
            (result !== null) ? res.status(201).json(result) : res.status(400).json('Error: user was not created');
        }
    }
    catch (err) {next(err)}
}

 async deleteUser(req: Request, res: Response, next:NextFunction) {
    try {
        const result = await this.usersServices.DeleteUser(req.params.id)
        if (!result) {throw new NotFoundError('User does not exist');}
        res.sendStatus(204)
    }
    catch (err) {next(err)}
}
}


