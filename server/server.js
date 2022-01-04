const express = require("express");
const path = require("path");
const db = require("./config/connection");
const routes = require("./routes");

const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schema");
const { authMiddleware } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../client/build")));
}

// app.use(routes);

db.once("open", () => {
	app.listen(PORT, () => {
		console.log(`server: http://localhost:${PORT}`);
		console.log(`GraphQL: http://localhost:${PORT}${server.graphqlPath}`);
	});
});

let server;

async function startApolloServer() {
	server = new ApolloServer({
		typeDefs,
		resolvers,
		context: authMiddleware,
		playground: true,
	});

	await server.start();
	server.applyMiddleware({ app, path: "/graphql" });
}
startApolloServer();
