import { useEffect, useState, useRef, SetStateAction } from 'react';
import { LIKE_POST, UNLIKE_POST } from '../../pages/api/mutations';
import { LikedByUser } from '../../ts/types';
import { UserProfile } from '../../ts/types'
import { useMutation } from '@apollo/client';
import { UsePostLikeReturnValues } from '../../ts/types'

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
    // global states

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
        window.addEventListener('beforeunload', handlePostStateOnLeave)
        // likewise, we do the same for when this component unloads 
        return handlePostStateOnLeave
    }, [_id, likePost, likedBy, unlikePost, userProfile])

    return { isLiked, setIsLiked }
}

export default usePostLike;