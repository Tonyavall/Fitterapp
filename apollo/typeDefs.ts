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
    isAdmin: Boolean
  }

  type Top {
    _id: ID
    image: String
    createdAt: String
  }

  type Bottom {
    _id: ID
    image: String
    createdAt: String
  }

  type Footwear {
    _id: ID
    image: String
    createdAt: String
  }

  input TopInput {
    _id: ID
    image: String
  }
  
  input BottomInput {
    _id: ID
    image: String
  }

  input FootwearInput {
    _id: ID
    image: String
  }

  type Outfit {
    _id: ID
    top: Top
    bottom: Bottom
    footwear: Footwear
    createdAt: String
  }

  type Post {
    _id: ID
    userId: User
    description: String
    comments: [Comment]
    likedBy: [User]
    createdAt: String
    likes: Int
    commentCount: Int
    postImage: String
    outfit: Outfit
  }

  type Comment {
    _id: ID
    userId: User
    commentBody: String
    createdAt: String
  }

  type Query {
    findMe: User
    findUser(username: String!): User
    findAllUsers: [User]
    homeRecentPosts: [Post]
    grabRandomTwelvePosts: [Post]
    findSinglePost(postId: ID!): Post
    findPostSocials(postId: ID!): Post
    isLoggedIn: Boolean
    loginRedirect: Boolean
    findFits: User
    findUserFollow(username: String!): User
    findAllUsernames: [User]
    findThreeRecommended: [User]
  }

  type Mutation {
    # USER
    createUser(username: String!, email: String!, firstName: String!, lastName: String!, password: String!): User
    updateUser(bio: String!, userImage: String): User 
    login(username: String!, password: String!): User
    logout: Boolean
    addBio(bioBody: String!): User
    addProfilePicture(image: String!): User
    # SOCIAL
    followUser(userId: ID!): User
    unFollowUser(userId: ID!): User
    # POSTS
    createPost(outfitId: ID!, postImage: String!, description: String): Post
    likePost(postId: ID!): Post
    unlikePost(postId: ID!): Post
    deletePost(postId: ID! postOwnerId: ID!): Post
    # COMMENTS
    addPostComment(postId: ID!, commentBody: String!): Post
    deletePostComment(commentId: ID!, postId: ID!, postOwnerId: ID!, commentOwnerId: ID!) : Post
    # OUTFIT
    addTop(image: String!): User
    addBottom(image: String!): User
    addFootwear(image: String!): User
    addOutfit(top: TopInput!, bottom: BottomInput!, footwear: FootwearInput): User
    deleteTop(topId: ID!): User
    deleteBottom(bottomId: ID!): User
    deleteFootwear(footwearId: ID!): User
    deleteOutfit(outfitId: ID!): User
    # Dangerous mutations
    deleteUser(userId: ID!) : User
  }
`

// 6304534f398f0aad018769a5 top
// bottom 6304534f398f0aad018769a5
// footwear 6304534f398f0aad018769a5
// 630465aa398f0aad018769c0 outfit
// 630467bbd727656bdb22c33d postid

// 63006e91339dd7cfb9ab73d0
