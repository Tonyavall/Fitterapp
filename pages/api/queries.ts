import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query findUser($username: String) {
    findUser(username: $username) {
      _id
      username
      firstName
      lastName
      userImage
      postCount
      posts {
        postImage
        outfit
      }
    }
  }
`;