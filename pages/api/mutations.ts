import { gql } from '@apollo/client';

export const SIGNUP = gql`
    mutation Signup(
        $email: String!, 
        $username: String!,
        $firstName: String!,
        $lastName: String!,
        $password: String!,
    ) {
        Signup(
            email: $email,
            username: $username,
            firstName: $firstName,
            lastName: $lastName,
            password: $password
        ) {
            token
            user {
                _id
            }
        }
    }
`

export const LOGIN = gql`
    mutation Login($username: String, $password: String) {
        Login(username: $username, password: $password) {
            token
            user {
                _id
            }
        }
    }
`