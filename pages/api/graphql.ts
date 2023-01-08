import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { schema } from '../../apollo/schema';
import { getToken } from "next-auth/jwt";

const apolloServer = new ApolloServer({ 
    schema,
    csrfPrevention: true,
});

// todo- custom handler and cors wrapper

export default startServerAndCreateNextHandler(apolloServer, {
    context: async (req, res) => ({ req, res, user: await getToken({ req })}),
});