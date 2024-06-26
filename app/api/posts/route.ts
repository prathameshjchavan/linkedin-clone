import connectDB from "@/mongodb/db";
import { IPostBase, Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface AddPostRequestBody {
	user: IUser;
	text: string;
	imageUrl?: string | null;
	imageName?: string | null;
}

export async function POST(request: Request) {
	auth().protect();

	try {
		await connectDB();

		const { user, text, imageUrl, imageName }: AddPostRequestBody = await request.json();

		const postData: IPostBase = {
			user,
			text,
			...(imageUrl && { imageUrl }),
			...(imageName && { imageName }),
		};

		const post = await Post.create(postData);

		return NextResponse.json({ message: "Post created successfully", post });
	} catch (error: any) {
		return NextResponse.json(
			{
				error: "An error occured while creating the post",
				message: error.message,
			},
			{ status: 500 }
		);
	}
}

export async function GET(request: Request) {
	try {
		await connectDB();

		// @ts-ignore
		const posts = await Post.getAllPosts();

		return NextResponse.json({ posts });
	} catch (error: any) {
		return NextResponse.json(
			{
				error: "An error occured while fetching posts",
				message: error.message,
			},
			{
				status: 500,
			}
		);
	}
}
