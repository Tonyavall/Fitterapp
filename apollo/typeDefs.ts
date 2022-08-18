import { gql } from '@apollo/client'

export const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    firstName: String!
    lastName: String!
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

  type Query {
    viewer: User
  }
`