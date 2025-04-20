import {InputPostType} from "../IO Types/InputPostType";
import {BlogsQRepo} from "../Repositories/BlogsQRepo";
import {ObjectId} from "mongodb";
import {PostsRepo} from "../Repositories/PostsRepo";
import {PostDBType} from "../Data Types/PostDBType";
import {BlogOutputType} from "../IO Types/BlogOutputType";
import {CustomError, HttpStatuses, NotFoundError} from "../helpers/ErrorHandler";
import {injectable} from "inversify";

@injectable()
export class PostsServices {
    private postsRepo = new PostsRepo();
    private blogsQRepo = new BlogsQRepo();
    constructor(){
        this.postsRepo = new PostsRepo();
        this.blogsQRepo = new BlogsQRepo();
    }

    async SetUpNewPost(content: InputPostType) {
        const foundBlog:BlogOutputType|null = await this.blogsQRepo.ShowBlogByID(content.blogId)
    if (!foundBlog){throw new CustomError (
        'Invalid blog ID',
        HttpStatuses.BadRequest,
        [{message: 'Blog with stated lodId does not exist', field: 'blogId'}]
    )}
        const post = new PostDBType(
            new ObjectId(),
            content.title,
            content.shortDescription,
            content.content,
            content.blogId,
            foundBlog!.name,
            new Date().toISOString(),
            {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: [{
                                addedAt: '',      //Заглушка для последних лайков при создании поста
                                userId: '',
                                login: ''
                             }]
            },

        )

        await this.postsRepo.SetUpNewPost(post)

        return post._id.toString()
    }

    async SetUpNewPostForBlog(content: {title:string, shortDescription:string, content:string}, foundBlog:BlogOutputType) {

        const post = new PostDBType(
            new ObjectId(),
            content.title,
            content.shortDescription,
            content.content,
            foundBlog!.id,
            foundBlog!.name,
            new Date().toISOString(),
            {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: [{
                    addedAt: '',      //Заглушка для последних лайков при создании поста
                    userId: '',
                    login: ''
                }]
            },
        )

        try {await this.postsRepo.SetUpNewPost(post)}
        catch (e) {
            console.error(e)
            return null}

        return post._id.toString()

    }

    async DeletePost(id:string){
        const foundPost = await this.postsRepo.ShowPostByID(id)
        if (foundPost===null) {throw new NotFoundError("Post not Found");}
        return await this.postsRepo.DeletePost(id)
    }

    async UpdatePost(id: string, content:InputPostType){
        const foundPost = await this.postsRepo.ShowPostByID(id)
        if (foundPost===null) {throw new NotFoundError("Post not Found");}
        return await this.postsRepo.ChangePost(id, content)
    }
}


