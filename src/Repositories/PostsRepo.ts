import {InputPostType} from "../IO Types/InputPostType";
import {BlogsRepo} from "./BlogsRepo";
import {postsCollection} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {PostDBType} from "../Data Types/PostDBType";
import {PostOutputType} from "../IO Types/PostOutputType";
import {BlogsQRepo} from "./BlogsQRepo";
import {PostsQRepo} from "./PostsQRepo";

export const PostsRepo = {

    async DeletePost (id:string) {
        const res = await postsCollection.deleteOne({_id : new ObjectId(id)})
        return res.deletedCount === 1;
    },

    async SetUpNewPost(content:PostDBType) {
        try {await postsCollection.insertOne(content)}
        catch (e) {
            console.error(e);
            return false;
        }
        return true
    },

    async SetUpNewPostForBlog(blogId:string, content:InputPostType){
        const foundBlog = await BlogsQRepo.ShowBlogByID(content.blogId)
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
        return res.matchedCount===1
/*if (res.matchedCount === 1) {
    const foundBlog = await BlogsQRepo.ShowBlogByID(content.blogId)
    const origPost = await PostsQRepo.ShowPostByID(id)

    let updBlogName = {blogName: origPost!.blogName}
    if (content.blogId !== origPost!.blogId) {
        updBlogName =  {blogName: foundBlog!.name}
    }
    await postsCollection.updateOne(
        {_id:new ObjectId(id)},
        {$set:updBlogName}
    )
    return true;}

else {return false}*/
    },

    mapToOutput(post: PostDBType): PostOutputType {
        let MappedPost:any = {id : (post._id).toString(), ...post}
        delete MappedPost._id
        return MappedPost as PostOutputType
    }
}