import User from "../models/User"
import Post from "../models/Post"
import { Types } from 'mongoose'

import { UserInputError, AuthenticationError } from "apollo-server-micro"

import connectDb from "../lib/connection"

import { signToken } from "../utils/serverAuth"

type UserInput = {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
}

export const resolvers = {
    Query: {
        findMe: async (
            parent: undefined,
            args: undefined,
            context: any
        ) => {
            await connectDb()
            if (context.user) {
                const user = await User
                    .findById(context.user._id)
                    .populate([
                        {
                            path: 'tops',
                            populate: ['_id', 'image']
                        },
                        {
                            path: 'bottoms',
                            populate: ['_id', 'image']
                        },
                        {
                            path: 'footwear',
                            populate: ['_id', 'image']
                        },
                        {
                            path: 'outfits',
                            populate: ['_id', 'image']
                        }
                    ])
                return user;
            }
            throw new AuthenticationError('You have to be logged in!')
        },
        findUser: async (
            parent: undefined,
            { username }: { username: string },
            context: any
        ) => {
            await connectDb()
            try {
                if (context.user) {
                    const [user] = await User
                        .find({ username: username })
                        .populate([
                            {
                                path: 'posts',
                                populate: ['_id']
                            },
                            {
                                path: 'followers',
                                populate: ['_id']
                            },
                            {
                                path: 'following',
                                populate: ['_id']
                            },
                        ])
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
        findAllUsers: async (
            parent: undefined,
            args: undefined,
            context: undefined
        ) => {
            await connectDb()
            return await User.find({});
        },
        homeRecentTenPosts: async (
            parent: undefined,
            args: undefined,
            context: any
        ) => {
            await connectDb()
            if (context.user) {
                const { following }: any = await User
                    .find({ _id: context.user._id })
                    .populate({
                        path: 'following',
                        select: ['_id']
                    })
                const tenPosts = await Post
                    .find({ _id: following })
                    .sort({ createdAt: -1 })
                    .limit(10)
                return tenPosts;
            }
            throw new AuthenticationError('You have to be logged in!')
        },
        grabRandomTwelvePosts: async (
            parent: undefined,
            args: undefined,
            context: any
        ) => {
            // I have no idea if this code even works
            await connectDb()
            if (context.user) {
                const postCount: number = await Post.count()

                const grabRandomPost = async () => {
                    const random = Math.floor(Math.random() * postCount)
                    return await Post
                        .findOne()
                        .skip(random)
                }
                return Array.apply(null, Array(12)).map(grabRandomPost)
            }
            throw new AuthenticationError('You have to be logged in!')
        },
        findSinglePost: async (
            parent: undefined,
            { postId }: { postId: string },
            context: any
        ) => {
            if (context.user) {
                return await Post
                    .find({ _id: postId })
                    .populate([
                        {
                            path: 'comment',
                            populate: ['_id', 'image']
                        },
                        {
                            path: 'footwear',
                            populate: ['_id', 'image']
                        },
                        {
                            path: 'outfits',
                            populate: ['_id', 'image']
                        }
                    ])
            }
            throw new AuthenticationError('You have to be logged in!')
        }
    },
    Mutation: {
        createUser: async (
            parent: undefined,
            { email, username, firstName, lastName, password }: UserInput,
            context: any
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
                const token = signToken(user)
                return { user, token }
            } catch (error) {
                console.log(error)
                return error
            }
        },
        deleteUser: async (
            parent: undefined,
            { userId }: { userId: string },
            context: any
        ) => {
            try {
                await connectDb()
                await User.findOneAndDelete({ _id: userId })
                return { status: 200 }
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
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        createPost: async (
            parent: undefined,
            { outfit, postImage, description }: { outfit: string[], postImage: string, description: string },
            context: any
        ) => {
            await connectDb()
            try {
                const userId = context.user._id
                const createdPost = await Post.create({
                    userId,
                    postImage,
                    outfit,
                    description,
                })

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
            await connectDb()
            try {
                // Checking the current user
                const { isAdmin } = await User.findById(context.user._id)
                const userId = context.user._id

                if (userId === postOwnerId || isAdmin === true) {
                    const response = await Post.findOneAndDelete({ _id: postId })
                    if (!response) return { status: 404 }
                    return { response }
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
                const userId = context.user._id
                const username = context.user.username
                await Post.findOneAndUpdate(
                    { _id: postId },
                    { $push: { comments: { commentBody, userId, username } } },
                    { runValidators: true, new: true }
                )
                return { status: 200 }
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
            await connectDb()
            try {
                // Checking the current user
                const { isAdmin } = await User.findById(context.user._id)
                // Can delete comment only if 
                // 1. the user is the owner of the post
                // 2. the user is the owner of the comment
                // 3. the user is an admin
                if (
                    context.user._id === postOwnerId ||
                    context.user._id === commentOwnerId ||
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
            await connectDb()
            try {
                const userId = context.user._id

                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $push: { tops: { image } } },
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
            await connectDb()
            try {
                const userId = context.user._id

                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $push: { bottoms: { image } } },
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
            await connectDb()
            try {
                const userId = context.user._id

                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $push: { footwear: { image } } },
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
            { topId, bottomId, footwearId = null }: { topId: string, bottomId: string, footwearId: string | null },
            context: any
        ) => {
            await connectDb()
            try {
                const userId = context.user._id

                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $push: { outfits: { topId, bottomId, footwearId } } },
                    { runValidators: true, new: true }
                )
                if (!updatedUser) return { status: 404, message: 'User not found.' }
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
            await connectDb()
            try {
                const userId = context.user._id

                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $pull: { tops: { topId } } },
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
            await connectDb()
            try {
                const userId = context.user._id

                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $pull: { bottoms: { bottomId } } },
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
            await connectDb()
            try {
                const userId = context.user._id

                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $pull: { footwear: { footwearId } } },
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
            await connectDb()
            try {
                const userId = context.user._id

                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $pull: { outfits: { outfitId } } },
                    { runValidators: true, new: true }
                )
                if (!updatedUser) return { status: 404, message: 'User not found.' }
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
            await connectDb()
            try {
                const userId = context.user._id

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
    }
}