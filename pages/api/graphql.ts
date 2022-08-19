import { authMiddleware } from '../../utils/serverAuth'
import { ApolloServer } from 'apollo-server-micro'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { typeDefs } from '../../apollo/typeDefs';
import { resolvers } from '../../apollo/resolvers';
// @ts-ignore
import cors from 'micro-cors'
const Cors = cors()

const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: authMiddleware,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})]
})
const startServer = server.start()
const graphqlPath = '/api/graphql'

// @ts-ignore
const startMongooseApollo = async (req, res) => {
    await startServer
    // @ts-ignore
    await server.createHandler({ path: graphqlPath })(req, res)
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default Cors(startMongooseApollo)