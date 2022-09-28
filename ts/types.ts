import { SetStateAction } from "react";

export interface LikedByUser {
    _id: string;
    userImage: string;
    username: string;
}

export type UserProfile = {
    __typename: string;
    _id: string;
    email: string;
    username: string;
    bio: string;
    userImage: string;
    isAdmin: boolean;
} | null | undefined

export interface FindMeUserData {
    findMe: UserProfile;
}

// this hook returns a state variable with a setter function
export interface UsePostLikeReturnValues {
    isLiked: boolean;
    // setIsLiked: React.Dispatch<SetStateAction<boolean>>;
    getLikedByNames: (getSingleName?: boolean) => JSX.Element[] | JSX.Element;
    handleLikeBtn: () => void;
    likeCount: number;
}