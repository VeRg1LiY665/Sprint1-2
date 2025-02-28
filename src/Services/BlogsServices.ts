import {InputBlogType} from "../IO Types/InputBlogType";
import {ObjectId} from "mongodb";
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

    },

async UpdateBlog (id:string, content:InputBlogType){
        return await BlogsRepo.ChangeBlog(id, content)

},

    async DeleteBlog (id:string){
        return await BlogsRepo.DeleteBlog(id)

    }

}