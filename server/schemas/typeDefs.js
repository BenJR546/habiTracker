const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type User {
        _id: ID
        name: String
        email: String
    }

    type Habit {
        _id: ID
        name: String
        description: String
        frequency: String
        createdAt: String
        owner: User
    }

    type Auth {
        token: String
        user: User
    }

    type Query {
        me: User
        habits: [Habit]
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(name: String!, email: String!, password: String!): Auth
        addHabit(name: String!, description: String!, frequency: String!): Habit
    }
`;

module.exports = typeDefs;
