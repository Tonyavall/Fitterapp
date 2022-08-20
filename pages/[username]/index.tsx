import React from 'react';
import { Types } from 'mongoose'
import { useQuery, gql } from '@apollo/client';

interface User {
    user: {
        _id: Types.ObjectId
        username: string
        email: string
        firstName: string
        lastName: string
        password: string
        userImage: string
        posts: object[]
        friends: object[]
        tops: object[]
        bottoms: object[]
        footwear: object[]
        outfits: object[]
    }
}

const User = () => {
    return (
        <p>
            User
        </p>
    )
}

export default User