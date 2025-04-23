import {InputPostType} from "../IO Types/InputPostType";
import {BlogsQRepo} from "../Repositories/BlogsQRepo";
import {ObjectId} from "mongodb";
import {PostsRepo} from "../Repositories/PostsRepo";
import {PostDBType} from "../Data Types/PostDBType";
import {BlogOutputType} from "../IO Types/BlogOutputType";
import {CustomError, HttpStatuses, NotFoundError} from "../helpers/ErrorHandler";
import {injectable} from "inversify";
import {PostsQRepo} from "../Repositories/PostsQRepo";
import {AuthServices} from "../Auth/Services/AuthService";
import {LikesRepo} from "../Modules/Likes/LikesRepo/LikesRepo";

@injectable()
export class PostsServices {
    constructor(
        private postsRepo :  PostsRepo,
        private blogsQRepo :  BlogsQRepo,
        private postsQRepo :  PostsQRepo,
        private authServices :  AuthServices,
        private likesRepo: LikesRepo,
)
    {}

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

    async GetPosts(dto:{
        pageNumber:number,
        pageSize:number,
        sortBy: string,
        sortDirection:number,
        searchNameTerm:string | null,
        authData:string|undefined}) {

    const posts = await this.postsQRepo.ShowAllPosts({
        pageNumber:dto.pageNumber,
        pageSize:dto.pageSize,
        sortBy:dto.sortBy,
        sortDirection:dto.sortDirection,
        searchNameTerm:dto.searchNameTerm
    })
    const postsCount = await this.postsQRepo.PostsCounter(dto.searchNameTerm, null)  //null - чтобы счетчик  работал с исходной типизацией

    if(dto.authData) {
    const userData = await this.authServices.checkAccessToken(dto.authData)
    for (let i = 0; i<postsCount; i++) {
    const reaction = await this.likesRepo.ShowReactionForPost(userData.userId.toString(), posts[i].id)
    if(reaction) {posts[i].extendedLikesInfo.myStatus = reaction.status}
}
}

const result = this.postsQRepo.PaginationMap(
    {pageNumber:dto.pageNumber,
        pageSize:dto.pageSize,
        postsCount:postsCount,
        posts:posts})

return result
    }

    async GetPostById(dto:{id:string, authData:string|undefined}) {

        const post = await this.postsQRepo.ShowPostByID(dto.id)  //Это не нарушение SQRS, просто пробрасываем query-запрос через сервис
        if (!post) {
            throw new NotFoundError('Post not found')
        }

        if(dto.authData) {
            const userData = await this.authServices.checkAccessToken(dto.authData)

            const reaction = await this.likesRepo.ShowReactionForPost(userData.userId.toString(), post.id)
            if(reaction) {post.extendedLikesInfo.myStatus = reaction.status}
        }

        return post
    }
}


