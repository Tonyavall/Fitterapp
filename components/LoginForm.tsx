import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue
} from '@chakra-ui/react';
import Router from 'next/router';

const LoginForm = ({ handleChange, error, handleFormSubmit, loading }: any) => {

    return (
        <Flex
            h={'92vh'}
            w="375px"
            display="flex"
            alignItems="center"
        >
            <Stack spacing={8} mx={'auto'} maxW={'2xl'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Fitter</Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        share your cool <Link color={'blue.400'}>fits</Link> ✌️
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4} w="full">
                        <FormControl as="form" id="username" isRequired>
                            <FormLabel fontSize="sm">Username</FormLabel>
                            <Input
                                type="username"
                                onChange={handleChange}
                                data-input="username"
                                size="sm"
                                w="275px"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleFormSubmit(e)
                                }}
                                autoComplete="username"
                            />
                        </FormControl>
                        <FormControl as="form" id="password" isRequired>
                            <FormLabel fontSize="sm">Password</FormLabel>
                            <Input
                                type="password"
                                onChange={handleChange}
                                data-input="password"
                                size="sm"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleFormSubmit(e)
                                }}
                                autoComplete="current-password"
                            />
                        </FormControl>
                        <Stack spacing={10}>
                            <Text fontSize="sm">{"Don't have an account? "}<Link color="twitter.500" onClick={() => Router.push('/signup')}>Signup</Link></Text>
                            <Button
                                isLoading={loading ? true : false}
                                size="sm"
                                loadingText='Logging in...'
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={(e) => handleFormSubmit(e)}
                            >

                                Sign in
                            </Button>
                            {error ? (
                                <div>
                                    <p className="error-text">The provided credentials are incorrect</p>
                                </div>
                            ) : null}
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}

export default LoginForm
