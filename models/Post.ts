import { Schema, model } from'mongoose'
import Reaction from './Reaction'

interface Post {
    postText: string,
    createdAt?: Date,
    username: string,
    reactions: object[]
}

const postSchema = new Schema<Post>(
    {
        postText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date: Date) => date.toString().match(/[A-Za-z]{3}\s\d{2}\s\d{4}/)?.[0]
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [Reaction]
    },
    {
        toJSON: {
            getters: true
        },
        id: false
    }
)

postSchema
    .virtual('reactionCount')
    .get(function() {
        if (this.reactions) return this.reactions.length
    })

const Post = model<Post>('post', postSchema)

export default Post