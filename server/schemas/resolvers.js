const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				return User.findOne({ _id: context.user._id }).populate(
					"books"
				);
			}
			throw new AuthenticationError("Not logged in");
		},
	},
	Mutation: {
		addUser: async (parent, args) => {
			const user = await User.create(args);
			const token = signToken(user);
			return { token, user };
		},
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });
			if (!user) {
				throw new AuthenticationError("Incorrect credentials!");
			}
			const correctPw = await user.isCorrectPassword(password);
			if (!correctPw) {
				throw new AuthenticationError("Incorrect credentials!");
			}
			const token = signToken(user);
			return { token, user };
		},
		saveBook: async (parent, { book }, context) => {
			if (context.user) {
				const updatedUser = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $addToSet: { savedBooks: book } },
					{ new: true }
				);
				return updatedUser;
			}
			throw new AuthenticationError("Incorrect credentials!");
		},
		removeBook: async (parent, { bookId }, context) => {
			if (context.user) {
				const updatedUser = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { savedBooks: { bookId: bookId } } },
					{ new: true }
				);
				return updatedUser;
			}
		},
	},
};

module.exports = resolvers;
