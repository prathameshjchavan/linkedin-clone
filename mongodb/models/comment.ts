import { User } from "@/types/user";
import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface ICommentBase {
	user: User;
	text: string;
}

export interface IComment extends Document, ICommentBase {
    _id: mongoose.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

interface ICommentModel extends Model<IComment> {}

const CommentSchema = new Schema<IComment>(
	{
		user: {
			userId: { type: String, required: true },
			userImage: { type: String, required: true },
			firstName: { type: String, required: true },
			lastName: { type: String },
		},
		text: { type: String, required: true },
	},
	{ timestamps: true }
);

export const Comment =
	models.Comment as ICommentModel || mongoose.model<IComment>("Comment", CommentSchema);
