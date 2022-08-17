import { makeExecutableSchema } from 'graphql-tools'
import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'

import { authMiddleware } from '../utils/auth'

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  context: authMiddleware
})