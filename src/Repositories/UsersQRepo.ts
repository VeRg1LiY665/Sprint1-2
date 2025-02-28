import {BlogOutputType} from "../IO Types/BlogOutputType";
import {UserOutputType} from "../IO Types/UserOutputType";
import {usersCollection} from "../db/mongoDB";
import {UserDBType} from "../Data Types/UserDBType";
import {ObjectId} from "mongodb";


export const UsersQRepo = {
    async ShowAllUsers(dto: {
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: number,
        searchLoginTerm: string | null,
        searchEmailTerm: string | null
    }): Promise<UserOutputType[]> {
        let filter: any = {};

        if (dto.searchLoginTerm) {
            filter.name = {$regex: dto.searchLoginTerm, $options: 'i'}
        }
        if (dto.searchEmailTerm) {
            filter.name = {$regex: dto.searchEmailTerm, $options: 'i'}
        }

        const AllUsers = await usersCollection
            .find(filter)
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
        let filter: any = {};
        if (searchLoginTerm) {
            filter.login = {$regex: searchLoginTerm, $options: 'i'}
        }
        if (searchEmailTerm) {
            filter.email = {$regex: searchEmailTerm, $options: 'i'}
        }
        return await usersCollection.countDocuments(filter)
    },

    mapToOutput(user: UserDBType): UserOutputType {
        let MappedUser: any = {id: (user._id).toString(), ...user}
        delete MappedUser._id
        delete MappedUser.passwordHash
        delete MappedUser.salt
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

}