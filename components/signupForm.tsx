import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

// Signup form
export default function SignupForm({ handleChange, handleFormSubmit, errorMessage }: any) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Sign up
                    </Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        to enjoy all of our cool features ✌️
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <HStack>
                            <Box>
                                <FormControl id="firstName" onChange={handleChange} isRequired>
                                    <FormLabel fontSize="sm">First Name</FormLabel>
                                    <Input type="firstName" data-input={'firstName'} size="sm" />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl id="lastName" onChange={handleChange} isRequired>
                                    <FormLabel fontSize="sm">Last Name</FormLabel>
                                    <Input type="lastName" data-input={'lastName'} size="sm" />
                                </FormControl>
                            </Box>
                        </HStack>
                        <FormControl id="username" onChange={handleChange} isRequired>
                            <FormLabel fontSize="sm">Username</FormLabel>
                            <Input type="username" data-input={'username'} size="sm" />
                        </FormControl>
                        <FormControl id="email" onChange={handleChange} isRequired>
                            <FormLabel fontSize="sm">Email address</FormLabel>
                            <Input type="email" data-input={'email'} size="sm" />
                        </FormControl>
                        <FormControl id="password" onChange={handleChange} isRequired>
                            <FormLabel fontSize="sm">Password</FormLabel>
                            <InputGroup>
                                <Input type={showPassword ? 'text' : 'password'} data-input={'password'} size="sm" />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() =>
                                            setShowPassword((showPassword) => !showPassword)
                                        }>
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Submitting"
                                size="sm"
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={handleFormSubmit}>
                                Sign up
                            </Button>
                            {errorMessage ? <Text>{errorMessage}</Text> : null}
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'} fontSize="sm">
                                Already a user? <Link fontSize="sm" href="/login" color={'blue.400'}>Login</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}