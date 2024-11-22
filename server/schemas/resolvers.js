const { User, Habit } = require("../models/index");
const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const secret = process.env.SECRET;

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findById(context.user._id);
            }
            throw new AuthenticationError("Not logged in");
        },
        habits: async () => {
            return Habit.find().populate("owner");
        },
    },
    Mutation: {
        addUser: async (parent, { name, email, password }) => {
            const user = await User.create({ name, email, password });
            const token = jwt.sign({ _id: user._id }, secret, {
                expiresIn: "2h",
            });
            return {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
            };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user || !(await user.isCorrectPassword(password))) {
                throw new AuthenticationError("Invalid credentials");
            }
            const token = jwt.sign({ _id: user._id }, secret, {
                expiresIn: "2h",
            });
            return { token, user };
        },
        addHabit: async (parent, { name, description, frequency }, context) => {
            if (context.user) {
                const habit = await Habit.create({
                    name,
                    description,
                    frequency,
                    owner: context.user._id,
                });
                return habit.populate("owner");
            }
            throw new AuthenticationError("Not logged in");
        },
    },
};

module.exports = resolvers;
