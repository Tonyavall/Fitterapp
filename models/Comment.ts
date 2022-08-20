import { Schema } from 'mongoose'

interface comment {
    commentBody: String,
    userId: String,
    userImage: String,
    commentBody: String,
    createdAt?: String,
}

const commentSchema = new Schema<comment>(
    {
        userId: {
            type: String,
            required: true
        },
        userImage: {
            type: String,
        },
        userImage: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            maxlength: 280
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