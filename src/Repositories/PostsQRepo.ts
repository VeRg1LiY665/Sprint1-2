import {PostModel} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {PostDBType} from "../Data Types/PostDBType";
import {PostOutputType} from "../IO Types/PostOutputType";
import {injectable} from "inversify";

@injectable()
export class PostsQRepo {
    async ShowAllPosts(dto:{
        pageNumber:number,
        pageSize:number,
        sortBy: string,
        sortDirection:number,
        searchNameTerm: string | null
    }):Promise<PostOutputType[]> {

        let filter:any={};

        if(dto.searchNameTerm) {filter.title = {$regex:dto.searchNameTerm, $options: 'i'}}

        const allPosts = await PostModel
            .find(filter)
            .sort({[dto.sortBy] : dto.sortDirection===1 ? 1 :-1})
            .skip((dto.pageNumber - 1) * dto.pageSize)
            .limit(dto.pageSize)
        return allPosts.map(el=> (this.mapToOutput(el)))
    }

    async ShowPostByID(id: string) {
        const post = await PostModel.findOne({_id: new ObjectId(id)})
        if (post===null) {
            return null
        }
        return this.mapToOutput(post)
    }

    async ShowPostsForBlog(dto:{
        pageNumber:number,
        pageSize:number,
        sortBy: string,
        sortDirection:number,
        searchNameTerm: string | null,
        blogId: string
    }) {
        const filter:any={blogId: dto.blogId};

        if(dto.searchNameTerm) {filter.title = {$regex:dto.searchNameTerm, $options: 'i'}}

        const posts = await PostModel
            .find(filter)
            .sort({[dto.sortBy] : dto.sortDirection===1 ? 1 :-1})
            .skip((dto.pageNumber - 1) * dto.pageSize)
            .limit(dto.pageSize)

        if (!posts) {
            return null
        }
        return posts.map(el=> (this.mapToOutput(el)))
    }

    async PostsCounter(searchNameTerm:string|null, blogId:string):Promise<number>{
        let filter:any={};
        if(searchNameTerm) {filter.title = {regex:searchNameTerm, options: 'i'}}
        if(blogId) {filter.blogId = blogId}
        return await PostModel.countDocuments(filter)
    }

    mapToOutput(post: PostDBType): PostOutputType {
        let MappedPost:any = {id : (post._id).toString(), ...post}
        delete MappedPost._id
        return MappedPost as PostOutputType
    }

    PaginationMap(dto:{
        pageNumber:number,
        pageSize:number,
        postsCount:number,
        posts: PostOutputType[]
    } ) {
        return {
            pagesCount: Math.ceil(dto.postsCount / dto.pageSize),
            page: dto.pageNumber,
            pageSize: dto.pageSize,
            totalCount: dto.postsCount,
            items: dto.posts
        }

    }
}

