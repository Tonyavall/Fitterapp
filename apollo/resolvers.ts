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

type LoggedInUser = {
    user: object
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
    }
}

export const resolvers = {
    Query: {
        user: async (
            parent: undefined,
            args: undefined,
            context: currentUser
        ) => {
            await connectDb()
            if (context.user) {
                const user = await User
                    .findById(context.user._id)
                    .populate({
                        path: 'tops',
                        populate: ['_id', 'image']
                    })
                    .populate({
                        path: 'bottoms',
                        populate: ['_id', 'image']
                    })
                    .populate({
                        path: 'footwear',
                        populate: ['_id', 'image']
                    })
                    .populate({
                        path: 'outfits',
                        populate: ['_id', 'image']
                    })
                return user;
            }
            throw new AuthenticationError('You have to be logged in!')
        },
        users: async (
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
            const { following }: any = User
                .find({_id: context.user._id})
                .populate({
                    path: 'following', 
                    select: ['_id'] 
                })
            const tenPosts = Post
                .find({_id: following})
                .sort({createdAt: -1})
                .limit(10)
            return tenPosts;
        },
    },
    Mutation: {
        createUser: async (
            parent: undefined,
            args: { input: UserInput },
            context: currentUser
        ) => {
            const user = await User.create(args.input)
            const token = signToken(user)
            return { user, token }
        },
        login: async (
            parent: undefined,
            { email, password }: { email: string, password: string }
        ) => {
            const user = await User.findOne({ email });

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