import {InputBlogType} from "../IO Types/InputBlogType";
import {blogsCollection, postsCollection} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {BlogDBType} from "../Data Types/BlogDBType";

export const BlogsRepo = {

    async DeleteBlog (id:string) {
        const res = await blogsCollection.deleteOne({_id : new ObjectId(id)})
        return res.deletedCount === 1;
    },

    async SetUpNewBlog(blog:BlogDBType) {

        const res = await blogsCollection.insertOne(blog)
        return res.insertedId.toString();
    },
    async ChangeBlog (id: string, content:InputBlogType) {

        const res = await blogsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set:{...content}}
        )
        await postsCollection.updateMany(
            {blogId:id},
            {$set:{blogName:content.name}}
        )

            return res.matchedCount === 1;
    },
}