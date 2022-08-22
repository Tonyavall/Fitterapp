import { gql } from '@apollo/client'

export const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    firstName: String
    lastName: String
    password: String
    userImage: String
    posts: [Post]
    tops: [Top]
    bottoms: [Bottom]
    footwear: [Footwear]
    outfits: [Outfit]
    followerCount: Int
    followingCount: Int
    postCount: Int
  }

  type Top {
    _id: ID
    image: String
    userId: ID
    createdAt: String
  }

  type Bottom {
    _id: ID
    image: String
    userId: ID
    createdAt: String
  }

  type Footwear {
    _id: ID
    image: String
    userId: ID
    createdAt: String
  }

  type Outfit {
    _id: ID
    userId: ID
    top: Top
    bottom: Bottom
    footwear: Footwear
    createdAt: String
  }

  type Post {
    _id: ID
    userId: ID
    description: String
    comments: [Comment]
    likedBy: [User]
    createdAt: String
    likes: Int
    commentCount: Int
    postImage: String
    outfit: [Outfit]
  }

  type Comment {
    _id: ID
    userId: ID
    commentBody: String
    createdAt: String
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    findMe: User
    findUser(username: String!): User
    findAllUsers: [User]
    homeRecentTenPosts: [Post]
    grabRandomTwelvePosts: [Post]
    findSinglePost(postId: ID!): Post
  }

  type Mutation {
    # Here it returns Auth, which is the token and the user information : Auth
    createUser(username: String!, email: String!, firstName: String!, lastName: String!, password: String!): Auth
    updateUser(email: String!, username: String!, firstName: String!, lastName: String!, password: String!): User 
    login(username: String!, password: String!): Auth
    # Social related mutations
    # This will return the current logged in User information
    createPost(outfit: Array!, postImage: String!, description: String): Post
    followUser(followingId: ID!): User
    unfollowUser(followingId: ID!): User
    likePost(postId: ID!): Post
    unlikePost(postId: ID!): Post
    addPostComment(postId: ID!, commentBody: String!) : Comment
    # Outfit related mutations
    addTop(image: String!): User
    addBottom(image: String!): User
    addFootwear(image: String!): User
    addOutfit(topId: String!, BottomId: String!, footwearId: String): User
    # Dangerous mutations
    deleteUser(userId: ID!) : User
    deletePost(postId: ID!) : User
  }
`