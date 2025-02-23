import {blogsCollection} from "../db/mongoDB";
import {ObjectId} from "mongodb";
import {BlogDBType} from "../Data Types/BlogDBType";
import {BlogOutputType} from "../IO Types/BlogOutputType";

export const BlogsQRepo = {
    async ShowAllBlogs(dto:{
        pageNumber:number,
        pageSize:number,
        sortBy: string,
        sortDirection:number,
        searchNameTerm: string | null
    }):Promise<BlogOutputType[]> {

        const filter:any={};

        if(dto.searchNameTerm) {filter.title = {$regex:dto.searchNameTerm, $options: 'i'}}

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

    mapToOutput(blog: BlogDBType): BlogOutputType {
        let MappedBlog:any = {id : (blog._id).toString(), ...blog}
        delete MappedBlog._id
        return MappedBlog as BlogOutputType
    },

    PaginationMap(dto:{
        pageNumber:number,
        pageSize:number,
        blogs: BlogOutputType[]
    } ) {
return {
    pagesCount: Math.ceil(dto.blogs.length / dto.pageSize),
    page: dto.pageNumber,
    pageSize: dto.pageSize,
    totalCount: dto.blogs.length,
    items: dto.blogs
}

    }
}
