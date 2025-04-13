import "reflect-metadata"
import { Container, inject, injectable } from 'inversify'

import {BlogsRepo} from "./Repositories/BlogsRepo";
import {BlogsServices} from "./Services/BlogsServices";
import {BlogsController} from "./Modules/Blogs/BlogsController";
import {BlogsQRepo} from "./Repositories/BlogsQRepo";
import {UsersQRepo} from "./Repositories/UsersQRepo";
import {UsersRepo} from "./Repositories/UsersRepo";
import {UsersServices} from "./Services/UsersServices";
import {UsersController} from "./Modules/Users/UsersController";
import {PostsServices} from "./Services/PostsServices";
import {PostsRepo} from "./Repositories/PostsRepo";
import {PostsQRepo} from "./Repositories/PostsQRepo";
import {CommentsServices} from "./Services/CommentsServices";
import {CommentsRepo} from "./Repositories/CommentsRepo";
import {AuthServices} from "./Auth/Services/AuthService";
import {JwtService} from "./Auth/Services/JwtService";
import {RegServices} from "./Auth/Services/RegService";
import {PostsController} from "./Modules/Posts/PostsController";
import {CommentsController} from "./Modules/Comments/CommentsController";
import {CommentsQRepo} from "./Repositories/CommentsQRepo";
import {AuthController} from "./Auth/AuthController";
import {DevicesController} from "./Security/DevicesController";
import {DevicesServices} from "./Security/Services/DevicesService";
import {DevicesRepo} from "./Security/Repositories/DevicesRepo";
import {DevicesQRepo} from "./Security/Repositories/DevicesQRepo";
import {RequestsRepo} from "./Security/Repositories/RequestsRepo";


export const container: Container = new Container();

container.bind(BlogsController).toSelf();
container.bind(BlogsServices).toSelf();
container.bind(BlogsRepo).toSelf();
container.bind(BlogsQRepo).toSelf();


container.bind(PostsController).toSelf();
container.bind(PostsServices).toSelf();
container.bind(PostsRepo).toSelf();
container.bind(PostsQRepo).toSelf();

container.bind(CommentsController).toSelf();
container.bind(CommentsServices).toSelf();
container.bind(CommentsRepo).toSelf();
container.bind(CommentsQRepo).toSelf();

container.bind(UsersController).toSelf();
container.bind(UsersServices).toSelf();
container.bind(UsersRepo).toSelf();
container.bind(UsersQRepo).toSelf();

container.bind(AuthController).toSelf();
container.bind(AuthServices).toSelf();
container.bind(JwtService).toSelf();
container.bind(RegServices).toSelf();

container.bind(DevicesController).toSelf();
container.bind(DevicesServices).toSelf();
container.bind(DevicesRepo).toSelf();
container.bind(DevicesQRepo).toSelf();

container.bind(RequestsRepo).toSelf();

//////////////////////////////////////////////////////
/*
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
}*/  //Самописный IOC
