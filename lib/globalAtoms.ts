import { atom } from "jotai";
import { UserProfile } from '../ts/types';

export const userProfileAtom = atom<UserProfile | null | undefined>(null)