import { Schema } from 'mongoose'

interface comment {
    commentBody: String,
    userId: String,
    createdAt?: String,
}

const commentSchema = new Schema<comment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        commentBody: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    },
    {
        toJSON: {
            getters: true,
            virtuals: true
        },
        id: false
    }
)

export default commentSchema