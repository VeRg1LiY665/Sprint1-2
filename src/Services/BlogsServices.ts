import {InputBlogType} from "../IO Types/InputBlogType";
import {ObjectId} from "mongodb";
import {BlogsRepo} from "../Repositories/BlogsRepo";
import {BlogDBType} from "../Data Types/BlogDBType";

class BlogsService { // new class description
    async SetUpNewBlog(content:InputBlogType){
        const blog = new BlogDBType(
            new ObjectId(),
            content.name,
            content.description,
            content.websiteUrl,
            new Date().toISOString(),
            false)

        return await BlogsRepo.SetUpNewBlog(blog)

    }

    async UpdateBlog (id:string, content:InputBlogType){
        return await BlogsRepo.ChangeBlog(id, content)

    }

    async DeleteBlog (id:string){
        return await BlogsRepo.DeleteBlog(id)

    }
}

export const BlogsServices = new BlogsService(); //new class instance

/*
export const BlogsServices = {
    async SetUpNewBlog(content:InputBlogType){
        const blog = new BlogDBType(
            new ObjectId(),
            content.name, 
            content.description, 
            content.websiteUrl,
            new Date().toISOString(),
            false)

        return await BlogsRepo.SetUpNewBlog(blog)

    },

async UpdateBlog (id:string, content:InputBlogType){
        return await BlogsRepo.ChangeBlog(id, content)

},

    async DeleteBlog (id:string){
        return await BlogsRepo.DeleteBlog(id)

    }

}*/  //old version with plain object
