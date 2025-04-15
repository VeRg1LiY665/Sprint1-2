import {injectable} from "inversify";
import {LikesModel} from "../../../db/mongoDB";

@injectable()
export class LikesQRepo {
   /* async CountReactions(userId:string, parentId:string) {
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
    }*/

}