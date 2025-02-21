import {postsCollection} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {PostDBType} from "../Data Types/PostDBType";
import {PostOutputType} from "../IO Types/PostOutputType";

export const PostsQRepo = {
    async ShowAllPosts() {
        const allPosts = await (postsCollection.find().toArray())
        return allPosts.map(el=> (this.mapToOutput(el)))
    },
    async ShowPostByID(id: string) {
        const post = await postsCollection.findOne({_id: new ObjectId(id)})
        if (!post) {
            return null
        }
        return this.mapToOutput(post)
    },

    async ShowPostsForBlog(id: string) {
        const post = await postsCollection.findOne({_id: new ObjectId(id)})
        if (!post) {
            return null
        }
        return this.mapToOutput(post)
    },

    mapToOutput(post: PostDBType): PostOutputType {
        let MappedPost:any = {id : (post._id).toString(), ...post}
        delete MappedPost._id
        return MappedPost as PostOutputType
    }
}