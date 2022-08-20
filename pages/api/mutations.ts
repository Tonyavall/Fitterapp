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