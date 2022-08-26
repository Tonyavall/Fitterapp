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
            token
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
            token
            user {
                _id
            }
        }
    }
`

export const ADD_OUTFIT = gql`
    mutation addOutfit($top: TopInput!, $bottom: BottomInput!, $footwear: FootwearInput) {
        addOutfit(top: $top, bottom: $bottom, footwear: $footwear) {
            _id
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
            }
        }
    }
`