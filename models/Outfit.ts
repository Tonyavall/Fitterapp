import { Schema } from 'mongoose'

interface Outfit {
    image: String,
    userId: String,
    createdAt?: String,
}

const outfitSchema = new Schema<Outfit>(
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

export default outfitSchema