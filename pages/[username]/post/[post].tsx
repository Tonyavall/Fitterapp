import React, { useEffect, useState } from 'react';
import Layout from '../../../components/layouts/article'
import { loggedInAtom } from '../../../utils/globalAtoms'
import { useAtom } from 'jotai'
import Router from 'next/router';
import Auth from '../../../utils/clientAuth'
import { Avatar, Box, Image, Text, Icon, Input, FormControl, Button, Spinner } from '@chakra-ui/react';
import { AiOutlineHeart } from 'react-icons/ai'
import { BsChat } from 'react-icons/bs'
import { IoPaperPlaneOutline } from 'react-icons/io5'
import { GetServerSideProps } from 'next';
import client from '../../../apollo/client';
import { FIND_POST, FIND_POST_COMMENTS } from '../../api/queries';
import { useQuery, useMutation } from '@apollo/client';
import { ADD_POST_COMMENT } from '../../api/mutations';

const Post = ({ data: { data: { findSinglePost } } }: any) => {
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)
    const [commentBody, setCommentBody] = useState('')

    const {
        _id,
        postImage,
        description,
        userImage,
        userId,
        outfit
    } = findSinglePost

    const {
        loading,
        error,
        data
    } = useQuery(FIND_POST_COMMENTS, { variables: { postId: _id } })

    const [addPostComment] = useMutation(ADD_POST_COMMENT, {
        update(cache, { data: { addPostComment: { comments } } }) {
            const data = cache.readQuery({
                query: FIND_POST_COMMENTS
            });
            console.log(data)
            //manipulate fitsQueryResult, writeQuery
            cache.writeQuery({
                query: FIND_POST_COMMENTS,
                data: {
                    findPostComments: {
                        comments: comments
                    }
                }
            })
        }
    })

    useEffect(() => {
        if (Auth.loggedIn()) {
            return setLoggedIn(true)
        }
        setLoggedIn(false)
        Router.push('/login')
    }, [setLoggedIn])

    const handleCommentInputChange = (e: any) => {
        const commentBody = e.target.value
        setCommentBody(commentBody)
    }

    const handleCommentAddition = () => {
        addPostComment({ variables: { postId: _id, commentBody: commentBody } })
        setCommentBody('')
    }

    return (
        <Layout>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                w="full"
                h="450px"
                mt="1.4em"
                flexWrap="wrap"
            >
                <Image
                    src={postImage}
                    alt="dnaiwdhjoa"
                    objectFit="cover"
                    w="600px"
                    h="450px"
                />

                {/* ENTIRE COMMENT SECTION CONTAINER */}
                <Box
                    h="full"
                    w="340px"
                    justifyContent="start"
                    alignItems="center"
                    flexDirection="column"
                    border="1px solid lightgray"
                >
                    <Box
                        h="60px"
                        w="full"
                        display="flex"
                        flexDirection="row"
                        justifyContent="start"
                        alignItems="center"
                        borderBottom="1px solid #EFEFEF"
                    >
                        <Avatar
                            size="sm"
                            m="1.25em"
                            src={userId.userImage}
                        />

                        <Text
                            fontWeight="medium"
                            fontSize="sm"
                        >
                            {userId.username}
                        </Text>
                    </Box>

                    {/* COMMENTS HERE */}
                    <Box
                        h="245px"
                        w="full"
                        overflowY="auto"
                        display="flex"
                        flexDirection="column"
                        justifyContent="start"
                        alignItems="start"
                        border=".005px lightgray"
                        css={{
                            '::-webkit-scrollbar': {
                                width: '2px',
                            },
                            '::-webkit-scrollbar-thumb': {
                                background: 'lightgray',
                                height: '10px',
                            }
                        }}
                    >
                        {description ?
                            <Box
                                display="flex"
                                flexDirection="row"
                                alignItems="center"
                            >
                                <Avatar
                                    size="sm"
                                    m="1.25em"
                                    alignSelf="start"
                                    src={userId.userImage}
                                />
                                <Text
                                    fontWeight="normal"
                                    fontSize="sm"
                                >
                                    <Text
                                        as="span"
                                        mr=".3em"
                                        fontWeight="medium"
                                    >
                                        {userId.username}
                                    </Text>

                                    {description}
                                </Text>
                            </Box>
                            :
                            null
                        }
                        {loading ?
                            <Spinner
                                justifySelf="center"
                                thickness='2px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='sm'
                                mt={10}
                                alignSelf="center"
                            />
                            :
                            data?.findPostComments?.comments.map((comment: any) => {
                                return (
                                    <Box
                                        key={comment._id}
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                    >
                                        <Avatar
                                            size="sm"
                                            m="1.25em"
                                            alignSelf="start"
                                            src={comment.userId.userImage}
                                        />
                                        <Text
                                            fontWeight="normal"
                                            fontSize="sm"
                                        >
                                            <Text
                                                as="span"
                                                mr=".3em"
                                                fontWeight="medium"
                                            >
                                                {comment.userId.username}
                                            </Text>

                                            {comment.commentBody}
                                        </Text>
                                    </Box>
                                )
                            })
                        }
                    </Box>

                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="start"
                        w="full"
                        alignItems="center"
                        h="50px"
                        borderY="1px solid #EFEFEF"
                    >
                        <Icon as={AiOutlineHeart} h={7} w={7} ml="1em" mr={4} />
                        <Icon as={BsChat} h="22px" w="22px" strokeWidth=".5px" mr={4} />
                        <Icon as={IoPaperPlaneOutline} h={6} w={6} />
                    </Box>

                    <Text
                        ml="1.25em"
                        mt={1}
                        fontSize="sm"
                    >
                        Liked by <Text as="span" fontWeight="bold">logic</Text> here.
                    </Text>
                    <Text
                        ml="1.6em"
                        mt={1}
                        fontSize=".7em"
                        fontWeight="light"
                    >
                        Aug 23, 2022
                    </Text>

                    <FormControl
                        flexDirection="row"
                        flexWrap="nowrap"
                        alignItems="center"
                        ml="1.15em"
                        mt="6px"
                    >
                        <Input placeholder='Add a comment' fontSize="sm" w="250px" h="35px" border="none" onChange={handleCommentInputChange} value={commentBody} />
                        {/* @ts-ignore */}
                        <Button
                            h="35px"
                            border="none"
                            bg="white"
                            fontSize="sm"
                            color="twitter.600"
                            fontWeight="bold"
                            ml="1px"
                            onClick={handleCommentAddition}
                        >
                            Post
                        </Button>
                    </FormControl>
                </Box>
            </Box>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const postId = context?.params?.post

    try {
        const data = await client.query<any, any>({
            query: FIND_POST,
            variables: { postId }
        })

        return {
            props: { data },
        }
    } catch (error) {
        return {
            notFound: true,
        }
    }
}

export default Post