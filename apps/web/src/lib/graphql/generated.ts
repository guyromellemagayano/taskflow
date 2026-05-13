export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** Date (isoformat) */
  Date: { input: any; output: any };
  /** Date with time (isoformat) */
  DateTime: { input: any; output: any };
};

export type AuthPayload = {
  __typename?: "AuthPayload";
  accessToken: Scalars["String"]["output"];
  refreshToken: Scalars["String"]["output"];
  user: User;
};

export type CreateTaskInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["Date"]["input"]>;
  priority?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  title: Scalars["String"]["input"];
};

export type LoginInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type Mutation = {
  __typename?: "Mutation";
  createTask: Task;
  deleteTask: Scalars["Boolean"]["output"];
  login: AuthPayload;
  logout: Scalars["Boolean"]["output"];
  refreshToken: AuthPayload;
  register: AuthPayload;
  updateTask?: Maybe<Task>;
};

export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};

export type MutationDeleteTaskArgs = {
  id: Scalars["String"]["input"];
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationLogoutArgs = {
  input: RefreshTokenInput;
};

export type MutationRefreshTokenArgs = {
  input: RefreshTokenInput;
};

export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
};

export type Query = {
  __typename?: "Query";
  me?: Maybe<User>;
  task?: Maybe<Task>;
  tasks: TasksConnection;
  user?: Maybe<User>;
  users: Array<User>;
};

export type QueryTaskArgs = {
  id: Scalars["String"]["input"];
};

export type QueryTasksArgs = {
  filters?: InputMaybe<TaskFilters>;
  limit?: Scalars["Int"]["input"];
  offset?: Scalars["Int"]["input"];
  sortBy?: Scalars["String"]["input"];
  sortOrder?: Scalars["String"]["input"];
};

export type QueryUserArgs = {
  id: Scalars["String"]["input"];
};

export type RefreshTokenInput = {
  refreshToken: Scalars["String"]["input"];
};

export type RegisterInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type Task = {
  __typename?: "Task";
  createdAt: Scalars["DateTime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  dueDate?: Maybe<Scalars["Date"]["output"]>;
  id: Scalars["String"]["output"];
  priority: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
  userId: Scalars["String"]["output"];
};

export type TaskFilters = {
  dueDateFrom?: InputMaybe<Scalars["Date"]["input"]>;
  dueDateTo?: InputMaybe<Scalars["Date"]["input"]>;
  priority?: InputMaybe<Scalars["String"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
};

export type TasksConnection = {
  __typename?: "TasksConnection";
  hasMore: Scalars["Boolean"]["output"];
  limit: Scalars["Int"]["output"];
  offset: Scalars["Int"]["output"];
  tasks: Array<Task>;
  total: Scalars["Int"]["output"];
};

export type UpdateTaskInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["Date"]["input"]>;
  id: Scalars["String"]["input"];
  priority?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type User = {
  __typename?: "User";
  createdAt: Scalars["DateTime"]["output"];
  email: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    email: string;
    createdAt: any;
  } | null;
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;

export type LoginMutation = {
  __typename?: "Mutation";
  login: {
    __typename?: "AuthPayload";
    accessToken: string;
    refreshToken: string;
    user: { __typename?: "User"; id: string; email: string; createdAt: any };
  };
};

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;

export type RegisterMutation = {
  __typename?: "Mutation";
  register: {
    __typename?: "AuthPayload";
    accessToken: string;
    refreshToken: string;
    user: { __typename?: "User"; id: string; email: string; createdAt: any };
  };
};

export type RefreshTokenMutationVariables = Exact<{
  input: RefreshTokenInput;
}>;

export type RefreshTokenMutation = {
  __typename?: "Mutation";
  refreshToken: {
    __typename?: "AuthPayload";
    accessToken: string;
    refreshToken: string;
    user: { __typename?: "User"; id: string; email: string; createdAt: any };
  };
};

export type LogoutMutationVariables = Exact<{
  input: RefreshTokenInput;
}>;

export type LogoutMutation = { __typename?: "Mutation"; logout: boolean };

export type GetTasksQueryVariables = Exact<{
  filters?: InputMaybe<TaskFilters>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  sortOrder?: InputMaybe<Scalars["String"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetTasksQuery = {
  __typename?: "Query";
  tasks: {
    __typename?: "TasksConnection";
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    tasks: Array<{
      __typename?: "Task";
      id: string;
      title: string;
      description?: string | null;
      status: string;
      priority: string;
      dueDate?: any | null;
      userId: string;
      createdAt: any;
      updatedAt: any;
    }>;
  };
};

export type GetTaskQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type GetTaskQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    id: string;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    dueDate?: any | null;
    userId: string;
    createdAt: any;
    updatedAt: any;
  } | null;
};

export type CreateTaskMutationVariables = Exact<{
  input: CreateTaskInput;
}>;

export type CreateTaskMutation = {
  __typename?: "Mutation";
  createTask: {
    __typename?: "Task";
    id: string;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    dueDate?: any | null;
    userId: string;
    createdAt: any;
    updatedAt: any;
  };
};

export type UpdateTaskMutationVariables = Exact<{
  input: UpdateTaskInput;
}>;

export type UpdateTaskMutation = {
  __typename?: "Mutation";
  updateTask?: {
    __typename?: "Task";
    id: string;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    dueDate?: any | null;
    userId: string;
    createdAt: any;
    updatedAt: any;
  } | null;
};

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type DeleteTaskMutation = {
  __typename?: "Mutation";
  deleteTask: boolean;
};
