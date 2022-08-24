// This is where the token is SIGNED
// The token is unpacked in the clientside when needed

const jwt = require('jsonwebtoken')
import { Types } from 'mongoose';
import { NextApiRequest } from "next";
const secret = 'rejeanissofineong';
const expiration = '24h';

// MESSAGE FOR LATER - PROBLEM IS TOKEN NOT STORED IN QUERY
export const authMiddleware = ({ req }: { req: any }) => {
    let token = req.body?.token || req.query?.token || req.headers.authorization;
    
    if (req.headers.authorization) {
        token = token.split(' ').pop().trim();
    }

    if (!token) {
        return req;
    }

    try {
        const { data } = jwt.verify(token, secret, { maxAge: expiration });
        
        req.user = data;
    } catch {
        console.log('Invalid token');
        return
    }
    return req;
}

export const signToken = (
    { email, username, _id, isAdmin = false, userImage }: 
    { email: string, username: string, _id: Types.ObjectId, isAdmin: boolean, userImage: string }
) => {
    const payload = { email, username, _id, isAdmin, userImage };

    return jwt.sign(
        { data: payload },
        secret,
        { expiresIn: expiration }
    );
}