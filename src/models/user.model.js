import { Schema, model } from "mongoose";
import mongooseAggregate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
	{
		fullName: {
			type: String,
			required: [true, "Fullname is required."],
			minLength: [3, "Fullname must be at least 3 characters long"],
			maxLength: [12, "Fullname must be at most 12 characters long"]
		},
		username: {
			type: String,
			required: [true, "Username is required."],
			minLength: [3, "Username must be at least 3 characters long"],
			maxLength: [12, "Username must be at most 12 characters long"],
			unique: true,
			lowercase: true
		},
		email: {
			type: String,
			required: [true, "Email is required."],
			minLength: [3, "Email must be at least 3 characters long"],
			maxLength: [12, "Email must be at most 12 characters long"],
			unique: true,
			lowercase: true
		},
		avatar: {
			type: String
		},
		password: {
			type: String,
			required: [true, "Password is required."],
			minLength: [8, "Password must be at least 8 characters long"],
			maxLength: [16, "Password must be at most 16 characters long"]
		},
		phoneNo: {
			type: Number
		},
		loginCount: {
			type: Number
		},
		betaAccess: {
			type: Boolean,
			default: false
		},
		affiliateCode: {
			type: String
		},
		refreshToken: {
			type: String
		},
		role: {
			type: String,
			enum: ["user", "admin", "owner"],
			default: "user"
		}
		// subscriptionHistory: [{
		// }]
	},
	{
		timestamps: true
	}
);

userSchema.plugin(mongooseAggregate);

userSchema.pre("save", async function(next) {
	if (!this.isModified(this.password)) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.isPassword = async function(password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function() {
	return jwt.sign(
		{
			_id: this._id,
			username: this.username,
			email: this.email,
			fullName: this.fullName
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY
		}
	);
};

userSchema.methods.getRefreshToken = function() {
	return jwt.sign(
		{
			_id: this._id
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY
		}
	);
};

export default (User = model("User", userSchema));
