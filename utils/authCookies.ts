import { serialize, parse } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
const TOKEN_NAME = 'token'
export const MAX_AGE = 60 * 60 * 24 // 24 hours

export function setTokenCookie(res: any, token: any) {

    const cookie = serialize(TOKEN_NAME, token, {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'lax',
    })
 
    res.setHeader('Set-Cookie', cookie)
}

export function removeTokenCookie(res: NextApiResponse) {
    const cookie = serialize(TOKEN_NAME, '', {
        maxAge: -1,
        path: '/',
    })

    res.setHeader('Set-Cookie', cookie)
}

export function getTokenCookie(req: NextApiRequest) {
    const token = req.headers.authorization
        
    return token
}