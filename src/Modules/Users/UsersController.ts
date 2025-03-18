import {Request, Response, NextFunction} from 'express';
import {usersPaginationQueries} from "../../helpers/pagination-values";
import {UsersQRepo} from "../../Repositories/UsersQRepo";
import {UsersServices} from "../../Services/UsersServices";
import {NotFoundError} from "../../helpers/ErrorHandler";


export const usersController= {
    getUsers: async (req: Request, res: Response) => {
        const {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} = usersPaginationQueries(req)
        const users = await UsersQRepo.ShowAllUsers({pageNumber, pageSize, sortBy, sortDirection,searchLoginTerm, searchEmailTerm})
        const usersCount = await UsersQRepo.UsersCounter(searchLoginTerm, searchEmailTerm)
        const result = await UsersQRepo.PaginationMap({pageNumber, pageSize, usersCount, users})
        res.status(200).json(result)
    },

    createUser: async (req: Request, res: Response, next:NextFunction) => {
        try { //пока что так ради тестов, вообще нужно переделать на custom error вместо бросания объекта между слоями
            const CreateResult = await UsersServices.CreateUser(req.body)
            if (CreateResult.id === null) {
                res.status(400).json({errorsMessages: CreateResult.errorsMessages})
            } else {
                const result = await UsersQRepo.ShowUserByID(CreateResult.id);
                (result !== null) ? res.status(201).json(result) : res.status(400).json('Error: user was not created');
            }
        }
        catch (err) {next(err)}
        },

    deleteUser: async (req: Request, res: Response, next:NextFunction) => {
        try {
            const result = await UsersServices.DeleteUser(req.params.id)
            if (!result) {throw new NotFoundError('User does not exist');}
            res.sendStatus(204)
        }
        catch (err) {next(err)}
        }
}
