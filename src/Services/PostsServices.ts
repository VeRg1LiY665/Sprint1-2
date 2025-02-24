import {InputPostType} from "../IO Types/InputPostType";
import {BlogsQRepo} from "../Repositories/BlogsQRepo";
import {ObjectId} from "mongodb";
import {PostsRepo} from "../Repositories/PostsRepo";
import {PostDBType} from "../Data Types/PostDBType";
import {BlogOutputType} from "../IO Types/BlogOutputType";

export const PostsServices = {
    async SetUpNewPost(content: InputPostType) {
        const foundBlog:BlogOutputType|null = await BlogsQRepo.ShowBlogByID(content.blogId)

        const post = {
            ...content,
            _id: new ObjectId(),
            blogName: foundBlog!.name,
            createdAt: new Date().toISOString(),
        }

        try {await PostsRepo.SetUpNewPost(post)}
        catch (e) {
            console.error(e)
            return null}

        return post._id.toString()
    },

    async SetUpNewPostForBlog(content: Partial<InputPostType>, foundBlog:BlogOutputType) {

    const post = {
        ...content,
        _id: new ObjectId(),
        blogName: foundBlog!.name,
        blogId: foundBlog!.id,
        createdAt: new Date().toISOString(),
    } as PostDBType

        try {await PostsRepo.SetUpNewPost(post)}
        catch (e) {
            console.error(e)
            return null}

        return post._id.toString()

    }

}