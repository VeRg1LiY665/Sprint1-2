import {BlogsRepo} from "./Repositories/BlogsRepo";
import {BlogsServices} from "./Services/BlogsServices";
import {BlogsController} from "./Modules/Blogs/BlogsController";
import {BlogsQRepo} from "./Repositories/BlogsQRepo";

let objects:any[] = []

const blogsQRepo = new BlogsQRepo()
objects.push(blogsQRepo);

const blogsRepo = new BlogsRepo()
objects.push(blogsRepo);

const blogsService = new BlogsServices(blogsRepo)
objects.push(blogsService);

const blogsController = new BlogsController(blogsService,blogsQRepo)
objects.push(blogsController);


export const ioc = {
    getInstance<T>(ClassType: any) {
        const result = objects.find(r => r instanceof ClassType)
        return result as T
    }
}