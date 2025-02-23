import {postsCollection} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {PostDBType} from "../Data Types/PostDBType";
import {PostOutputType} from "../IO Types/PostOutputType";
import {BlogOutputType} from "../IO Types/BlogOutputType";

export const PostsQRepo = {
    async ShowAllPosts(dto:{
        pageNumber:number,
        pageSize:number,
        sortBy: string,
        sortDirection:number,
        searchNameTerm: string | null
    }):Promise<PostOutputType[]> {

        const filter:any={};

        if(dto.searchNameTerm) {filter.title = {$regex:dto.searchNameTerm, $options: 'i'}}

        const allPosts = await (postsCollection
            .find(filter)
            .sort(dto.sortBy, dto.sortDirection===1 ? 1 :-1)
            .skip((dto.pageNumber - 1) * dto.pageSize)
            .limit(dto.pageSize)
            .toArray())
        return allPosts.map(el=> (this.mapToOutput(el)))
    },

    async ShowPostByID(id: string) {
        const post = await postsCollection.findOne({_id: new ObjectId(id)})
        if (!post) {
            return null
        }
        return this.mapToOutput(post)
    },

    async ShowPostsForBlog(dto:{
        pageNumber:number,
        pageSize:number,
        sortBy: string,
        sortDirection:number,
        searchNameTerm: string | null,
        blogName: string
    }) {
        const filter:any={blogName: dto.blogName};

        if(dto.searchNameTerm) {filter.title = {$regex:dto.searchNameTerm, $options: 'i'}}
        const posts = await postsCollection
            .find(filter)
            .sort(dto.sortBy, dto.sortDirection===1 ? 1 :-1)
            .skip((dto.pageNumber - 1) * dto.pageSize)
            .limit(dto.pageSize)
            .toArray()

        if (!posts) {
            return null
        }
        return posts.map(el=> (this.mapToOutput(el)))
    },

    mapToOutput(post: PostDBType): PostOutputType {
        let MappedPost:any = {id : (post._id).toString(), ...post}
        delete MappedPost._id
        return MappedPost as PostOutputType
    },

    PaginationMap(dto:{
        pageNumber:number,
        pageSize:number,
        posts: PostOutputType[]
    } ) {
        return {
            pagesCount: Math.ceil(dto.posts.length / dto.pageSize),
            page: dto.pageNumber,
            pageSize: dto.pageSize,
            totalCount: dto.posts.length,
            items: dto.posts
        }

    }
}