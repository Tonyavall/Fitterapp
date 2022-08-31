import Navbar from '../navbar'
import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
const Main = ({ children }: React.PropsWithChildren) => {
    return (
        <Box>
            <Head>
                <title>Fitter</title>
                <meta name="Fitter" content="Post your fits!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Box as="main"
                display="flex"
                flexDirection="column"
                alignItems="center"
            >
                <Navbar />
                {children}
            </Box>
        </Box>
    )
}

export default Main