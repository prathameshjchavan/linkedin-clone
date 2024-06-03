import { IUser } from "@/types/user";
import mongoose, { Schema, Document, models, Model } from "mongoose";
import { Comment, IComment, ICommentBase } from "./comment";

export interface IPostBase {
	user: IUser;
	text: string;
	imageUrl?: string;
	comments?: IComment[];
	likes?: string[];
}

interface IPostMethods {
	likePost(userId: string): Promise<void>;
	unlikePost(userId: string): Promise<void>;
	commentOnPost(comment: ICommentBase): Promise<void>;
	getAllComments(): Promise<IComment[]>;
	removePost(): Promise<void>;
}

export interface IPost extends IPostBase, Document, IPostMethods {
	_id: mongoose.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

interface IPostStatics {
	getAllPosts(): Promise<IPost[]>;
}

interface IPostModel extends Model<IPost, IPostStatics> {}

const PostSchema = new Schema<IPost>(
	{
		user: {
			userId: { type: String, required: true },
			userImage: { type: String, required: true },
			firstName: { type: String, required: true },
			lastName: { type: String },
		},
		text: { type: String, required: true },
		imageUrl: { type: String },
		comments: { type: [Schema.Types.ObjectId], ref: "Comment", default: [] },
		likes: { type: [String] },
	},
	{ timestamps: true }
);

PostSchema.methods.likePost = async function (userId: string) {
	try {
		await this.updateOne({ $addToSet: { likes: userId } });
	} catch (error) {
		console.log("Error when liking post: ", error);
	}
};

PostSchema.methods.unlikePost = async function (userId: string) {
	try {
		await this.updateOne({ $pull: { likes: userId } });
	} catch (error) {
		console.log("Error when unliking post: ", error);
	}
};

PostSchema.methods.commentOnPost = async function (commentToAdd: ICommentBase) {
	try {
		const comment = await Comment.create(commentToAdd);
		this.comments.push(comment._id);
		await this.save();
	} catch (error) {
		console.log("Error when commenting on post: ", error);
	}
};

PostSchema.methods.getAllComments = async function () {
	try {
		await this.populate({
			path: "comments",
			options: { sort: { createdAt: -1 } },
		});
		return this.comments;
	} catch (error) {
		console.log("Error when getting all comments: ", error);
	}
};

PostSchema.methods.removePost = async function () {
	try {
		await this.model("Post").deleteOne({ _id: this._id });
	} catch (error) {
		console.log("Error when removing post: ", error);
	}
};

PostSchema.statics.getAllPosts = async function () {
	try {
		const posts = await this.find()
			.sort({ createdAt: -1 })
			.populate({ path: "comments", options: { sort: { createdAt: -1 } } })
			.lean();

		const iposts: IPost[] = posts.map((post: IPost) => ({
			...post,
			_id: post._id.toString(),
			comments: post.comments?.map((comment: IComment) => ({
				...comment,
				_id: comment._id.toString(),
			})),
		}));

		return iposts;
	} catch (error) {
		console.log("Error when getting all posts: ", error);
	}
};

export const Post =
	(models.Post as IPostModel) ||
	mongoose.model<IPost, IPostMethods>("Post", PostSchema);
