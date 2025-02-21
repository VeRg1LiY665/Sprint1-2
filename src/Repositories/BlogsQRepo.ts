import {blogsCollection} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {BlogDBType} from "../Data Types/BlogDBType";
import {BlogOutputType} from "../IO Types/BlogOutputType";

export const BlogsQRepo = {
    async ShowAllBlogs() {
        const AllBlogs = await blogsCollection.find().toArray();
        return AllBlogs.map(el=> (this.mapToOutput(el)))
    },
    async ShowBlogByID(id: string) {
        const _id = new ObjectId(id)
        const blog = await blogsCollection.findOne({_id: _id});
        if (!blog) {
            return null
        }
        return this.mapToOutput(blog)
    },

    async ShowPostsForBlog(id: string) {
        const _id = new ObjectId(id)
        const posts = await blogsCollection.find({_id:_id}).toArray();
        if (!posts) {
            return null
        }
        return posts.map(el=> (this.mapToOutput(el)))

    },


    mapToOutput(blog: BlogDBType): BlogOutputType {
        let MappedBlog:any = {id : (blog._id).toString(), ...blog}
        delete MappedBlog._id
        return MappedBlog as BlogOutputType
    },
}
