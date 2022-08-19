import { Schema, model, models } from "mongoose"
import Top from './Top'
import Bottom from './Bottom'
import Footwear from './Footwear'
import Outfit from './Outfit'

interface UserInput {
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    userImage?: string,
    posts: object[],
    followers: object[],
    following: object[],
    tops: object[],
    bottoms: object[],
    footwear?: object[],
    outfits?: object[]
}

const UserSchema = new Schema<UserInput>(
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
        password: {
            type: String,
            required: true,
            minlength: 5
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
        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        following: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
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

UserSchema
    .virtual('followerCount')
    .get(function() {
        if (this.followers) return this.followers.length
    })
UserSchema
    .virtual('followingCount')
    .get(function() {
        if (this.following) return this.following.length
    })

export default models.User || model<UserInput>('User', UserSchema)