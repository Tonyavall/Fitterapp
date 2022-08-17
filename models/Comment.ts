import { Schema } from 'mongoose'

interface comment {
    commentBody: String,
    userId: String,
    createdAt?: String,
}

const commentSchema = new Schema<comment>(
    {
        commentBody: {
            type: String,
            required: true,
            maxlength: 280
        },
        userId: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date: Date) => date.toString().match(/[A-Za-z]{3}\s\d{2}\s\d{4}/)?.[0]
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