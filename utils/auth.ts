const jwt = require('jsonwebtoken');
const { NextApiRequest } = require('next')

const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

export const authMiddleware = ({ req }: { req: typeof NextApiRequest }) => {
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