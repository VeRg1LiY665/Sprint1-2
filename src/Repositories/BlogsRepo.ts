import {InputBlogType} from "../IO Types/InputBlogType";
import {blogsCollection, postsCollection} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {BlogDBType} from "../Data Types/BlogDBType";
import {BlogOutputType} from "../IO Types/BlogOutputType";

export const BlogsRepo = {
    async ShowAllBlogs () {
        const AllBlogs = await blogsCollection.find().toArray();
        return AllBlogs.map(el=> (this.mapToOutput(el)))
    },
    async ShowBlogByID (id:string) {
        const _id = new ObjectId(id)
        const blog = await blogsCollection.findOne({_id : _id});
    if(!blog) { return null}
        return this.mapToOutput(blog)
        },
    async DeleteBlog (id:string) {
        const res = await blogsCollection.deleteOne({_id : new ObjectId(id)})
        return res.deletedCount === 1;
    },
    async SetUpNewBlog(content:InputBlogType) {
        const blog = {
            ...content,
            _id: new ObjectId(),
            isMembership: false,
            createdAt: new Date().toISOString(),
        }
        await blogsCollection.insertOne(blog)

        return this.mapToOutput(blog)
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

    mapToOutput(blog: BlogDBType): BlogOutputType {
        let MappedBlog:any = {id : (blog._id).toString(), ...blog}
        delete MappedBlog._id
        return MappedBlog as BlogOutputType
        }
}