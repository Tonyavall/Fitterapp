import React, { useEffect } from 'react';
import Layout from '../../components/layouts/article'
import { loggedInAtom } from '../../utils/globalAtoms'
import { useAtom } from 'jotai'
import Router from 'next/router';
import Auth from '../../utils/clientAuth'
import { FIND_USER } from '../api/queries';
import client, { addClientState } from '../../apollo/client'
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

interface UserData {
    _id: string
    username: string
    firstName: string
    lastName: string
    userImage: string
    postCount: string
    posts: object[]
}

const User = ({ data: { data: { findUser } } }: any) => {
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)

    const {
        bio = '',
        firstName = 'John',
        followerCount = 0,
        followingCount = 0,
        lastName = 'Doe',
        postCount = 0,
        posts = [],
        userImage = '',
        username = 'John Doe',
    } = findUser

    const handlePostClick = (e: any) => {
        const postId = e.target.dataset.postid
        Router.push(`${username}/post/${postId}`)
    }

    useEffect(() => {
        if (Auth.loggedIn()) {
            return setLoggedIn(true)
        }
        setLoggedIn(false)
        Router.push('/login')
    }, [setLoggedIn])

    return (
        <Layout>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-evenly"
                alignItems="center"
                h="fit-content"
                w="full"
                p={1.5}
                flexWrap="wrap"
            >
                <Avatar
                    w="150px"
                    h="150px"
                    m=".25em"
                    zIndex="-1"
                    objectFit="scale-down"
                    src={userImage}
                />

                <Box
                    w={[345, 550]}
                    m=".25em"
                    h="185px"
                >
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-evenly"
                        alignItems="center"
                        p={1.5}
                    >
                        <Heading size="lg" fontWeight="light">
                            {username}
                        </Heading>

                        <Box mb="-.5">
                            <Button colorScheme="twitter" size="sm" height={27.5} mr={2.5}>Message</Button>
                            <Button colorScheme="twitter" size="sm" height={27.5}>Follow</Button>
                        </Box>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        px={2}
                        py={5}
                    >
                        <Box display="flex" flexDirection="row" mr="3em">
                            <Text mr=".3em" fontWeight="medium">{postCount}</Text>
                            <Text>posts</Text>
                        </Box>
                        <Box display="flex" flexDirection="row" mr="3em">
                            <Text mr=".3em" fontWeight="medium">{followerCount}</Text>
                            <Text>followers</Text>
                        </Box>
                        <Box display="flex" flexDirection="row">
                            <Text mr=".3em" fontWeight="medium">{followingCount}</Text>
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

            {postCount ?
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
                                    boxSize={[85, 125, 206, 300, 300]}
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
        </Layout>
    )
}
// error.networkError.result.errors
export const getServerSideProps: GetServerSideProps = async (context) => {
    if (context.params === undefined) return
    const username = context.params.username

    try {
        const data = await client.query<UserData, any>({
            query: FIND_USER,
            variables: { username }
        })

        return addClientState(client, {
            props: { data },
        })
    } catch (error) {
        return {
            notFound: true,
        }
    }
}

export default User