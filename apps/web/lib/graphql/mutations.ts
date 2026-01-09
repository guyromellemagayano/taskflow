import { gql } from "@apollo/client";

// Phase 1: GraphQL mutations (stubs)
// Phase 2: Will add actual mutations for task CRUD operations

// Example mutation structure (commented out until backend is ready)
/*
export const CREATE_TASK = gql`
  mutation CreateTask(
    $title: String!
    $description: String
    $priority: String!
    $dueDate: Date
  ) {
    createTask(
      title: $title
      description: $description
      priority: $priority
      dueDate: $dueDate
    ) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $description: String
    $status: String
    $priority: String
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
      priority: $priority
    ) {
      id
      title
      description
      status
      priority
      dueDate
      updatedAt
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;
*/
