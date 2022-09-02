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
`

export const FIND_ME = gql`
  query {
    findMe {
      _id
      username
      userImage
      email
      isAdmin
    }
  }
`

export const IS_LOGGED_IN = gql`
  query isLoggedIn {
    isLoggedIn
  }
`

export const LOGIN_REDIRECT = gql`
  query loginRedirect {
    loginRedirect
  }
`

export const FIND_POST = gql`
query($postId: ID!) {
  findSinglePost(postId: $postId) {
    _id
    postImage
    description
    userId {
      username
      userImage
    }
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
`

export const FIND_POST_COMMENTS = gql`
query($postId: ID!) {
  findPostComments(postId: $postId) {
    _id
    comments {
      _id
      commentBody
      userId {
        username
        userImage
      }
    }
  }
}
`

export const FIND_FITS = gql`
query {
  findMe {
		outfits {
      _id
      top {
        _id
        image
      }
      bottom {
        _id
        image
      }
      footwear {
        _id
        image
      }
    }
    tops {
      _id
      image
    }
    bottoms {
      _id
      image
    }
    footwear {
      _id
      image
    }
  }
}
`