import { atom } from "jotai"

export type UserProfile = {
    email: string
    username: string
    _id: string
    isAdmin: boolean
    userImage: string
}

export const userProfileAtom = atom<UserProfile | null>(null)