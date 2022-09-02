import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';

const LoginForm = ({ handleChange, error, handleFormSubmit, loading }: any) => {
    
    return (
        <Flex
            h={'100vh'}
            display="flex"
            alignItems="center"
        >
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
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
                    <Stack spacing={4}>
                        <FormControl id="username" isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input type="username" onChange={handleChange} data-input="username"/>

                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" onChange={handleChange} data-input="password"/>
                        </FormControl>
                        <Stack spacing={10}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                <Checkbox>Remember me</Checkbox>
                                <Link color={'blue.400'}>Forgot password?</Link>
                            </Stack>
                            <Button
                                isLoading={loading ? true : false}
                                loadingText='Logging in...'
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={(e) => handleFormSubmit(e)}>
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