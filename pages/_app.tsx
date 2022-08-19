import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import client from '../apollo/client';
import { ApolloProvider } from '@apollo/client';
import Layout from '../components/layouts/main';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;