import React, { useEffect, useState } from 'react';
import Layout from '../../components/layouts/article'
import Router from 'next/router';
import { FIND_USER, FIND_USER_FOLLOW } from '../api/queries';
import { FOLLOW_USER, UNFOLLOW_USER } from '../api/mutations';
import createClient from '../../apollo/client'
import { GetServerSideProps } from 'next'
import {
    Avatar,
    Heading,
    Button,
    Text,
    Divider,
    Image,
    Box,
    Grid,
    GridItem,
    Img
} from "@chakra-ui/react";
import { useQuery, useMutation } from '@apollo/client'
interface UserData {
    _id: string
    username: string
    firstName: string
    lastName: string
    userImage: string
    postCount: string
    posts: object[]
}
import { useAtomValue } from 'jotai';
import { userProfileAtom } from '../../lib/globalAtoms';

const User = ({ data: { data: { findUser } } }: any) => {
    const userProfile = useAtomValue(userProfileAtom)
    const [isFollowing, setIsfollowing] = useState(false)
    
    const {
        _id,
        bio = '',
        firstName = 'John',
        lastName = 'Doe',
        postCount = 0,
        posts = [],
        userImage = '',
        username = 'John Doe',
    } = findUser

    // current users following
    const { data: userFollowData } = useQuery(FIND_USER_FOLLOW, {
        variables: { username }
    })

    useEffect(() => {
        userFollowData?.findUserFollow?.followers?.map((user: any) => {
            if (user._id === userProfile?._id) {
                setIsfollowing(true)
            }
        })
    }, [userFollowData, userProfile?._id])

    const [followUser] = useMutation(FOLLOW_USER, {
        update(cache, { data: { followUser: { followers, followerCount } } }) {
            //retrieve cached query value from memory
            const { findUserFollow }: any = cache.readQuery({
                query: FIND_USER_FOLLOW,
                variables: { username }
            })

            cache.writeQuery({
                query: FIND_USER_FOLLOW,
                data: {
                    findUserFollow: {
                        ...findUserFollow,
                        followers: followers,
                        followerCount: followerCount
                    }
                }
            })
        }
    })

    const [unFollowUser] = useMutation(UNFOLLOW_USER, {
        update(cache, { data: { unFollowUser: { followers, followerCount } } }) {
            //retrieve cached query value from memory
            const { findUserFollow }: any = cache.readQuery({
                query: FIND_USER_FOLLOW,
                variables: { username }
            })
            console.log(followers)
            cache.writeQuery({
                query: FIND_USER_FOLLOW,
                data: {
                    findUserFollow: {
                        ...findUserFollow,
                        followers: followers,
                        followerCount: followerCount
                    }
                }
            })
        }
    })

    const handlePostClick = (e: any) => {
        const postId = e.target.dataset.postid
        Router.push(`${username}/post/${postId}`)
    }

    const handleUserFollow = () => {
        followUser({ variables: { userId: _id } })
        setIsfollowing(true)
    }

    const handleUserUnfollow = () => {
        unFollowUser({ variables: { userId: _id } })
        setIsfollowing(false)
    }

    return (
        <Layout>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                h="fit-content"
                w="full"
                p={1.5}
                flexWrap="wrap"
            >
                <Box
                    display="flex"
                    w="300px"
                    ml={-20}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Avatar
                        w="150px"
                        h="150px"
                        zIndex="-1"
                        objectFit="scale-down"
                        src={userImage}
                    />
                </Box>

                <Box
                    m=".25em"
                    h="185px"
                >
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        alignItems="center"
                        p={1.5}
                        flexWrap="wrap"
                    >
                        <Heading size="lg" fontWeight="light" mr="1em" textAlign="left" mb={2}>
                            {username}
                        </Heading>
                        {userProfile?._id !== _id ?
                            <Box mb="-.5">
                                <Button colorScheme="twitter" size="sm" height={27.5} mr={2.5} w="85px" mb={-.5}>Message</Button>
                                {isFollowing ?
                                    <Button colorScheme="twitter" size="sm" height={27.5} w="85px" onClick={handleUserUnfollow} mb={-.5}>Following</Button>
                                    :
                                    <Button colorScheme="twitter" size="sm" height={27.5} w="85px" onClick={handleUserFollow} mb={-.5}>Follow</Button>
                                }
                            </Box>
                            :
                            <Box mb="-.5">
                                <Button colorScheme="twitter" size="sm" height={27.5} mr={2.5} w="85px" mb={-.5}
                                    onClick={() => Router.push('/settings')}
                                >
                                    Edit profile
                                </Button>
                            </Box>
                        }
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        px={2}
                        py={5}
                    >
                        <Box display="flex" flexDirection="row" mr="3em">
                            <Text mr=".3em" fontWeight="medium" minW={3}>{postCount}</Text>
                            <Text>posts</Text>
                        </Box>
                        <Box display="flex" flexDirection="row" mr="3em">
                            <Text mr=".3em" fontWeight="medium" minW={3}>{userFollowData?.findUserFollow?.followerCount}</Text>
                            <Text>followers</Text>
                        </Box>
                        <Box display="flex" flexDirection="row">
                            <Text mr=".3em" fontWeight="medium" minW={3}>{userFollowData?.findUserFollow?.followingCount}</Text>
                            <Text>following</Text>
                        </Box>
                    </Box>
                    <Text
                        px={2}
                        py={1.5}
                        fontWeight="bold"
                    >
                        {`${firstName} ${lastName}`}
                    </Text>
                    <Text
                        px={2}
                        fontWeight="light"
                    >
                        {bio}
                    </Text>
                </Box>
            </Box>
            <Divider borderColor="gray" my={10} />

            {/* POSTS HERE */}

            {
                postCount ?
                    <Grid
                        templateColumns="repeat(3, 1fr)"
                        gap={[0, 0, 2, 6, 6]}
                    >
                        {posts?.map((post: any) => {
                            return (
                                <GridItem
                                    key={post._id}
                                    onClick={e => handlePostClick(e)}
                                >
                                    <Image
                                        bg="lightgray"
                                        alt={username}
                                        boxSize={[113, 150, 243, 300, 300]}
                                        objectFit="cover"
                                        src={post.postImage}
                                        data-postid={post._id}
                                        cursor="pointer"
                                    />

                                </GridItem>
                            )
                        })}
                    </Grid>
                    :
                    <Heading fontWeight="light" fontSize="2rem" textAlign="center" m="1em">
                        {`${username} hasn't posted :(`}
                    </Heading>
            }
        </Layout >
    )
}
// error.networkError.result.errors
export const getServerSideProps: GetServerSideProps = async (context) => {
    const username = context?.params?.username
    const client = createClient(context)

    try {
        const data = await client.query<UserData, any>({
            query: FIND_USER,
            variables: { username },
        })

        return {
            props: { data },
        }
    } catch (error) {
        // @ts-ignore
        if (error?.graphQLErrors[0]?.extensions?.code === 'UNAUTHENTICATED') {
            return {
                redirect: {
                    destination: '/login',
                    permanent: true
                }
            }
        }
        return {
            notFound: true,
        }
    }
}

export default User