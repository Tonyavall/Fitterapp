import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { resolvers } from '../../apollo/resolvers';
import { typeDefs } from '../../apollo/typeDefs';
import { getToken } from "next-auth/jwt";

const apolloServer = new ApolloServer({ 
    resolvers,
    typeDefs,
    csrfPrevention: true,
});

// todo- custom handler and cors wrapper

export default startServerAndCreateNextHandler(apolloServer, {
    context: async (req, res) => ({ req, res, user: await getToken({ req })}),
});