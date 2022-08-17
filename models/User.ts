import { Schema, model } from "mongoose"

interface User {
    username: string,
    email: string,
    posts: object[],
    friends: object[]
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
        ]
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