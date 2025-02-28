import {Request, Response} from 'express';
import {usersPaginationQueries} from "../../helpers/pagination-values";
import {UsersQRepo} from "../../Repositories/UsersQRepo";
import {UsersServices} from "../../Services/UsersServices";


export const usersController= {
    getUsers: async (req: Request, res: Response) => {
        const {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} = usersPaginationQueries(req)
        const users = await UsersQRepo.ShowAllUsers({pageNumber, pageSize, sortBy, sortDirection,searchLoginTerm, searchEmailTerm})
        const usersCount = await UsersQRepo.UsersCounter(searchLoginTerm, searchEmailTerm)
        const result = await UsersQRepo.PaginationMap({pageNumber, pageSize, usersCount, users})
        res.status(200).json(result)
    },

    createUser: async (req: Request, res: Response) => {
        const id = await UsersServices.CreateUser(req.body)
        const result = await UsersQRepo.ShowUserByID(id);
        (result) ? res.status(201).json(result) : res.status(400).json('Error: user was not created');
    },

    deleteUser: async (req: Request, res: Response) => {
        (await UsersServices.DeleteUser(req.params.id)) ? res.sendStatus(204) : res.status(404).json('Error: user not found')
    }
}
