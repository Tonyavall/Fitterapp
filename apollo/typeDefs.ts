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
    followers: [User]
    following: [User]
    followerCount: Int
    followingCount: Int
    postCount: Int
    bio: String
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
  
  input outfitInput {
    topId: String
    bottomId: String
    footwearId: String
  }

  type Mutation {
    # USER
    createUser(username: String!, email: String!, firstName: String!, lastName: String!, password: String!): Auth
    updateUser(email: String!, username: String!, firstName: String!, lastName: String!, password: String!): User 
    login(username: String!, password: String!): Auth
    addBio(bioBody: String!): User
    # SOCIAL
    followUser(followingId: ID!): User
    unfollowUser(followingId: ID!): User
    # POSTS
    createPost(outfit: outfitInput!, postImage: String!, description: String): Post
    likePost(postId: ID!): Post
    unlikePost(postId: ID!): Post
    deletePost(postId: ID! postOwnerId: ID!) : User
    # COMMENTS
    addPostComment(postId: ID!, commentBody: String!) : Post
    deletePostComment(commentId: ID!, postId: ID!, postOwnerId: ID!, commentOwnerId: ID!) : Post
    # OUTFIT
    addTop(image: String!): User
    addBottom(image: String!): User
    addFootwear(image: String!): User
    addOutfit(topId: String!, BottomId: String!, footwearId: String): User
    deleteTop(topId: ID!): User
    deleteBottom(bottomId: ID!): User
    deleteFootwear(footwearId: ID!): User
    deleteOutfit(outfitId: ID!): User
    # Dangerous mutations
    deleteUser(userId: ID!) : User
  }
`