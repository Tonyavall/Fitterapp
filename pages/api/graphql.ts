import { authMiddleware } from '../../utils/auth'
import { ApolloServer } from 'apollo-server-micro'

import schema from '../../apollo/schema';

const server = new ApolloServer({
    schema,
    context: authMiddleware,
});

export default server