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
      bio
      posts {
        _id
        postImage
      }
    }
  }
`

export const FIND_USER_FOLLOW = gql`
  query($username: String!) {
    findUserFollow(username:$username) {
      _id
      followers {
        _id
      }
      following {
        _id
      }
      followerCount
      followingCount
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
      bio
    }
  }
`

export const FIND_ALL_USERNAMES = gql`
  query {
    findAllUsernames {
      _id
      username
      userImage
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
query findFits{
  findFits {
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

export const HOME_RECENT_POSTS = gql`
  query {
    homeRecentPosts {
      _id
      userId {
        username
        userImage
      }
      description
      postImage
      comments {
        _id
        userId {
          username
          userImage
        }
        commentBody
      }
    }
  }
`

export const FIND_THREE_RECOMMENDED = gql`
query {
  findThreeRecommended {
  	username
    userImage
    followerCount
    followingCount
  }
}
`