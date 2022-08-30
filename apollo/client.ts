import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { concatPagination } from '@apollo/client/utilities'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

const httpLink = createHttpLink({
    uri: 'http://localhost:3000/api/graphql',
});

const authLink = setContext((_, { headers }) => {
    // let token = (typeof window !== 'undefined') ? localStorage.getItem('id_token') : ''
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoidG9ueUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InRvbnlhdmFsbCIsIl9pZCI6IjYzMDA2ZTkxMzM5ZGQ3Y2ZiOWFiNzNkMCIsImlzQWRtaW4iOmZhbHNlLCJ1c2VySW1hZ2UiOiJodHRwczovL3ByM3NvY21lZGFwcC5zMy51cy13ZXN0LTEuYW1hem9uYXdzLmNvbS9JTUdfMjc0MisoMSkuanBnIn0sImlhdCI6MTY2MTgxNjE1NywiZXhwIjoxNjYxOTAyNTU3fQ.ToInSeVZOm_k0yWf_ldP0snt6ybyirxGuMWNgDDhlyY"
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    allPosts: concatPagination(),
                },
            },
        },
    }),
});

// export function addClientState(client: any, pageProps: any) {
//     if (pageProps?.props) {
//         pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
//         console.log(pageProps.props[APOLLO_STATE_PROP_NAME])
//     }

//     return pageProps
// }

export default client