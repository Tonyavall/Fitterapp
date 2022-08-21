import { atom } from "jotai"

const tokenLayout = { email: '', username: '', _id: '', isAdmin: false }

export const loggedInAtom = atom(false)
export const userProfileAtom = atom(tokenLayout)