import {InputBlogType} from "../IO Types/InputBlogType";
import {ObjectId} from "mongodb";
import {blogsCollection} from "../db/mongoDB";
import {BlogsRepo} from "../Repositories/BlogsRepo";

export const BlogsServices = {
    async SetUpNewBlog(content:InputBlogType){
        const blog = {
            ...content,
            _id: new ObjectId(),
            isMembership: false,
            createdAt: new Date().toISOString(),
        }
        return await BlogsRepo.SetUpNewBlog(blog)

    }



}