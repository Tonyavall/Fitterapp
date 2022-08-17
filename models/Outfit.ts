import { Schema } from 'mongoose'

interface Outfit {
    image: String,
    userId: String,
    top: object,
    bottom: object,
    footwear: object,
    createdAt?: String,
}

const outfitSchema = new Schema<Outfit>(
    {
        userId: {
            type: String,
            required: true
        },
        top: {
            type: Schema.Types.ObjectId,
            ref: 'top',
            required: true
        },
        bottom: {
            type: Schema.Types.ObjectId,
            ref: 'bottom',
            required: true
        },
        footwear: {
            type: Schema.Types.ObjectId,
            ref: 'footwear'
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