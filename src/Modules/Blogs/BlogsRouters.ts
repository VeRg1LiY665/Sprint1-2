import {container} from "../../composition-root";
import {
    BlogDescriptionValidation,
    BlogNameValidation,
    BlogQueryPageNumberValidation,
    BlogQueryPageSizeValidation,
    BlogQuerySortByValidation,
    BlogQuerySortDirectionValidation,
    BlogUrlLengthValidation,
    BlogUrlValidation,
    ObjectIdValidationMiddleware
} from "./BlogsMiddlewares";
import {Router} from "express";
import {authMiddleware} from "../../Auth/Middlewares/BasicAuth";
import {postsController} from "../Posts/PostsController";
import {
    PostContentValidation,
    PostShortDescriptionValidation,
    PostTitleValidation
} from "../Posts/PostsMiddlewares";
import {ErrorCollectionMiddleware} from "../../helpers/InputValidation";
import {BlogsController} from "./BlogsController";

export const blogRouter = Router();
const blogsController = container.get(BlogsController);

blogRouter.get('/',
    BlogQueryPageNumberValidation,
    BlogQueryPageSizeValidation,
    BlogQuerySortByValidation,
    BlogQuerySortDirectionValidation,
    ErrorCollectionMiddleware,
    blogsController.getBlogs.bind(blogsController))

blogRouter.get('/:id',
    ObjectIdValidationMiddleware,
    ErrorCollectionMiddleware,
    blogsController.getBlogByID.bind(blogsController))

blogRouter.get('/:id/posts',
    ObjectIdValidationMiddleware,
    BlogQueryPageNumberValidation,
    BlogQueryPageSizeValidation,
    BlogQuerySortByValidation,
    BlogQuerySortDirectionValidation,
    postsController.getPostsForBlog.bind(postsController))

blogRouter.post('/:id/posts',
    authMiddleware,
    ObjectIdValidationMiddleware,
    PostTitleValidation,
    PostShortDescriptionValidation,
    PostContentValidation,
    ErrorCollectionMiddleware,
    postsController.createPostForBlog.bind(postsController))

blogRouter.post('/',
    authMiddleware,
    BlogNameValidation,
    BlogDescriptionValidation,
    BlogUrlLengthValidation,
    BlogUrlValidation,
    ErrorCollectionMiddleware,
    blogsController.createBlog.bind(blogsController))

blogRouter.delete('/:id',
    authMiddleware,
    ObjectIdValidationMiddleware,
    ObjectIdValidationMiddleware,
    ErrorCollectionMiddleware,
    blogsController.deleteBlog.bind(blogsController))

blogRouter.put('/:id',
    authMiddleware,
    BlogNameValidation,
    BlogDescriptionValidation,
    BlogUrlLengthValidation,
    BlogUrlValidation,
    ErrorCollectionMiddleware,
    ObjectIdValidationMiddleware,
    blogsController.updateBlog.bind(blogsController))