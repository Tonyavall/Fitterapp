import {
    Heading,
    Avatar,
    Box,
    Center,
    Flex,
    Text,
    Stack,
    Button,
    useColorModeValue,
} from '@chakra-ui/react';
import Router from 'next/router';

interface userObj {
    userImage: string
    username: string
    followingCount: boolean
    followerCount: boolean
}

const SocialCard = ({ user }: { user: userObj }) => {
    return (
        <Center py={6} mx={5}>
            <Box
                w="225px"
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}>
                <Box
                    h={'75px'}
                    w={'full'}
                    bg="twitter.500"
                />
                <Flex justify={'center'} mt={-12}>
                    <Avatar
                        size={'xl'}
                        src={user.userImage}
                        css={{
                            border: '2px solid white',
                        }}
                    />
                </Flex>

                <Box p={6}>
                    <Stack spacing={0} align={'center'} mb={5}>
                        <Heading fontSize={'lg'} fontWeight={500} fontFamily={'body'}>
                            {user.username}
                        </Heading>
                    </Stack>

                    <Stack direction={'row'} justify={'center'} spacing={6}>
                        <Stack spacing={0} align={'center'}>
                            <Text fontWeight={600}>{user?.followerCount}</Text>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                Followers
                            </Text>
                        </Stack>
                        <Stack spacing={0} align={'center'}>
                            <Text fontWeight={600}>{user?.followingCount}</Text>
                            <Text fontSize={'sm'} color={'gray.500'}>
                                Following
                            </Text>
                        </Stack>
                    </Stack>

                    <Button
                        w={'full'}
                        mt={8}
                        h="35px"
                        colorScheme="twitter"
                        rounded={'md'}
                        onClick={() => Router.push(`/${user.username}`)}
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                        }}>
                        View
                    </Button>
                </Box>
            </Box>
        </Center>
    );
}

export default SocialCard