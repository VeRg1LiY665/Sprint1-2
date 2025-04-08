import {blogsCollection} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {BlogDBType} from "../Data Types/BlogDBType";
import {BlogOutputType} from "../IO Types/BlogOutputType";

export class BlogsQRepo {
    async ShowAllBlogs(dto:{
        pageNumber:number,
        pageSize:number,
        sortBy: string,
        sortDirection:number,
        searchNameTerm: string | null
    }):Promise<BlogOutputType[]> {

        let filter:any={};

        if(dto.searchNameTerm) {filter.name = {$regex:dto.searchNameTerm, $options: 'i'}}
        const AllBlogs = await blogsCollection
            .find(filter)
            .sort(dto.sortBy, dto.sortDirection===1 ? 1 :-1)
            .skip((dto.pageNumber - 1) * dto.pageSize)
            .limit(dto.pageSize)
            .toArray();

        return AllBlogs.map(el=> (this.mapToOutput(el)))
    }

    async ShowBlogByID(id: string):Promise<BlogOutputType | null> {
        const _id = new ObjectId(id)
        const blog = await blogsCollection.findOne({_id: _id});
        if (!blog) {
            return null
        }
        return this.mapToOutput(blog)
    }

    async BlogsCounter(searchNameTerm:string|null):Promise<number>{
        let filter:any={};
        if(searchNameTerm!==null) {filter.name = {$regex:searchNameTerm, $options: 'i'}}
        return await blogsCollection.countDocuments(filter)
    }

    mapToOutput(blog: BlogDBType): BlogOutputType {
        let MappedBlog:any = {id : (blog._id).toString(), ...blog}
        delete MappedBlog._id
        return MappedBlog as BlogOutputType
    }

    PaginationMap(dto:{
        pageNumber:number,
        pageSize:number,
        blogsCount:number,
        blogs: BlogOutputType[]
    } ) {
        return {
            pagesCount: Math.ceil(dto.blogsCount / dto.pageSize),
            page: dto.pageNumber,
            pageSize: dto.pageSize,
            totalCount: dto.blogsCount,
            items: dto.blogs
        }
    }
}

//export const BlogsQRepo = new BlogQRepo();

/*export const BlogsQRepo = {
    async ShowAllBlogs(dto:{
        pageNumber:number,
        pageSize:number,
        sortBy: string,
        sortDirection:number,
        searchNameTerm: string | null
    }):Promise<BlogOutputType[]> {

        let filter:any={};

        if(dto.searchNameTerm) {filter.name = {$regex:dto.searchNameTerm, $options: 'i'}}
        const AllBlogs = await blogsCollection
            .find(filter)
            .sort(dto.sortBy, dto.sortDirection===1 ? 1 :-1)
            .skip((dto.pageNumber - 1) * dto.pageSize)
            .limit(dto.pageSize)
            .toArray();

        return AllBlogs.map(el=> (this.mapToOutput(el)))
    },

    async ShowBlogByID(id: string):Promise<BlogOutputType | null> {
        const _id = new ObjectId(id)
        const blog = await blogsCollection.findOne({_id: _id});
        if (!blog) {
            return null
        }
        return this.mapToOutput(blog)
    },

    async BlogsCounter(searchNameTerm:string|null):Promise<number>{
        let filter:any={};
        if(searchNameTerm!==null) {filter.name = {$regex:searchNameTerm, $options: 'i'}}
        return await blogsCollection.countDocuments(filter)
    },

    mapToOutput(blog: BlogDBType): BlogOutputType {
        let MappedBlog:any = {id : (blog._id).toString(), ...blog}
        delete MappedBlog._id
        return MappedBlog as BlogOutputType
    },

    PaginationMap(dto:{
        pageNumber:number,
        pageSize:number,
        blogsCount:number,
        blogs: BlogOutputType[]
    } ) {
return {
    pagesCount: Math.ceil(dto.blogsCount / dto.pageSize),
    page: dto.pageNumber,
    pageSize: dto.pageSize,
    totalCount: dto.blogsCount,
    items: dto.blogs
}
    }
}*/
