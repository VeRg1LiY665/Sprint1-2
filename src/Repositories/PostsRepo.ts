import {InputPostType} from "../IO Types/InputPostType";
import {BlogsRepo} from "./BlogsRepo";
import {postsCollection} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {PostDBType} from "../Data Types/PostDBType";
import {PostOutputType} from "../IO Types/PostOutputType";

export const PostRepo = {
    async ShowAllPosts () {
        const allPosts = await (postsCollection.find().toArray())
        return allPosts.map(el=> ({
            id : (el._id).toString(),
            title: el.title,
            shortDescription : el.shortDescription,
            content : el.content,
            blogId : el.blogId,
            blogName : el.blogName,
            createdAt: el.createdAt,
        }))
    },
    async ShowPostByID (id:string) {
        const _id = new ObjectId(id)
        const post= await postsCollection.findOne({_id : new ObjectId(id)})
        if(!post) { return null}
        return this.mapToOutput(post)
    },
    async DeletePost (id:string) {
        const res = await postsCollection.deleteOne({_id : new ObjectId(id)})
        return res.deletedCount === 1;
    },
    async SetUpNewPost(content:InputPostType) {
        const foundBlog = await BlogsRepo.ShowBlogByID(content.blogId)
        const post = {
            ...content,
            _id: new ObjectId(),
            blogName: foundBlog!.name,
            createdAt: new Date().toISOString(),
        }

        await postsCollection.insertOne(post)
        return this.mapToOutput(post)
    },
    async ChangePost (id: string, content:InputPostType) {

        const res = await postsCollection.updateOne(
            {_id:new ObjectId(id)},
            {$set:{...content}}
        )
if (res.matchedCount === 1) {
    const foundBlog = await BlogsRepo.ShowBlogByID(content.blogId)
    const origPost = await this.ShowPostByID(id)

    let updBlogName = {blogName: origPost!.blogName}
    if (content.blogId !== origPost!.blogId) {
        updBlogName =  {blogName: foundBlog!.name}
    }
    await postsCollection.updateOne(
        {_id:new ObjectId(id)},
        {$set:updBlogName}
    )
    return true;}

else {return false}
    },

    mapToOutput(post: PostDBType): PostOutputType {
        return {
            id : (post._id).toString(),
            title: post.title,
            shortDescription : post.shortDescription,
            content : post.content,
            blogId : post.blogId,
            blogName : post.blogName,
            createdAt: post.createdAt,
        }
    }
}