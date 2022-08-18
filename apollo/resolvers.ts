import User from "../models/User"
import Post from "../models/Post"
import { Types } from 'mongoose'

import { signToken } from "../utils/auth"

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
        posts: [Post]
        friends: [User]
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
    }
}