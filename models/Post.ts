import { Schema, model, models } from'mongoose'
import Comment from './Comment'
import Outfit from './Outfit'

interface Post {
    description: string,
    userId: object,
    comments: object[],
    likedBy: object[],
    createdAt?: Date,
    outfit: object,
    postImage: string
}

const postSchema = new Schema<Post>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        description: {
            type: String,
            maxLength: 500,
            default: ''
        },
        comments: [Comment],
        outfit: {
            type: Schema.Types.ObjectId,
            ref: 'outfit',
            required: true
        },
        postImage: {
            type: String,
            required: true
        },
        likedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ],
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
postSchema
    .virtual('likes')
    .get(function() {
        if (this.likedBy) return this.likedBy.length
    })

export default models.post || model<Post>('post', postSchema)