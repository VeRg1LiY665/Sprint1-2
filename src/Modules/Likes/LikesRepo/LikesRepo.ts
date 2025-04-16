import {injectable} from "inversify";
import {LikesDBType} from "../../../Data Types/LikesDBType";
import {LikesModel} from "../../../db/mongoDB";

@injectable()
export class LikesRepo {
    async ShowReaction(userId:string, parentId:string){
        const res = await LikesModel
            .findOne({
                $and:[
                    {userId : userId},
                    {parentId: parentId}]
            })
            .lean()
        return res;
    }

    async CreateLikeEntity (like:LikesDBType) {
        const res = await LikesModel.insertOne(like)
        return res._id.toString();
    }

    async UpdateLikeEntity (like:LikesDBType) {
        const res = await LikesModel.updateOne(
            {_id: like._id},
            {$set:{...like}}
        )
        return res.matchedCount === 1;
    }

    async CountReactions(userId:string, parentId:string) {
        const likes = await LikesModel.countDocuments(
            {$and:[
                    {userId : userId},
                    {parentId: parentId},
                    {status: 'Like'}
                ]}
        )

        const dislikes = await LikesModel.countDocuments(
            {$and:[
                    {userId : userId},
                    {parentId: parentId},
                    {status: 'Dislike'}
                ]}
        )

        return {likes, dislikes};
    }

}