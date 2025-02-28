import {UserDBType} from "../Data Types/UserDBType";
import {usersCollection} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";

export const UsersRepo = {

    async ShowUser(searchData: string) {
        let filter: any = {};
        switch (true) {
            case  mongoose.isValidObjectId(searchData): filter._id = new ObjectId(searchData)
                break;
            case searchData.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) !== null : filter.email = searchData
                break;
            default: filter.login = searchData
        }

        const user=  await usersCollection.findOne(filter)
        if(!user){
            return null
        }
        return user
    },

    async SetUpNewUser(user: UserDBType): Promise<string> {
        const res = await usersCollection.insertOne(user)
            return res.insertedId.toString();



    },

    async DeleteUser(id: string): Promise<boolean> {
        try {const res = await usersCollection.deleteOne({_id : new ObjectId(id)})
        return res.deletedCount === 1;}
        catch (e) { console.error(e) }
        return false
    }
}