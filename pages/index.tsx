import type { NextPage } from 'next';
import Layout from '../components/layouts/article';
import { GetServerSideProps } from "next";
import initializeApollo from '../apollo/client';
import { IS_LOGGED_IN } from "./api/queries";
import { HOME_RECENT_POSTS } from './api/queries';
import {
  Box,
  Text,
} from '@chakra-ui/react';
import { useQuery } from '@apollo/client';
import { FIND_THREE_RECOMMENDED } from './api/queries';
import SocialCard from '../components/socialCard';
import { userProfileAtom } from '../lib/globalAtoms';
import { useAtomValue } from 'jotai';
import { ReactElement } from 'react'
import { UserId, Comment } from '../pages/[username]/post/[post]';
import HomePostCard from '../components/homePostCard';
import { LikedByUser, UserProfile } from '../ts/types'

interface Props {
  homeRecentPosts: HomeRecentPost[];
}

export interface HomeRecentPost {
  __typename?: "Post";
  _id: string;
  userId: UserId;
  description: string;
  postImage: string;
  comments: Comment[];
  likedBy: LikedByUser[];
  userProfile: UserProfile | null | undefined
}

const Home: NextPage<Props> = ({ homeRecentPosts }): ReactElement => {
  const userProfile: UserProfile | null | undefined = useAtomValue(userProfileAtom)
  const { data: recData } = useQuery(FIND_THREE_RECOMMENDED)

  return (
    <Layout>
      {homeRecentPosts.length ?
        homeRecentPosts?.map((post: HomeRecentPost) => (
          <HomePostCard key={post._id + 'homepostcard'} {...post} userProfile={userProfile} />
        ))
        :
        <>
          <Text
            mt={10}

          >
            {"No posts found since you're not following anyone, or following has no posts  :("}
          </Text>
          <Text
            fontWeight="light"
            fontSize=".9em"
          >
            Here are some recommendations, or use the <Text as="span" fontWeight="medium">search</Text> bar.
          </Text>
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
          >
            {recData?.findThreeRecommended?.map((user: any) => {
              if (user.username === userProfile?.username) return null
              return (
                <SocialCard key={user.username} user={user} />
              )
            })
            }
          </Box>
        </>
      }
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = initializeApollo(context)

  try {
    await client.query({
      query: IS_LOGGED_IN,
    })

    const { data: { homeRecentPosts } } = await client.query({
      query: HOME_RECENT_POSTS,
    })

    return {
      props: {
        homeRecentPosts,
        initialApolloState: client.cache.extract()
      }
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/login',
        permanent: true
      }
    }
  }
}

export default Home
