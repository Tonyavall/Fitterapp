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
        username
      }
      following {
        _id
        username
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
      _id
      username
      userImage
    }
    outfit {
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
  }
}
`

// finds post comments and like status.
// for future- separate the two 
export const FIND_POST_SOCIALS = gql`
query($postId: ID!) {
  findPostSocials(postId: $postId) {
    _id
    comments {
      _id
      commentBody
      userId {
        username
        userImage
      }
    }
    likedBy {
      _id
      userImage
      username
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
        _id
        username
        userImage
      }
      description
      postImage
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