import { gql } from '@apollo/client';

export const CREATE_USER = gql`
    mutation createUser(
        $username: String!, 
        $email: String!, 
        $firstName: String!, 
        $lastName: String!, 
        $password: String!
    ) {
        createUser(
            username: $username, 
            email: $email, 
            firstName: $firstName, 
            lastName: $lastName, 
            password: $password
        ) {
            user {
                _id
                username
            }
        }
    }
`;

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            _id
            username
            userImage
            firstName
            lastName
        }
    }
`

export const LOGOUT = gql`
    mutation logout {
        logout
    }
`

export const ADD_OUTFIT = gql`
    mutation addOutfit($top: TopInput!, $bottom: BottomInput!, $footwear: FootwearInput) {
        addOutfit(top: $top, bottom: $bottom, footwear: $footwear) {
            _id
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
        }
    }
`

export const ADD_TOP = gql`
    mutation addTop($image: String!) {
        addTop(image: $image) {
            _id
            tops {
                _id
                image
            }
        }
    }
`

export const ADD_BOTTOM = gql`
    mutation addBottom($image: String!) {
        addBottom(image: $image) {
            _id
            bottoms {
                _id
                image
            }
        }
    }
`

export const ADD_FOOTWEAR = gql`
    mutation addFootwear($image: String!) {
        addFootwear(image: $image) {
            _id
            footwear {
                _id
                image
            }
        }
    }
`

export const DELETE_TOP = gql`
    mutation deleteTop($topId: ID!) {
        deleteTop(topId: $topId) {
            _id
            tops {
                _id
                image
            }
        }
    }
`

export const DELETE_BOTTOM = gql`
    mutation deleteBottom($bottomId: ID!) {
        deleteBottom(bottomId: $bottomId) {
            _id
            bottoms {
                _id
                image
            }
        }
    }
`

export const DELETE_FOOTWEAR = gql`
    mutation deleteFootwear($footwearId: ID!) {
        deleteFootwear(footwearId: $footwearId) {
            _id
            footwear {
                _id
                image
            }
        }
    }
`

export const DELETE_OUTFIT = gql`
    mutation deleteOutfit($outfitId: ID!) {
        deleteOutfit(outfitId: $outfitId) {
            _id
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
        }
    }
`

export const CREATE_POST = gql`
    mutation createPost($outfitId: ID!, $postImage: String!, $description: String) {
        createPost(outfitId: $outfitId, postImage: $postImage, description: $description) {
            _id
        }
    }
`
export const ADD_POST_COMMENT = gql`
    mutation addPostComment($postId: ID!, $commentBody: String!) {
        addPostComment(commentBody: $commentBody, postId: $postId) {
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
