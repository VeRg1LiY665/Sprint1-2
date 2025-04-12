import {UserOutputType} from "../IO Types/UserOutputType";
import {usersCollection} from "../db/mongoDB";
import {UserDBType} from "../Data Types/UserDBType";
import {ObjectId} from "mongodb";

export class UsersQRepo{
    async ShowAllUsers(dto: {
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: number,
        searchLoginTerm: string | null,
        searchEmailTerm: string | null
    }): Promise<UserOutputType[]> {
        //let filter: any = {};
        let $or = []
        if (dto.searchLoginTerm!==null) {
            $or.push({login: {$regex: dto.searchLoginTerm, $options: 'i'}})
        }
        if (dto.searchEmailTerm!==null) {
            $or.push({email: {$regex: dto.searchEmailTerm, $options: 'i'}})
        }

        const AllUsers = await usersCollection
            .find(($or.length>0) ? {$or:$or} : {})
            .sort(dto.sortBy, dto.sortDirection === 1 ? 1 : -1)
            .skip((dto.pageNumber - 1) * dto.pageSize)
            .limit(dto.pageSize)
            .toArray();
        return AllUsers.map(el => (this.mapToOutput(el)))
    }

    async ShowUserByID(userId: string) {
        const _id = new ObjectId(userId)
        const user=  await usersCollection.findOne({_id:_id})
        if(!user){
            return null
        }
        return this.mapToOutput(user)
    }

    async UsersCounter(searchLoginTerm: string | null, searchEmailTerm: string | null): Promise<number> {
        let $or = [];
        if (searchLoginTerm) {
            $or.push({login: {$regex: searchLoginTerm, $options: 'i'}})
        }
        if (searchEmailTerm) {
            $or.push({email: {$regex: searchEmailTerm, $options: 'i'}})
        }
        return await usersCollection.countDocuments(($or.length>0) ? {$or:$or} : {})
    }

    mapToOutput(user: UserDBType): UserOutputType {
        let MappedUser: any =
            {id: (user._id).toString(),
                login: user.login,
                email: user.email,
                createdAt: user.createdAt}
        /*delete MappedUser._id
        delete MappedUser.passwordHash
        delete MappedUser.emailConfirmation
        delete MappedUser.refreshToken*/
        return MappedUser as UserOutputType
    }

    async PaginationMap(dto: {
        pageNumber: number,
        pageSize: number,
        usersCount: number,
        users: UserOutputType[]
    }) {
        return {
            pagesCount: Math.ceil(dto.usersCount / dto.pageSize),
            page: dto.pageNumber,
            pageSize: dto.pageSize,
            totalCount: dto.usersCount,
            items: dto.users
        }
    }
}

/*
export const UsersQRepo = {
    async ShowAllUsers(dto: {
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: number,
        searchLoginTerm: string | null,
        searchEmailTerm: string | null
    }): Promise<UserOutputType[]> {
       //let filter: any = {};
let $or = []
        if (dto.searchLoginTerm!==null) {
            $or.push({login: {$regex: dto.searchLoginTerm, $options: 'i'}})
        }
        if (dto.searchEmailTerm!==null) {
            $or.push({email: {$regex: dto.searchEmailTerm, $options: 'i'}})
        }

        const AllUsers = await usersCollection
            .find(($or.length>0) ? {$or:$or} : {})
            .sort(dto.sortBy, dto.sortDirection === 1 ? 1 : -1)
            .skip((dto.pageNumber - 1) * dto.pageSize)
            .limit(dto.pageSize)
            .toArray();
        return AllUsers.map(el => (this.mapToOutput(el)))
    },

    async ShowUserByID(userId: string) {
        const _id = new ObjectId(userId)
        const user=  await usersCollection.findOne({_id:_id})
        if(!user){
            return null
        }
        return this.mapToOutput(user)
    },

    async UsersCounter(searchLoginTerm: string | null, searchEmailTerm: string | null): Promise<number> {
        let $or = [];
        if (searchLoginTerm) {
            $or.push({login: {$regex: searchLoginTerm, $options: 'i'}})
        }
        if (searchEmailTerm) {
            $or.push({email: {$regex: searchEmailTerm, $options: 'i'}})
        }
        return await usersCollection.countDocuments(($or.length>0) ? {$or:$or} : {})
    },

    mapToOutput(user: UserDBType): UserOutputType {
        let MappedUser: any =
            {id: (user._id).toString(),
             login: user.login,
             email: user.email,
             createdAt: user.createdAt}
        /!*delete MappedUser._id
        delete MappedUser.passwordHash
        delete MappedUser.emailConfirmation
        delete MappedUser.refreshToken*!/
        return MappedUser as UserOutputType
    },

    async PaginationMap(dto: {
        pageNumber: number,
        pageSize: number,
        usersCount: number,
        users: UserOutputType[]
    }) {
        return {
            pagesCount: Math.ceil(dto.usersCount / dto.pageSize),
            page: dto.pageNumber,
            pageSize: dto.pageSize,
            totalCount: dto.usersCount,
            items: dto.users
        }
    }

}*/
