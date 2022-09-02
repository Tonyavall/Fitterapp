import { atom } from "jotai"

type tokenLayout = {
    email: string
    username: string
    _id: string
    isAdmin: boolean
    userImage: string
}

export const userProfileAtom = atom<tokenLayout | null>(null)