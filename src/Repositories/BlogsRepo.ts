import {InputBlogType} from "../IO Types/InputBlogType";
import {BlogModel, PostModel} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {BlogDBType} from "../Data Types/BlogDBType";
import {injectable} from "inversify";

@injectable()
export class BlogsRepo {
    async ShowBlogByID (id:string) {
        const _id = new ObjectId(id)
        const blog = await BlogModel.findOne({_id: _id}).lean();
        if (blog===null) {
            return null
        }
        return (blog)
    }

    async DeleteBlog (id:string) {
        const res = await BlogModel.deleteOne({_id : new ObjectId(id)})
        return res.deletedCount === 1;
    }

    async SetUpNewBlog(blog:BlogDBType) {

        const res = await BlogModel.insertOne(blog)
        return res._id.toString();
    }
    async ChangeBlog (id: string, content:InputBlogType) {

        const res = await BlogModel.updateOne(
            {_id: new ObjectId(id)},
            {$set:{...content}}
        )
        await PostModel.updateMany(
            {blogId:id},
            {$set:{blogName:content.name}}
        )

        return res.matchedCount === 1;
    }
}


