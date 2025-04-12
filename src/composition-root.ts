import {BlogsRepo} from "./Repositories/BlogsRepo";
import {BlogsServices} from "./Services/BlogsServices";
import {BlogsController} from "./Modules/Blogs/BlogsController";
import {BlogsQRepo} from "./Repositories/BlogsQRepo";
import {UsersQRepo} from "./Repositories/UsersQRepo";
import {UsersRepo} from "./Repositories/UsersRepo";
import {UsersServices} from "./Services/UsersServices";
import {UsersController} from "./Modules/Users/UsersController";

let objects:any[] = []

const blogsQRepo = new BlogsQRepo()
objects.push(blogsQRepo);

const blogsRepo = new BlogsRepo()
objects.push(blogsRepo);

const blogsService = new BlogsServices(blogsRepo)
objects.push(blogsService);

const blogsController = new BlogsController(blogsService,blogsQRepo)
objects.push(blogsController);
//////////////////////////////////////////////////////
const usersQRepo = new UsersQRepo()
objects.push(blogsQRepo);

const usersRepo = new UsersRepo()
objects.push(blogsRepo);

const usersService = new UsersServices(usersRepo)
objects.push(usersService);

const usersController = new UsersController(usersService,usersQRepo)
objects.push(usersController);


export const ioc = {
    getInstance<T>(ClassType: any) {
        const result = objects.find(r => r instanceof ClassType)
        return result as T
    }
}