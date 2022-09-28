// Note- This is only available in production
import { NextPage } from 'next'
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import Router from 'next/router'

interface Props {
    statusCode?: Number;
}

const Error: NextPage<Props> = ({ statusCode }) => {
    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading
                display="inline-block"
                as="h2"
                size="2xl"
                color="twitter.500"
            >
                {`${statusCode}`}
            </Heading>
            <Text fontSize="18px" mt={3} mb={2}>
                Page Not Found
            </Text>
            <Text color={'gray.500'} mb={6}>
                {"The page you're looking for does not seem to exist"}
            </Text>

            <Button
                h="35px"
                colorScheme="twitter"
                color="white"
                variant="solid"
                onClick={() => Router.push('/')}
            >
                Go to Home
            </Button>
        </Box>
    )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error