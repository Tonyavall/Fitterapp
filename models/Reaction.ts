import { Schema } from 'mongoose'

interface Reaction {
    reactionBody: String,
    username: String,
    createdAt?: String,
}

const reactionSchema = new Schema<Reaction>(
    {
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },
        username: {
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

export default reactionSchema