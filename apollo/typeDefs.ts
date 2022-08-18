import { gql } from '@apollo/client'

export const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    password: String!
    userImage: String
    posts: [Post]
    friends: [User]
    tops: [Top]
    bottoms: [Bottom]
    footwear: [Footwear]
    outfits: [Outift]
  }

  type Top {
    _id: ID!
    image: String!
    userId: ID!
    createdAt: String!
  }

  type Bottom {
    _id: ID!
    image: String!
    userId: ID!
    createdAt: String!
  }

  type Footwear {
    _id: ID!
    image: String!
    userId: ID!
    createdAt: String!
  }

  type Outfit {
    _id: ID!
    userId: ID!
    top: Top!
    bottom: Bottom!
    footwear: Footwear
    createdAt: String!
  }

  type Post {
    _id: ID!
    userId: ID!
    description: String
    comments: [Comment]
    likedBy: [User]
    createdAt: String!
  }

  type Comment {
    _id: ID!
    userId: ID!
    commentBody: String!
    createdAt: String!
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    user: User
  }

  type Mutation {
    # Here it returns Auth, which is the token and the user information : Auth
    createUser(username: String!, firstName: String!, lastName: String!, email: String!, password: String!): Auth 
    updateUser(username: String!, firstName: String!, lastName: String!, email: String!, password: String!): User 
    login(email: String!, password: String!): Auth
    # Social related mutations
    # This will return the current logged in User information
    followUser(followingId: ID!): User
    unfollowUser(followingId: ID!): User
    likePost(postId: ID!): Post
    unlikePost(postId: ID!): Post
    # Outfit related mutations
    addTop(image: String!): User
    addBottom(image: String!): User
    addFootwear(image: String!): User
    addOutfit(topId: String!, BottomId: String!, footwearId: String): User
    # Dangerous mutations
    deleteUser(userId: ID!)
    deletePost(postId: ID!)
  }
`