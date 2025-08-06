import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers($filter: UserFilterInput, $pagination: PaginationInput) {
    users(filter: $filter, pagination: $pagination) {
      users {
        id
        userId
        firstName
        lastName
        phone
        birthDate
        avatarUrl
        createdAt
        updatedAt
      }
      total
      hasMore
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    userProfile(userId: $id) {
      id
      userId
      firstName
      lastName
      phone
      birthDate
      avatarUrl
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserProfileInput!) {
    createUserProfile(input: $input) {
      id
      userId
      firstName
      lastName
      phone
      birthDate
      avatarUrl
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($userId: ID!, $input: UpdateUserProfileInput!) {
    updateUserProfile(userId: $userId, input: $input) {
      id
      userId
      firstName
      lastName
      phone
      birthDate
      avatarUrl
      createdAt
      updatedAt
    }
  }
`; 