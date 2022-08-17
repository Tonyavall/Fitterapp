import { createServer } from '@graphql-yoga/node'
import gql from 'graphql-tag'

import { authMiddleware } from '../../utils/auth'

import resolvers from 'lib/resolvers'
import typeDefs from 'lib/schema'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
});

export default server