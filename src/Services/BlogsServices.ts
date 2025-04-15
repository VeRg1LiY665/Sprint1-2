import {injectable} from "inversify";
import {InputBlogType} from "../IO Types/InputBlogType";
import {ObjectId} from "mongodb";
import {BlogsRepo} from "../Repositories/BlogsRepo";
import {BlogDBType} from "../Data Types/BlogDBType";



@injectable()
export class BlogsServices { // new class description
    constructor(
        protected blogsRepo: BlogsRepo) {}  //create new instance of Repo during Service creation

    async SetUpNewBlog(content:InputBlogType){
        const blog = new BlogDBType(
            new ObjectId(),
            content.name,
            content.description,
            content.websiteUrl,
            new Date().toISOString(),
            false)

        return await this.blogsRepo.SetUpNewBlog(blog)

    }

    async UpdateBlog (id:string, content:InputBlogType){
        return await this.blogsRepo.ChangeBlog(id, content)

    }

    async DeleteBlog (id:string){
        return await this.blogsRepo.DeleteBlog(id)

    }
}

