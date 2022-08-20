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

export default function SignupForm({handleChange, handleFormSubmit, error}: any) {
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
                                    <FormLabel>First Name</FormLabel>
                                    <Input type="firstName" data-input={'firstName'}/>
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl id="lastName" onChange={handleChange} isRequired>
                                    <FormLabel>Last Name</FormLabel>
                                    <Input type="lastName" data-input={'lastName'}/>
                                </FormControl>
                            </Box>
                        </HStack>
                        <FormControl id="username" onChange={handleChange} isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input type="username" data-input={'username'}/>
                        </FormControl>
                        <FormControl id="email" onChange={handleChange} isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" data-input={'email'}/>
                        </FormControl>
                        <FormControl id="password" onChange={handleChange} isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input type={showPassword ? 'text' : 'password'} data-input={'password'}/>
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
                                size="lg"
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={handleFormSubmit}>
                                Sign up
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                Already a user? <Link href="/login" color={'blue.400'}>Login</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}