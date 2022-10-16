import { useEffect, useState, useRef, SetStateAction } from 'react';
import { LIKE_POST, UNLIKE_POST } from '../../pages/api/mutations';
import { LikedByUser } from '../../ts/types';
import { UserProfile } from '../../ts/types';
import { useMutation } from '@apollo/client';
import { UsePostLikeReturnValues } from '../../ts/types';
import { Text } from '@chakra-ui/react';
import Router from 'next/router';
import { FIND_POST_SOCIALS } from '../../pages/api/queries'

interface Props {
    likedBy: LikedByUser[];
    _id: string;
    userProfile: UserProfile;
}

const usePostLike = (
    { likedBy = [], _id, userProfile }: Props
): UsePostLikeReturnValues => {
    // cache data being lost is due to some likedBy images coming out null for osme reason
    const [likePost] = useMutation(LIKE_POST, {
        update(cache, { data: { likePost: { likedBy } } }) {
            const { findPostSocials }: any = cache.readQuery({
                query: FIND_POST_SOCIALS,
                variables: { postId: _id }
            })

            cache.writeQuery({
                query: FIND_POST_SOCIALS,
                data: {
                    findPostSocials: {
                        ...findPostSocials,
                        likedBy: likedBy,
                    }
                }
            })
        }
    })

    const [unlikePost] = useMutation(UNLIKE_POST, {
        update(cache, { data: { unlikePost: { likedBy } } }) {
            const { findPostSocials }: any = cache.readQuery({
                query: FIND_POST_SOCIALS,
                variables: { postId: _id }
            })

            cache.writeQuery({
                query: FIND_POST_SOCIALS,
                data: {
                    findPostSocials: {
                        ...findPostSocials,
                        likedBy: likedBy,
                    }
                }
            })
        }
    })

    const getLikedByNames = (getSingleName: boolean = false): JSX.Element | JSX.Element[] => {
        if (getSingleName) {
            // randomizing the user triggers a hydration error
            // const randomNumber: number = Math.floor(Math.random() * likedByUsers.length)
            // setting randomUsername to first index till fixed
            const randomUsername: string = likedBy[0]?.username

            return (
                <Text key={randomUsername} cursor="pointer" as="span" fontWeight="bold" onClick={() => Router.push(`/${randomUsername}`)}>
                    {randomUsername}
                </Text>
            )
        } else {
            const likedByUsersElements: JSX.Element[] = likedBy?.map(({ username }: { username: string }, i: number) => {
                // if its the last index
                if (i === likedBy?.length - 1) {
                    return (
                        <Text key={username} cursor="pointer" as="span" fontWeight="bold" onClick={() => Router.push(`/${username}`)}>
                            {username}
                        </Text>
                    )
                }
                // otherwise
                return (
                    <Text key={username} cursor="pointer" as="span" fontWeight="bold" onClick={() => Router.push(`/${username}`)}>
                        {`${username}, `}
                    </Text>
                )
            })

            return likedByUsersElements;
        }
    }

    // Handling isLiked state and btns here
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [likeCount, setLikeCount] = useState<number>(0)

    useEffect(() => {
        // Setting the liked value based on post query if the user has liked it or not
        const isLiked: boolean = !!likedBy
            .find((user: LikedByUser) => user._id === userProfile?._id);

        setIsLiked(isLiked)
        setLikeCount(likedBy.length)
    }, [likedBy, userProfile?._id])

    const handleLikeBtn = (): void => {
        if (!userProfile) return;

        if (isLiked) {
            unlikePost({ variables: { postId: _id } })
        } else {
            likePost({ variables: { postId: _id } })
        }
    }

    return {
        isLiked,
        getLikedByNames,
        handleLikeBtn,
        likeCount
    }
}

export default usePostLike;