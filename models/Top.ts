import { Schema } from 'mongoose'

interface Top {
    image: String,
    userId: String,
    createdAt?: String,
}

const topSchema = new Schema<Top>(
    {
        image: {
            type: String,
            required: true
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

export default topSchema