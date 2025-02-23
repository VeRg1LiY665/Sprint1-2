import {InputBlogType} from "../IO Types/InputBlogType";
import {ObjectId} from "mongodb";
import {blogsCollection, postsCollection} from "../db/mongoDB";
import {BlogsRepo} from "../Repositories/BlogsRepo";
import {PostsRepo} from "../Repositories/PostsRepo";

export const BlogsServices = {
    async SetUpNewBlog(content:InputBlogType){
        const blog = {
            ...content,
            _id: new ObjectId(),
            isMembership: false,
            createdAt: new Date().toISOString(),
        }
        return await BlogsRepo.SetUpNewBlog(blog)

    },



}