import { Schema, model } from'mongoose'
import Comment from './Comment'

interface Post {
    postBio: string,
    userId: string,
    comments: object[],
    createdAt?: Date
}

const postSchema = new Schema<Post>(
    {
        postBio: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        userId: {
            type: String,
            required: true,
        },
        comments: [Comment],
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date: Date) => date.toString().match(/[A-Za-z]{3}\s\d{2}\s\d{4}/)?.[0]
        },
    },
    {
        toJSON: {
            getters: true
        },
        id: false
    }
)

postSchema
    .virtual('commentCount')
    .get(function() {
        if (this.comments) return this.comments.length
    })

const Post = model<Post>('post', postSchema)

export default Post