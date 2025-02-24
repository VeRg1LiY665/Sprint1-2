import {Request} from "express";

export const paginationQueries = (req: Request) => {
    let pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
    let  pageSize= req.query.pageSize ? +req.query.pageSize : 10
    let sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    let sortDirection = req.query.sortDirection && req.query.sortDirection==='asc' ? 1 : -1
    let searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null

    return {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm}
}


/*
export const filter =() => {
    const byBlogId = blogId
        ? {blogId: new ObjectId(blogId)}
        : {}

    const search = searchNameTerm
        ? {title: {$regex: searchNameTerm, $options: 'i'}}
        : {}

    const byBlogName = blogName
        ? {blogName: blogName}
        : {}
}*/
