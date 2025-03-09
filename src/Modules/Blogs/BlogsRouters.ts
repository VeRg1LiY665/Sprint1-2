import {blogsController} from "./BlogsController";
import {
    BlogDescriptionValidation,
    BlogNameValidation,
    BlogQueryPageNumberValidation,
    BlogQueryPageSizeValidation,
    BlogQuerySortByValidation,
    BlogQuerySortDirectionValidation,
    BlogUrlLengthValidation,
    BlogUrlValidation,
    ErrorCollectionMiddleware,
    ObjectIdValidationMiddleware
} from "./BlogsMiddlewares";
import {Router} from "express";
import {authMiddleware} from "../../Auth/BasicAuth";
import {postsController} from "../Posts/PostsController";
import {
    InputValidationMiddleware,
    PostContentValidation,
    PostShortDescriptionValidation,
    PostTitleValidation
} from "../Posts/PostsMiddlewares";

export const blogRouter = Router();

blogRouter.get('/',
    BlogQueryPageNumberValidation,
    BlogQueryPageSizeValidation,
    BlogQuerySortByValidation,
    BlogQuerySortDirectionValidation,
    ErrorCollectionMiddleware,
    blogsController.getBlogs)

blogRouter.get('/:id',
    ObjectIdValidationMiddleware,
    ErrorCollectionMiddleware,
    blogsController.getBlogByID)

blogRouter.get('/:id/posts',
    ObjectIdValidationMiddleware,
    BlogQueryPageNumberValidation,
    BlogQueryPageSizeValidation,
    BlogQuerySortByValidation,
    BlogQuerySortDirectionValidation,

    postsController.getPostsForBlog)

blogRouter.post('/:id/posts',
    authMiddleware,
    ObjectIdValidationMiddleware,
    PostTitleValidation,
    PostShortDescriptionValidation,
    PostContentValidation,
    InputValidationMiddleware,
    postsController.createPostForBlog)

blogRouter.post('/',
    authMiddleware,
    BlogNameValidation,
    BlogDescriptionValidation,
    BlogUrlLengthValidation,
    BlogUrlValidation,
    ErrorCollectionMiddleware,
    blogsController.createBlog)

blogRouter.delete('/:id',
    authMiddleware,
    ObjectIdValidationMiddleware,
    ObjectIdValidationMiddleware,
    ErrorCollectionMiddleware,
    blogsController.deleteBlog)

blogRouter.put('/:id',
    authMiddleware,
    BlogNameValidation,
    BlogDescriptionValidation,
    BlogUrlLengthValidation,
    BlogUrlValidation,
    ErrorCollectionMiddleware,
    ObjectIdValidationMiddleware,
    blogsController.updateBlog)