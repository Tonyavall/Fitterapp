export interface LikedByUser {
    _id: string;
    userImage: string;
    username: string;
}

export type UserProfile = {
    email: string;
    username: string;
    _id: string;
    isAdmin: boolean;
    userImage: string;
    __typename: string;
    bio: string;
}

export interface FindMeUserData {
    findMe: {
        bio: string;
        email: string;
        userImage: string;
        isAdmin: boolean;
        username: string;
        __typename: string;
        _id: string;
    } | null | undefined
}