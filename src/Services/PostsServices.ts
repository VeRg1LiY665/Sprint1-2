import {InputPostType} from "../IO Types/InputPostType";
import {BlogsQRepo} from "../Repositories/BlogsQRepo";
import {ObjectId} from "mongodb";
import {PostsRepo} from "../Repositories/PostsRepo";
import {PostDBType} from "../Data Types/PostDBType";

export const PostsServices = {
    async SetUpNewPost(content: InputPostType) {
        const foundBlog = await BlogsQRepo.ShowBlogByID(content.blogId)

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

    async SetUpNewPostForBlog(blogID:string, content: Partial<InputPostType>) {
        const foundBlog = await BlogsQRepo.ShowBlogByID(blogID)

        const post = {
            ...content,
            _id: new ObjectId(),
            blogName: foundBlog!.name,
            createdAt: new Date().toISOString(),
        } as PostDBType

        try {await PostsRepo.SetUpNewPost(post)}
        catch (e) {
            console.error(e)
            return null}

        return post._id.toString()
    }

}