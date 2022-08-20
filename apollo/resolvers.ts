import User from "../models/User"
import Post from "../models/Post"
import { Types } from 'mongoose'

import { AuthenticationError } from "apollo-server-micro"

import connectDb from "../lib/connection"

import { signToken } from "../utils/serverAuth"

type UserInput = {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
}

interface currentUser {
    user: {
        _id: Types.ObjectId
        username: string
        email: string
        firstName: string
        lastName: string
        password: string
        userImage: string
        posts: object[]
        friends: object[]
        tops: object[]
        bottoms: object[]
        footwear: object[]
        outfits: object[]
        followerCount: number
        followingCount: number
    }
}

export const resolvers = {
    Query: {
        findMe: async (
            parent: undefined,
            args: undefined,
            context: currentUser
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
            context: currentUser
        ) => {
            await connectDb()
            if (context.user) {
                const user = await User
                    .find({ username: username })
                    .populate({
                        path: 'posts',
                        populate: ['_id', 'image']
                    })
                return user;
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
            context: currentUser
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
            context: currentUser
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
            context: currentUser
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
            context: currentUser
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
                console.log(token)
                return { user, token }
            } catch (error) {
                console.log(error)
                return error
            }
        },
        login: async (
            parent: undefined,
            { username, password }: { username: string, password: string },
            context: currentUser
        ) => {
            await connectDb()
            console.log(context)
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
        }
    }
}