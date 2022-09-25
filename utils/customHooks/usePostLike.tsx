import { useEffect, useState, useRef, SetStateAction } from 'react';
import { LIKE_POST, UNLIKE_POST } from '../../pages/api/mutations';
import { LikedByUser } from '../../ts/types';
import { UserProfile } from '../../ts/types'
import { useMutation } from '@apollo/client';
import { UsePostLikeReturnValues } from '../../ts/types'
import { Text } from '@chakra-ui/react'
import Router from 'next/router'

interface Props {
    likedBy: LikedByUser[];
    _id: string;
    userProfile: UserProfile | null | undefined;
}

const usePostLike = (
    { likedBy, _id, userProfile }: Props
): UsePostLikeReturnValues => {
    // handling optimistic updates through react state instead of apollo
    // the reason being I don't want to send a request on every button click
    // instead, the request is being sent everytime the user leaves the page
    // based on the isLiked state value
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const isLikedRef = useRef(false)
    isLikedRef.current = isLiked;
    // mutations 
    const [likePost] = useMutation(LIKE_POST)
    const [unlikePost] = useMutation(UNLIKE_POST)

    const [likedByUsers, setLikedByUsers] = useState<LikedByUser[] | []>(likedBy)

    useEffect(() => {
        const isCurrentlyLiked = likedBy
            .find((user: LikedByUser) => user._id === userProfile?._id)

        if (isCurrentlyLiked) {
            setIsLiked(true)
        } else {
            setIsLiked(false)
        }

        const handlePostStateOnLeave = (): void => {
            if (isLikedRef.current) {
                likePost({ variables: { postId: _id } })
            } else {
                unlikePost({ variables: { postId: _id } })
            }
        }
        // if the user leaves the window we send a request to the backend
        window.addEventListener('beforeunload', handlePostStateOnLeave);
        // likewise, we do the same for when this component unloads 
        return handlePostStateOnLeave;
    }, [_id, likePost, likedBy, unlikePost, userProfile])

    const getLikedByNames = (getSingleName: boolean = false): JSX.Element | JSX.Element[] => {
        if (getSingleName) {
            // randomizing the user triggers a hydration error
            // const randomNumber: number = Math.floor(Math.random() * likedByUsers.length)
            // setting randomUsername to first index till fixed
            const randomUsername: string = likedByUsers[0].username

            return (
                <Text key={randomUsername} cursor="pointer" as="span" fontWeight="bold" onClick={() => Router.push(`/${randomUsername}`)}>
                    {randomUsername}
                </Text>
            )
        } else {
            const likedByUsersElements: JSX.Element[] = likedByUsers.map(({ username }: { username: string }, i: number) => {
                // if its the last index
                if (i === likedByUsers.length - 1) {
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

    const handleLikeBtnClick = (): void => {
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
    }

    return {
        isLiked,
        getLikedByNames,
        handleLikeBtnClick,
        likesCount: likedByUsers.length
    }
}

export default usePostLike;