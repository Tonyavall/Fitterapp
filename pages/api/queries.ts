import { gql } from '@apollo/client';

export const FIND_USER = gql`
  query($username: String!) {
    findUser(username: $username) {
      _id
      username
      firstName
      lastName
      userImage
      postCount
      followerCount
      followingCount
      bio
      posts {
        _id
        postImage
      }
    }
  }
`;

export const FIND_ME = gql`
  query {
    findMe {
      _id
      userImage
    }
  }
`;