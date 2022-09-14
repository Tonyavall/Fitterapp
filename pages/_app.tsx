import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import Layout from '../components/layouts/main';
import { Provider as JotaiProvider } from 'jotai';
import { useApollo } from '../apollo/client';
import cookie from 'next-cookies'
import App from 'next/app'

interface AppPropsWithToken extends AppProps {
  token: string
}

function MyApp({ Component, pageProps, token }: AppPropsWithToken,) {
  const client = useApollo(token, true, pageProps.initialApolloState)

  return (
    <ApolloProvider client={client}>
      <JotaiProvider>
        <ChakraProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </JotaiProvider>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async (appContext: any) => {
  const token = cookie(appContext.ctx).token
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, token }
}

export default MyApp;