import jwt from 'jsonwebtoken'
import { setTokenCookie, getTokenCookie } from './authCookies'
import { NextApiRequest, NextApiResponse } from 'next'
import Types from 'mongoose'

const secret = '178390hdioandowaghd8921y39bndjkasl'
const expiration = '24h';

interface userSessionPayload {
    _id: Types.ObjectId
    email: string
    username: string
    isAdmin: boolean
    userImage: string
}

export async function setLoginSession(
    res: NextApiResponse,
    { _id, email, username, isAdmin = false, userImage }: userSessionPayload
) {
    const tokenPayload = {
        _id,
        email,
        username,
        isAdmin,
        userImage,
    }

    const token = jwt.sign(
        { data: tokenPayload },
        secret,
        { expiresIn: expiration }
    )

    setTokenCookie(res, token)
}

export async function getLoginSession(req: NextApiRequest) {
    const token = getTokenCookie(req)
    if (!token) return { data: null }

    try {
        // splitting token to not include bearer
        const data = jwt.verify(token?.split(' ')[1], secret, { maxAge: expiration });

        return data
    } catch (error) {
        console.log('Invalid Token')
        return
    }
}