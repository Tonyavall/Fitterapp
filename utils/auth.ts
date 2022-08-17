const jwt = require('jsonwebtoken')

import { NextApiRequest } from "next";

const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

interface UserDataRequest extends NextApiRequest {
    user: object
}

// Serverside auth
export const authMiddleware = ({ req }: { req: UserDataRequest }) => {
    let token = req.body.token || req.query.token || req.headers.authorization;

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
    }
    return req;
}

export const signToken = (
    { email, username, _id }: { email: string, username: string, _id: string }
) => {
    const payload = { email, username, _id };

    return jwt.sign(
        { data: payload },
        secret,
        { expiresIn: expiration }
    );
}

// Clientside auth

import decode, { JwtPayload } from 'jwt-decode';

class AuthService {
    getProfile() {
        return decode<JwtPayload>(this.getToken());
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    isTokenExpired(token: string) {
        try {
            // Not operator could cause issues later on
            const decoded = decode<JwtPayload>(token);
            if (!decoded.exp) throw Error("Decoded jwt payload is nullish/ undefined output at isTokenExpired")
            if (decoded.exp < Date.now() / 1000) {
                return true;
            } else return false;
        } catch (err) {
            return false;
        }
    }

    getToken() {
        // Retrieves the user token from localStorage
        const localToken = localStorage.getItem('id_token') || '';
        if (!localToken) throw Error('Unable to fetch local storage token from the user at getToken')
        return localToken
    }

    login(idToken: string) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken);

        window.location.assign('/');
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
        // this will reload the page and reset the state of the application
        window.location.assign('/');
    }
}

export default new AuthService();
