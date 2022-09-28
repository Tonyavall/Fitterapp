import React, { useState, ReactElement, ChangeEvent, useEffect } from 'react';
import Layout from '../../../components/layouts/article'
import { Avatar, Box, Image, Text, Icon, Input, FormControl, Button, Spinner } from '@chakra-ui/react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { BsChat } from 'react-icons/bs'
import { IoPaperPlaneOutline } from 'react-icons/io5'
import { GetServerSideProps } from 'next';
import initializeApollo from '../../../apollo/client';
import { FIND_POST, FIND_POST_SOCIALS } from '../../api/queries';
import { useQuery, useMutation } from '@apollo/client';
import { ADD_POST_COMMENT } from '../../api/mutations';
import ImageCarousel from '../../../components/imageCarousel';
import { useRouter } from 'next/router';
import usePostLike from '../../../utils/customHooks/usePostLike';
import { LikedByUser } from '../../../ts/types';
import { useAtomValue } from 'jotai';
import { userProfileAtom } from '../../../lib/globalAtoms';
import { UserProfile, UsePostLikeReturnValues } from '../../../ts/types';

interface Outfit {
    top: {
        image: string;
        __typename: string;
    };
    bottom: {
        image: string;
        __typename: string;
    };
    footwear: {
        image: string;
        __typename: string;
    };
}

export interface UserId {
    userImage: string;
    username: string;
    __typename: string;
}

interface PostData {
    _id: string;
    postImage: string;
    userId: UserId;
    outfit: Outfit;
    likedBy: LikedByUser[];
    description: string;
}

interface Props {
    postData: PostData;
}

export interface Comment {
    commentBody: string;
    userId: UserId;
    __typename: string;
    _id: string;
}

interface CommentsQuery {
    findPostSocials: Comment[];
}

/* For future reference:
    When querying a post I want to serverside render whatever I can
        This includes stuff that doesn't need to be optimistically updated
        such as the post image

    Stuff that needs to be handled as a normal query would be socials,
    because it needs to be consistently updated based on the user's interactions.
        I'm handling it now with the socials- likeCount/who has liked the post,
        and the comments

    So typically when we want to display the post we
        ssr the post
        then
        do a query for the comments and likes
*/

const Post: React.FC<Props> = ({ postData }): ReactElement => {
    const [commentBody, setCommentBody] = useState<string>('')
    const userProfile: UserProfile = useAtomValue(userProfileAtom)
    const Router = useRouter()

    const {
        _id,
        postImage,
        description,
        userId,
        outfit
    } = postData

    const {
        loading,
        data
    } = useQuery(FIND_POST_SOCIALS, { variables: { postId: _id } })

    const likedBy: LikedByUser[] = data?.findPostSocials?.likedBy || []
    const comments: Comment[] = data?.findPostSocials?.comments || []

    const {
        isLiked,
        getLikedByNames,
        handleLikeBtn,
        likeCount
    }: UsePostLikeReturnValues = usePostLike({ likedBy, _id, userProfile })

    const [addPostComment] = useMutation(ADD_POST_COMMENT, {
        update(cache, { data: { addPostComment: { comments } } }) {
            const data: CommentsQuery | null = cache.readQuery({
                query: FIND_POST_SOCIALS,
                variables: { postId: _id }
            });

            cache.writeQuery({
                query: FIND_POST_SOCIALS,
                data: {
                    findPostSocials: {
                        ...data?.findPostSocials,
                        comments: comments
                    }
                }
            })
        }
    })

    const handleCommentInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const commentBody = e.target.value
        setCommentBody(commentBody)
    }

    const handleCommentAddition = (): void => {
        if (!commentBody) return
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
                            comments.map((comment: any) => {

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
                            onClick={handleLikeBtn}
                        />
                        <Icon as={BsChat} h="22px" w="22px" strokeWidth=".5px" mr={4} />
                        <Icon as={IoPaperPlaneOutline} h={6} w={6} />
                    </Box>

                    <Box
                        h="31px"
                        overflow="auto"
                    >
                        {!likeCount ?
                            <Text
                                ml="1.25em"
                                mt={1}
                                fontSize="sm"
                            >
                                {`Be the first to like ${userId.username}'s post!`}
                            </Text>
                            : likeCount <= 2 ?
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
                                    Liked by {getLikedByNames(true)} and <Text as="span" fontWeight="bold">{likeCount - 1} others</Text>.
                                </Text>
                        }
                    </Box>

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
                            fontSize="xs"
                            w="250px" h="27.5px"
                            border="none"
                            borderRadius={0}
                            onChange={handleCommentInputChange}
                            value={commentBody}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCommentAddition()
                            }}
                        />
                        {/* @ts-ignore */}
                        <Button
                            h="27.5px"
                            border="none"
                            borderRadius={0}
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