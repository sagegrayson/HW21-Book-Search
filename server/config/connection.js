const mongoose = require("mongoose");

mongoose
	.connect(process.env.MONGODB_URI || "mongodb://localhost/googlebooks", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log("MongoDB connected successfully");
	});

module.exports = mongoose.connection;
