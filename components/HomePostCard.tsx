import {
    Box,
    Avatar,
    Text,
    Image,
    Icon,
    Heading,
} from '@chakra-ui/react';
import Router from 'next/router';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsChat } from 'react-icons/bs';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { HomeRecentPost } from '../pages';
import { UsePostLikeReturnValues } from '../ts/types';
import usePostLike from '../utils/customHooks/usePostLike';
import Link from 'next/link';;
import { useQuery } from '@apollo/client';
import { FIND_POST_SOCIALS } from '../pages/api/queries';
import { Comment } from '../pages/[username]/post/[post]';
import { LikedByUser } from '../ts/types';

// Used in home page
const HomePostCard: React.FC<HomeRecentPost> = ({
    _id,
    userId,
    description,
    postImage,
    userProfile
}): JSX.Element => {

    const {
        loading,
        data
    } = useQuery(FIND_POST_SOCIALS, { variables: { postId: _id } })

    const comments: Comment[] = data?.findPostSocials?.comments || []
    const likedBy: LikedByUser[] = data?.findPostSocials?.likedBy || []

    const {
        isLiked,
        getLikedByNames,
        handleLikeBtn,
        likeCount
    }: UsePostLikeReturnValues = usePostLike({ likedBy, _id, userProfile })

    return (
        <Box
            key={_id}
            border="1px solid"
            borderColor="lightgray"
            borderRadius="8px"
            w="475px"
            h="fit-content"
            pb=".8em"
            mb="1em"
        >
            <Box
                w="full"
                display="flex"
                flexDirection="row"
                alignItems="center"
                p=".8em"
            >
                <Avatar size="sm" src={userId?.userImage} mr=".8em" onClick={() => Router.push(`/${userId.username}`)} cursor="pointer" />
                <Text fontSize="sm" fontWeight="medium" onClick={() => Router.push(`/${userId.username}`)} cursor="pointer">{userId.username}</Text>
            </Box>
            <Image
                w="475px"
                h="350px"
                cursor="pointer"
                src={postImage}
                alt={`${userId.username}'s photo.`}
                objectFit="cover"
                data-postid={_id}
                onClick={(e) => Router.push(`/${userId.username}/post/${e.currentTarget.dataset.postid}`)}
            />
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
                    cursor="pointer"
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

            {description &&
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    ml="1.25em"
                    mt={1}
                    fontSize="sm"
                >
                    <Text fontSize="sm" fontWeight="bold" mr={1}>{userId.username}</Text>
                    <Text fontSize="sm">{description}</Text>
                </Box>
            }

            {comments.length ?
                <Heading
                    ml="1.25em"
                    my={2}
                    fontSize="sm"
                    fontWeight="normal"
                    color="gray"
                    data-postid={_id}
                    onClick={(e) => Router.push(`/${userId.username}/post/${e.currentTarget.dataset.postid}`)}
                    cursor="pointer"
                >
                    {`View all ${comments.length} comments`}
                </Heading>
                :
                <Heading
                    ml="1.25em"
                    my={2}
                    fontSize="sm"
                    fontWeight="normal"
                    color="gray"
                    data-postid={_id}
                    onClick={(e) => Router.push(`/${userId.username}/post/${e.currentTarget.dataset.postid}`)}
                    cursor="pointer"
                >
                    Be the first to comment!
                </Heading>
            }

            {comments?.slice(0, 3).map((comment: any) => {
                return (
                    <Box
                        key={comment._id + 312}
                        display="flex"
                        flexDirection="row"
                        ml="1.25em"
                        mt={1}
                        fontSize="sm"
                    >
                        <Link href={`/${comment.userId.username}`}>
                            <Text cursor="pointer" fontSize="sm" fontWeight="bold" mr={1}>{comment.userId.username}</Text>
                        </Link>
                        <Text fontSize="sm">{comment.commentBody}</Text>
                    </Box>
                )
            })}
        </Box>
    )
}

export default HomePostCard;