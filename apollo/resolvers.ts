import User from "../models/User"
import Post from "../models/Post"
import { signToken } from "../utils/auth"

export const resolvers = {
    Query: {
      viewer(_parent, _args, _context, _info) {
        return { id: 1, name: 'John Smith', status: 'cached' }
      },
    },
}