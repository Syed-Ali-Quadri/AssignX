import mongoose from "mongoose";

const connectDB = async () => {
	try {
		const connectionInstense = await mongoose.connect(
			process.env.MONGODB_URL
		);
		console.log(
			"Connected to the database, DB string is: ",
			connectionInstense.host
		);
	} catch (error) {
		console.log(
			"Something went wrong while connecting the database, ",
			error
		);
		process.exit(1);
	}
};

export default connectDB;