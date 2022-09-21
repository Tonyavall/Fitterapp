import type { NextPage } from 'next';
import Layout from '../components/layouts/article';
import { GetServerSideProps } from "next";
import initializeApollo from '../apollo/client';
import { IS_LOGGED_IN } from "./api/queries";
import { HOME_RECENT_POSTS } from './api/queries';
import {
  Box,
  Avatar,
  Text,
  Image,
  Icon,
  Heading,
} from '@chakra-ui/react';
import Router from 'next/router';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsChat } from 'react-icons/bs';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { useQuery } from '@apollo/client';
import { FIND_THREE_RECOMMENDED } from './api/queries';
import SocialCard from '../components/socialCard';
import { userProfileAtom } from '../lib/globalAtoms';
import { useAtomValue } from 'jotai';

const Home: NextPage = ({ data }: any) => {
  const posts = data?.data?.homeRecentPosts
  const userProfile = useAtomValue(userProfileAtom)
  const { data: recData } = useQuery(FIND_THREE_RECOMMENDED)

  return (
    <Layout>
      {posts.length ?
        posts?.map((post: any) => {
          return (
            <Box
              key={post._id}
              border="1px solid"
              borderColor="lightgray"
              borderRadius="8px"
              w="475px"
              h="fit-content"
              pb=".8em"
              mb="1em"
            >
              <Box
                w="full"
                display="flex"
                flexDirection="row"
                alignItems="center"
                p=".8em"
              >
                <Avatar size="sm" src={post.userId?.userImage} mr=".8em" onClick={() => Router.push(`/${post.userId.username}`)} cursor="pointer" />
                <Text fontSize="sm" fontWeight="medium" onClick={() => Router.push(`/${post.userId.username}`)} cursor="pointer">{post.userId.username}</Text>
              </Box>
              <Image
                w="475px"
                h="350px"
                cursor="pointer"
                src={post.postImage}
                alt={`${post.userId.username}'s photo.`}
                objectFit="cover"
                data-postid={post._id}
                onClick={(e) => Router.push(`/${post.userId.username}/post/${e.currentTarget.dataset.postid}`)}
              />
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="start"
                w="full"
                alignItems="center"
                h="50px"
                borderY="1px solid #EFEFEF"
              >
                <Icon as={AiOutlineHeart} h={7} w={7} ml="1em" mr={4} />
                <Icon as={BsChat} h="22px" w="22px" strokeWidth=".5px" mr={4} />
                <Icon as={IoPaperPlaneOutline} h={6} w={6} />
              </Box>

              <Text
                ml="1.25em"
                mt={1}
                fontSize="sm"
              >
                Liked by <Text as="span" fontWeight="bold">logic</Text> here.
              </Text>

              {post.description &&
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  ml="1.25em"
                  mt={1}
                  fontSize="sm"
                >
                  <Text fontSize="sm" fontWeight="bold" mr={1}>{post.userId.username}</Text>
                  <Text fontSize="sm">{post.description}</Text>
                </Box>
              }

              {post?.comments.length ?
                <Heading
                  ml="1.25em"
                  my={2}
                  fontSize="sm"
                  fontWeight="normal"
                  color="gray"
                  data-postid={post._id}
                  onClick={(e) => Router.push(`/${post.userId.username}/post/${e.currentTarget.dataset.postid}`)}
                  cursor="pointer"
                >
                  {`View all ${post.comments.length} comments`}
                </Heading>
                :
                <Heading
                  ml="1.25em"
                  my={2}
                  fontSize="sm"
                  fontWeight="normal"
                  color="gray"
                  data-postid={post._id}
                  onClick={(e) => Router.push(`/${post.userId.username}/post/${e.currentTarget.dataset.postid}`)}
                  cursor="pointer"
                >
                  Be the first to comment!
                </Heading>
              }

              {post?.comments?.slice(0, 3).map((comment: any) => {
                return (
                  <Box
                    key={comment._id}
                    display="flex"
                    flexDirection="row"
                    ml="1.25em"
                    mt={1}
                    fontSize="sm"
                  >
                    <Text fontSize="sm" fontWeight="bold" mr={1}>{comment.userId.username}</Text>
                    <Text fontSize="sm">{comment.commentBody}</Text>
                  </Box>
                )
              })}
            </Box>
          )
        })
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

    const data = await client.query({
      query: HOME_RECENT_POSTS,
    })

    return {
      props: { data }
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
