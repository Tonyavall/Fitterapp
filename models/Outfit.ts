import { Schema, model, models } from "mongoose"
import Top from './Top'
import Bottom from './Bottom'
import Footwear from './Footwear'

interface Outfit {
    userId: String,
    image: String,
    top: object,
    bottom: object,
    footwear: object,
    createdAt?: String,
}

const outfitSchema = new Schema<Outfit>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        top: Top,
        bottom: Bottom,
        footwear: Footwear,
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

export default models.Outfit || model<Outfit>('Outfit', outfitSchema)