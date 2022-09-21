import React, { useState } from 'react';
import Layout from '../../../components/layouts/article'
import { Avatar, Box, Image, Text, Icon, Input, FormControl, Button, Spinner } from '@chakra-ui/react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { BsChat } from 'react-icons/bs'
import { IoPaperPlaneOutline } from 'react-icons/io5'
import { GetServerSideProps } from 'next';
import initializeApollo from '../../../apollo/client';
import { FIND_POST, FIND_POST_COMMENTS, FIND_USER_FOLLOW } from '../../api/queries';
import { useQuery, useMutation } from '@apollo/client';
import { ADD_POST_COMMENT } from '../../api/mutations';
import ImageCarousel from '../../../components/imageCarousel'
import { useRouter } from 'next/router';
import usePostLike from '../../../utils/customHooks/usePostLike';
import { LikedByUser } from '../../../ts/types'
import { useAtomValue } from 'jotai'
import { userProfileAtom } from '../../../lib/globalAtoms'

interface Outfit {
    top: {
        image: string;
    };
    bottom: {
        image: string;
    };
    footwear: {
        image: string;
    };
}

interface userId {
    userImage: string;
    username: string;
}

interface PostData {
    _id: string;
    postImage: string;
    userId: userId;
    outfit: Outfit;
    likedBy: LikedByUser[];
    description: string;
}

const Post = ({ postData }: { postData: PostData }) => {
    const [commentBody, setCommentBody] = useState('')
    const userProfile = useAtomValue(userProfileAtom)
    const Router = useRouter()

    const {
        _id,
        postImage,
        description,
        userId,
        outfit,
        likedBy
    } = postData

    // pass props here
    const [likedByUsers, setLikedByUsers] = useState<LikedByUser[] | []>(likedBy)
    const { isLiked, setIsLiked } = usePostLike({ likedBy, _id, userProfile })

    const {
        loading,
        data
    } = useQuery(FIND_POST_COMMENTS, { variables: { postId: _id } })


    const [addPostComment] = useMutation(ADD_POST_COMMENT, {
        update(cache, { data: { addPostComment: { comments } } }) {
            const { findPostComments }: any = cache.readQuery({
                query: FIND_POST_COMMENTS,
                variables: { postId: _id }
            });

            cache.writeQuery({
                query: FIND_POST_COMMENTS,
                data: {
                    findPostComments: {
                        ...findPostComments,
                        comments: comments
                    }
                }
            })
        }
    })

    const handleCommentInputChange = (e: any) => {
        const commentBody = e.target.value
        setCommentBody(commentBody)
    }

    const handleCommentAddition = () => {
        addPostComment({ variables: { postId: _id, commentBody: commentBody } })
        setCommentBody('')
    }

    const getLikedByNames = () => {
        return likedByUsers.map(({ username }: { username: string }, i: number) => {
            if (i === likedByUsers.length - 1) return (
                <Text key={username} cursor="pointer" as="span" fontWeight="bold" onClick={() => Router.push(`/${username}`)}>
                    {username}
                </Text>
            )
            return (
                <Text key={username} cursor="pointer" as="span" fontWeight="bold" onClick={() => Router.push(`/${username}`)}>
                    {`${username}, `}
                </Text>
            )
        })
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
                <ImageCarousel
                    width={"600px"}
                    height={"450px"}
                    _id={_id}
                    postImage={postImage}
                    topImage={outfit?.top?.image}
                    bottomImage={outfit?.bottom?.image}
                    footwearImage={outfit?.footwear?.image}
                    autoplay={false}
                    radio={false}
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
                            onClick={() => Router.push(`/${userId.username}`)}
                            cursor="pointer"
                        />

                        <Text
                            fontWeight="medium"
                            fontSize="sm"
                            onClick={() => Router.push(`/${userId.username}`)}
                            cursor="pointer"
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
                                    onClick={() => Router.push(`/${userId.username}`)}
                                    cursor="pointer"
                                />
                                <Text
                                    fontWeight="normal"
                                    fontSize="sm"
                                >
                                    <Text
                                        as="span"
                                        mr=".3em"
                                        fontWeight="medium"
                                        onClick={() => Router.push(`/${userId.username}`)}
                                        cursor="pointer"
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
                                            onClick={() => Router.push(`/${comment.userId.username}`)}
                                            cursor="pointer"
                                        />
                                        <Text
                                            fontWeight="normal"
                                            fontSize="sm"
                                        >
                                            <Text
                                                as="span"
                                                mr=".3em"
                                                fontWeight="medium"
                                                onClick={() => Router.push(`/${comment.userId.username}`)}
                                                cursor="pointer"
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
                        <Icon as={isLiked ? AiFillHeart : AiOutlineHeart}
                            color={isLiked ? "#ED4956" : "black"}
                            h={7} w={7}
                            ml="1em"
                            mr={4}
                            onClick={() => {
                                if (!userProfile) return;
                                setIsLiked(!isLiked);

                                if (isLiked) {
                                    setLikedByUsers((likedByUsers: LikedByUser[]) => (
                                        // .filter could pose problems in the long run when likes
                                        // count of users is much larger 
                                        likedByUsers.filter(({ _id }) => _id !== userProfile._id)
                                    ));
                                } else {
                                    const currentUser = {
                                        _id: userProfile._id,
                                        username: userProfile.username,
                                        userImage: userProfile.userImage,
                                        __typename: "User"
                                    }
                                    setLikedByUsers((likedByUsers: LikedByUser[]) => (
                                        [...likedByUsers, currentUser]
                                    ))
                                }
                            }}
                        />
                        <Icon as={BsChat} h="22px" w="22px" strokeWidth=".5px" mr={4} />
                        <Icon as={IoPaperPlaneOutline} h={6} w={6} />
                    </Box>

                    {!likedByUsers.length ?
                        <Text
                            ml="1.25em"
                            mt={1}
                            fontSize="sm"
                        >
                            {`Be the first to like ${userId.username}'s post!`}
                        </Text>
                        : likedByUsers.length <= 2 ?
                            <Text
                                ml="1.25em"
                                mt={1}
                                fontSize="sm"
                            >
                                Liked by {getLikedByNames()}
                            </Text>
                            :
                            <Text
                                ml="1.25em"
                                mt={1}
                                fontSize="sm"
                            >
                                Liked by {getLikedByNames()} and <Text as="span" fontWeight="bold">{likedByUsers.length} others</Text>.
                            </Text>
                    }

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
                        <Input
                            placeholder='Add a comment'
                            fontSize="sm"
                            w="250px" h="35px"
                            border="none"
                            onChange={handleCommentInputChange}
                            value={commentBody}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCommentAddition()
                            }}
                        />
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
    const client = initializeApollo(context)

    try {
        const { data: { findSinglePost } } = await client.query({
            query: FIND_POST,
            variables: { postId }
        })

        return {
            props: {
                postData: findSinglePost,
                initialApolloState: client.cache.extract()
            }
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


export default Post