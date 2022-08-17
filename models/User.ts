import { Schema, model } from "mongoose"
import Top from './Top'
import Bottom from './Bottom'
import Footwear from './Footwear'
import Outfit from './Outfit'

interface User {
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    userImage?: string,
    posts: object[],
    friends: object[],
    tops: object[],
    bottoms: object[],
    footwear?: object[],
    outfits?: object[]
}

const userSchema = new Schema<User>(
    {
        username: {
            type: String, 
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Invalid email",
            ],
        },
        firstName: {
            type: String, 
            required: true,
            trim: true
        },
        lastName: {
            type: String, 
            required: true,
            trim: true
        },
        userImage: {
            type: String, 
        },
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'post'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ],
        tops: [Top],
        bottoms: [Bottom],
        footwear: [Footwear],
        outfits: [Outfit]
    },
    {
        toJSON: {
            getters: true
        },
        id: false
    }
)

userSchema
    .virtual('friendCount')
    .get(function() {
        if (this.friends) return this.friends.length
    })
const User = model<User>('user', userSchema)

export default User