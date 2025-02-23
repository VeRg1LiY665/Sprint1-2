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

export const blogRouter = Router();

blogRouter.get('/', BlogQueryPageNumberValidation, BlogQueryPageSizeValidation, BlogQuerySortByValidation, BlogQuerySortDirectionValidation, blogsController.getBlogs)

blogRouter.get('/:id',ObjectIdValidationMiddleware, blogsController.getBlogByID)

blogRouter.get('/:id/posts', ObjectIdValidationMiddleware, BlogQueryPageNumberValidation, BlogQueryPageSizeValidation, BlogQuerySortByValidation, BlogQuerySortDirectionValidation, blogsController.getPostsForBlog)

blogRouter.post('/:id/posts',authMiddleware, ObjectIdValidationMiddleware, postsController.createPostForBlog)

blogRouter.post('/',authMiddleware, BlogNameValidation, BlogDescriptionValidation, BlogUrlLengthValidation, BlogUrlValidation, ErrorCollectionMiddleware, blogsController.createBlog)

blogRouter.delete('/:id',authMiddleware, ObjectIdValidationMiddleware, ObjectIdValidationMiddleware, blogsController.deleteBlog)

blogRouter.put('/:id',authMiddleware, BlogNameValidation, BlogDescriptionValidation, BlogUrlLengthValidation, BlogUrlValidation, ErrorCollectionMiddleware, ObjectIdValidationMiddleware, blogsController.updateBlog)