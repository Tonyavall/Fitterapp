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
        postImage
        outfit {
          top {
            image
          }
          bottom {
            image
          }
          footwear {
            image
          }
        }
      }
    }
  }
`;