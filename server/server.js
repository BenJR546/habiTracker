const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const jwt = require("jsonwebtoken"); // Import jwt
const db = require("./config/connection");
const { typeDefs, resolvers } = require("./schemas");

require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3001;
const secret = process.env.JWT_SECRET || "yourSecret"; // Use env variable or fallback to default

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || "";
        if (token) {
            try {
                const decodedToken = jwt.verify(
                    token.replace("Bearer ", ""),
                    secret
                );
                return { user: decodedToken };
            } catch (err) {
                console.error("Invalid token", err);
            }
        }
        return null;
    },
});

server.start().then(() => {
    server.applyMiddleware({ app });
    db.once("open", () => {
        app.listen(PORT, () => {
            console.log(`API server running on http://localhost:${PORT}`);
            console.log(
                `GraphQL at http://localhost:${PORT}${server.graphqlPath}`
            );
        });
    });
});
