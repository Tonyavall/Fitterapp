import User from "../models/User"
import Post from "../models/Post"
import Outfit from '../models/Outfit'
import connectDb from "../lib/connection"
import { ObjectId } from "mongoose"
import heapSort from "../utils/algos/heapsort"

type UserInput = {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
}

export const resolvers = {
    Query: {
        isLoggedIn: async (
            parent: undefined,
            args: undefined,
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                if (data) {
                    return true
                }
            } catch (error) {
                console.log(error)
                return error
            }
            throw new AuthenticationError(
                'Authentication token is invalid, please log in'
            )
        },
        loginRedirect: async (
            parent: undefined,
            args: undefined,
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                if (data) {
                    throw new AuthenticationError(
                        'User is already logged in.'
                    )
                } else {
                    return true
                }
            } catch (error) {
                console.log(error)
                return error
            }
        },
        findMe: async (
            parent: undefined,
            args: undefined,
            context: any
        ) => {

            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                if (data) {
                    const user = await User
                        .findById(data._id)
                        .populate('outfits')
                    console.log(user.username)
                    return user;
                }
            } catch (error) {
                console.log(error)
                return error
            }
            // cant throw auth error because navbar does a query and ofc the user isnt signed
            // in so this error stops the user from logging in
            // throw new AuthenticationError('You have to be logged in!')
        },
        findUser: async (
            parent: undefined,
            { username }: { username: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                if (data) {
                    const [user] = await User
                        .find({ username: username })
                        .populate(['posts'])

                    if (!user) {
                        throw new UserInputError(`Username ${username} was not found.`)
                    }
                    return user;
                }
            } catch (error) {
                return error
            }
            throw new AuthenticationError('You have to be logged in!')
        },
        findAllUsernames: async (
            parent: undefined,
            args: undefined,
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                if (data) {
                    const allUsers = await User.find();

                    return allUsers;
                }
            } catch (error) {
                return error
            }
            throw new AuthenticationError('You have to be logged in!')
        },
        findUserFollow: async (
            parent: undefined,
            { username }: { username: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                if (data) {
                    const [user] = await User
                        .find({ username: username })

                    if (!user) {
                        throw new UserInputError(`Username ${username} was not found.`)
                    }
                    return user;
                }
            } catch (error) {
                return error
            }
            throw new AuthenticationError('You have to be logged in!')
        },
        findThreeRecommended: async (
            parent: undefined,
            args: undefined,
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                if (data) {
                    const userCount: number = await User.count()
                    // Theres probably a better way to do this
                    let random = Math.floor(Math.random() * userCount)
                    const randomUserOne = await User
                        .findOne()
                        .skip(random)
                    random = Math.floor(Math.random() * userCount)
                    const randomUserTwo = await User
                        .findOne()
                        .skip(random)
                    random = Math.floor(Math.random() * userCount)
                    const randomUserThree = await User
                        .findOne()
                        .skip(random)

                    let data = new Map();

                    for (let obj of [randomUserOne, randomUserTwo, randomUserThree]) {
                        data.set(obj.username, obj);
                    }
                    // @ts-ignore
                    return [...data.values()];
                }
            } catch (error) {
                return error
            }
            throw new AuthenticationError('You have to be logged in!')
        },
        findFits: async (
            parent: undefined,
            args: undefined,
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                if (data) {
                    const user = await User
                        .findById(data._id)
                        .populate('outfits')
                    return user;
                }
            } catch (error) {
                return error
            }
            throw new AuthenticationError('You have to be logged in!')
        },
        findAllUsers: async (
            parent: undefined,
            args: undefined,
            context: undefined
        ) => {
            await connectDb()
            return await User.find({});
        },
        homeRecentPosts: async (
            parent: undefined,
            args: undefined,
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                if (data) {
                    const { following } = await User
                        .findOne({ _id: data._id })
                        .populate({
                            path: 'following',
                            select: ['_id']
                        })

                    const posts = await Post
                        .find({ userId: following.map(({ _id }: { _id: ObjectId }) => _id) })
                        .populate([
                            'userId',
                            'outfit',
                            {
                                path: 'comments',
                                populate: ['userId']
                            },
                            'likedBy'
                        ])
                        .sort({ createdAt: -1 })

                    return posts;
                }
            } catch (error) {
                return error
            }
            throw new AuthenticationError('You have to be logged in!')
        },
        grabRandomTwelvePosts: async (
            parent: undefined,
            args: undefined,
            context: any
        ) => {
            // I have no idea if this code even works
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                if (data) {
                    const postCount: number = await Post.count()

                    const grabRandomPost = async () => {
                        const random = Math.floor(Math.random() * postCount)
                        return await Post
                            .findOne()
                            .skip(random)
                    }
                    return Array.apply(null, Array(12)).map(grabRandomPost)
                }
            } catch (error) {
                console.log(error)
                return error
            }
            throw new AuthenticationError('You have to be logged in!')
        },
        findSinglePost: async (
            parent: undefined,
            { postId }: { postId: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                if (data) {
                    const [post] = await Post
                        .find({ _id: postId })
                        .populate([
                            'userId',
                            'outfit',
                            {
                                path: 'comments',
                                populate: ['userId']
                            },
                            'likedBy'
                        ])

                    if (!post) throw new UserInputError(`Post not found.`)
                    return post
                }
            } catch (error) {
                console.log(error)
                return error
            }
            throw new AuthenticationError('You have to be logged in!')
        },
        findPostSocials: async (
            parent: undefined,
            { postId }: { postId: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                if (data) {
                    const [post] = await Post
                        .find({ _id: postId })
                        .populate([
                            'userId',
                            {
                                path: 'comments',
                                populate: ['userId']
                            },
                            'outfit',
                            'likedBy'
                        ])

                    heapSort(post.comments, 'createdAt', 'desc');

                    if (!post) throw new UserInputError(`Post not found.`);
                    return post
                }
            } catch (error) {
                console.log(error)
                return error
            }
            throw new AuthenticationError('You have to be logged in!')
        }
    },
    Mutation: {
        createUser: async (
            parent: undefined,
            { email, username, firstName, lastName, password }: UserInput,
        ) => {
            try {
                await connectDb()

                const user = await User.create({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                })
                console.log(user)
                return user
            } catch (error) {
                console.log(error)
                return error
            }
        },
        // Need to update later
        // deleteUser: async (
        //     parent: undefined,
        //     { userId }: { userId: string },
        //     context: any
        // ) => {
        //     try {
        //         await connectDb()
        //         await User.findOneAndDelete({ _id: userId })
        //         return { status: 200 }
        //     } catch (error) {
        //         console.log(error)
        //         return error
        //     }
        // },
        updateUser: async (
            parent: undefined,
            { bio, userImage }: { bio: string, userImage: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                if (userImage) {
                    const updatedUser = await User.findOneAndUpdate(
                        { _id: data._id },
                        { $set: { bio: bio, userImage: userImage } },
                        { runValidators: true, new: true }
                    )

                    return updatedUser
                }
                const updatedUser = await User.findOneAndUpdate(
                    { _id: data._id },
                    { $set: { bio: bio } },
                    { runValidators: true, new: true }
                )
                console.log(updatedUser)
                return updatedUser
            } catch (error) {
                console.log(error)
                return error
            }
        },
        login: async (
            parent: undefined,
            { username, password }: { username: string, password: string },
            context: any
        ) => {
            await connectDb()
            const user = await User.findOne({ username });

            if (!user) {
                throw new AuthenticationError('Username not found.');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            await setLoginSession(context.res, user)

            return user
        },
        logout: async (
            parent: undefined,
            args: undefined,
            context: any
        ) => {
            removeTokenCookie(context.res)
            return true
        },
        createPost: async (
            parent: undefined,
            { outfitId, postImage, description }: { outfitId: string[], postImage: string, description: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                const userId = data._id
                const createdPost = await Post.create({
                    userId: userId,
                    postImage: postImage,
                    outfit: outfitId,
                    description: description,
                })
                await User.findOneAndUpdate(
                    { _id: userId },
                    { $push: { posts: createdPost._id } },
                    { runValidators: true, new: true }
                )
                return createdPost
            } catch (error) {
                console.log(error)
                return error
            }
        },
        deletePost: async (
            parent: undefined,
            { postId, postOwnerId }: { postId: string, postOwnerId: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                // Checking the current user
                const { isAdmin } = await User.findById(data._id)
                const userId = data._id

                if (userId === postOwnerId || isAdmin === true) {
                    const deletedPost = await Post.findOneAndDelete({ _id: postId })
                    if (!deletedPost) throw new UserInputError(`Post not found.`)
                    User.findOneAndUpdate(
                        { _id: userId },
                        { $pull: { posts: { _id: postId } } },
                        { runValidators: true, new: true }
                    )
                    return deletedPost
                }
                throw new AuthenticationError('Only the owner can delete that!');
            } catch (error) {
                console.log(error)
                return error
            }
        },
        addPostComment: async (
            parent: undefined,
            { commentBody, postId }: { commentBody: string, postId: string },
            context: any
        ) => {
            await connectDb()
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                const userId = data._id

                const updatedPost = await Post
                    .findOneAndUpdate(
                        { _id: postId },
                        { $push: { comments: { commentBody, userId } } },
                        { runValidators: true, new: true }
                    )
                    .populate([
                        'userId',
                        {
                            path: 'comments',
                            populate: {
                                path: 'userId',
                                populate: ['userImage', 'username']
                            }
                        },
                        'outfit'
                    ])
                if (!updatedPost) throw new UserInputError(`Post not found.`)

                heapSort(updatedPost.comments, 'createdAt', 'desc');

                return updatedPost
            } catch (error) {
                console.log(error)
                return error
            }
        },
        deletePostComment: async (
            parent: undefined,
            { commentId, postId, postOwnerId, commentOwnerId }:
                { commentId: string, postId: string, postOwnerId: string, commentOwnerId: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                // Checking the current user
                const { isAdmin } = await User.findById(data._id)
                // Can delete comment only if 
                // 1. the user is the owner of the post
                // 2. the user is the owner of the comment
                // 3. the user is an admin
                if (
                    data._id === postOwnerId ||
                    data._id === commentOwnerId ||
                    isAdmin === true
                ) {
                    await Post.findOneAndUpdate(
                        { _id: postId },
                        { $pull: { comments: { _id: commentId } } },
                        { runValidators: true, new: true }
                    )
                    return { status: 200 }
                }
                throw new AuthenticationError('Only the owner of the comment or post can delete that!');
            } catch (error) {
                console.log(error)
                return error
            }
        },
        addTop: async (
            parent: undefined,
            { image }: { image: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload
                const userId = data._id

                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $push: { tops: { image: image } } },
                    { runValidators: true, new: true }
                )
                if (!updatedUser) return { status: 404, message: 'User not found.' }

                return updatedUser
            } catch (error) {
                console.log(error)
                return error
            }
        },
        addBottom: async (
            parent: undefined,
            { image }: { image: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                const userId = data._id

                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $push: { bottoms: { image: image } } },
                    { runValidators: true, new: true }
                )
                if (!updatedUser) return { status: 404, message: 'User not found.' }
                return updatedUser
            } catch (error) {
                console.log(error)
                return error
            }
        },
        addFootwear: async (
            parent: undefined,
            { image }: { image: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                const userId = data._id

                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $push: { footwear: { image: image } } },
                    { runValidators: true, new: true }
                )
                if (!updatedUser) return { status: 404, message: 'User not found.' }
                return updatedUser
            } catch (error) {
                console.log(error)
                return error
            }
        },
        addOutfit: async (
            parent: undefined,
            { top, bottom, footwear = null }: { top: string, bottom: string, footwear: string | null },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                const userId = data._id

                const createdOutfit = await Outfit.create({
                    userId,
                    top,
                    bottom,
                    footwear
                })
                const updatedUser = await User
                    .findOneAndUpdate(
                        { _id: userId },
                        { $push: { outfits: createdOutfit._id } },
                        { runValidators: true, new: true }
                    )
                    .populate('outfits')
                return updatedUser
            } catch (error) {
                console.log(error)
                return error
            }
        },
        deleteTop: async (
            parent: undefined,
            { topId }: { topId: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                const userId = data._id
                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $pull: { tops: { _id: topId } } },
                    { runValidators: true, new: true }
                )
                if (!updatedUser) return { status: 404, message: 'User not found.' }
                return updatedUser
            } catch (error) {
                console.log(error)
                return error
            }
        },
        deleteBottom: async (
            parent: undefined,
            { bottomId }: { bottomId: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                const userId = data._id

                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $pull: { bottoms: { _id: bottomId } } },
                    { runValidators: true, new: true }
                )
                if (!updatedUser) return { status: 404, message: 'User not found.' }
                return updatedUser
            } catch (error) {
                console.log(error)
                return error
            }
        },
        deleteFootwear: async (
            parent: undefined,
            { footwearId }: { footwearId: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                const userId = data._id

                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $pull: { footwear: { _id: footwearId } } },
                    { runValidators: true, new: true }
                )
                if (!updatedUser) return { status: 404, message: 'User not found.' }
                return updatedUser
            } catch (error) {
                console.log(error)
                return error
            }
        },
        deleteOutfit: async (
            parent: undefined,
            { outfitId }: { outfitId: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                // HANDLE OUTFIT DELETION HERE
                const deletedOutfit = await Outfit.findOneAndDelete({ _id: outfitId })
                if (!deletedOutfit) throw new UserInputError(`Outfit was not found.`)
                const updatedUser = await User
                    .findOneAndUpdate(
                        { _id: data._id },
                        { $pull: { outfits: outfitId } },
                        { runValidators: true, new: true }
                    )
                    .populate('outfits')
                return updatedUser
            } catch (error) {
                console.log(error)
                return error
            }
        },
        addBio: async (
            parent: undefined,
            { bioBody }: { bioBody: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                const userId = data._id

                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $set: { bio: bioBody } },
                    { runValidators: true, new: true }
                )
                if (!updatedUser) return { status: 404, message: 'User not found.' }
                return updatedUser
            } catch (error) {
                console.log(error)
                return error
            }
        },
        addProfilePicture: async (
            parent: undefined,
            { image }: { image: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                const userId = data._id

                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $set: { userImage: image } },
                    { runValidators: true, new: true }
                )

                return updatedUser
            } catch (error) {
                console.log(error)
                return error
            }
        },
        followUser: async (
            parent: undefined,
            { userId }: { userId: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                const contextUserId = data._id

                // Updating to follow the user
                await User.findOneAndUpdate(
                    { _id: contextUserId },
                    { $push: { following: userId } },
                    { runValidators: true, new: true }
                )

                // Updating the followed user 
                const updatedFollowedUser = await User
                    .findOneAndUpdate(
                        { _id: userId },
                        { $push: { followers: contextUserId } },
                        { runValidators: true, new: true }
                    )

                return updatedFollowedUser
            } catch (error) {
                console.log(error)
                return error
            }
        },
        unFollowUser: async (
            parent: undefined,
            { userId }: { userId: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                const contextUserId = data._id

                await User.findOneAndUpdate(
                    { _id: contextUserId },
                    { $pull: { following: userId } },
                    { runValidators: true, new: true }
                )

                const updatedUnFollowedUser = await User
                    .findOneAndUpdate(
                        { _id: userId },
                        { $pull: { followers: contextUserId } },
                        { runValidators: true, new: true }
                    )

                return updatedUnFollowedUser
            } catch (error) {
                console.log(error)
                return error
            }
        },
        likePost: async (
            parent: undefined,
            { postId }: { postId: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                const contextUserId = data._id

                const updatedPost = await Post
                    .findOneAndUpdate(
                        { _id: postId },
                        { $addToSet: { likedBy: contextUserId } },
                        { runValidators: true, new: true }
                    )
                    .populate([
                        'userId',
                        'outfit',
                        {
                            path: 'comments',
                            populate: ['userId']
                        },
                        'likedBy'
                    ])

                heapSort(updatedPost.comments, 'createdAt', 'desc');

                return updatedPost
            } catch (error) {
                console.log(error)
                return error
            }
        },
        unlikePost: async (
            parent: undefined,
            { postId }: { postId: string },
            context: any
        ) => {
            try {
                await connectDb()
                const { data } = await getLoginSession(context.req) as JwtPayload

                const contextUserId = data._id

                const updatedPost = await Post
                    .findOneAndUpdate(
                        { _id: postId },
                        { $pull: { likedBy: contextUserId } },
                        { runValidators: true, new: true }
                    )
                    .populate([
                        'userId',
                        'outfit',
                        {
                            path: 'comments',
                            populate: ['userId']
                        },
                        'likedBy'
                    ])

                heapSort(updatedPost.comments, 'createdAt', 'desc');

                return updatedPost
            } catch (error) {
                console.log(error)
                return error
            }
        },
    }
}