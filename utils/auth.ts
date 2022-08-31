import Iron from '@hapi/iron'
import { MAX_AGE, setTokenCookie, getTokenCookie } from './authCookies'
import { NextApiRequest, NextApiResponse } from 'next'
import Types from 'mongoose'

const TOKEN_SECRET = 'rejeanissofineong'

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
    const createdAt = Date.now()

    const tokenPayload = { 
        _id, 
        email, 
        username, 
        isAdmin, 
        userImage, 
        createdAt, 
        maxAge: MAX_AGE 
    }
    
    const token = await Iron.seal(tokenPayload, TOKEN_SECRET, Iron.defaults)

    setTokenCookie(res, token)
}

export async function getLoginSession(req: NextApiRequest) {
    const token = getTokenCookie(req)

    if (!token) return

    const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults)
    const expiresAt = session.createdAt + session.maxAge * 1000

    // Validate the expiration date of the session
    if (Date.now() > expiresAt) {
        throw new Error('Session expired')
    }

    return session
}