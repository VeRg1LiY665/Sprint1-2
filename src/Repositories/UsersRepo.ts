import {UserDBType} from "../Data Types/UserDBType";
import {usersCollection} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";

export const UsersRepo = {

   /* async UserExistenceCheck(dto: {login: string, email: string }) {
        let filter = []
            filter.push({login: {$regex: dto.login, $options: 'i'}})
            filter.push({email: {$regex: dto.email, $options: 'i'}})
        const foundUser = await usersCollection
            .findOne({$or:filter})
        return (foundUser) ?  true: false
    },*/

    async ShowUser(searchData: string):Promise <UserDBType|null> {
        let filter: any = {};
        switch (true) {
            case  mongoose.isValidObjectId(searchData): filter._id = new ObjectId(searchData)
                break;
            case searchData.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) !== null : filter.email = searchData
                break;
            case searchData.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) !== null : filter["emailConfirmation.confirmationCode"] = searchData
                break;  // TODO Здесь точно не работет - сделать отдельный метод, фильтр в нем писать через кавычки ("emailConfirmation.confirmationCode" = searchData)
            default: filter.login = searchData
        }

        const user:UserDBType | null =  await usersCollection.findOne(filter)

        if(!user){
            return null
        }
        return user
    },

    async SetUpNewUser(user: UserDBType): Promise<string> {
       const res = await usersCollection.insertOne(user)
            return res.insertedId.toString();
    },

    async UpdateUser(user: UserDBType): Promise<boolean> {
        const res = await usersCollection.updateOne(
            {_id: user._id},
            {$set:{...user}}
        )
        return res.matchedCount === 1;
    },

    async DeleteUser(id: string): Promise<boolean> {
        try {const res = await usersCollection.deleteOne({_id : new ObjectId(id)})
        return res.deletedCount === 1;}
        catch (e) { console.error(e) }
        return false
    }
}