import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	{ params }: { params: { post_id: string } }
) {
	await connectDB();

	try {
		const post = await Post.findById(params.post_id);

		if (!post)
			return NextResponse.json({ error: "Post not found" }, { status: 404 });

		const likes = post.likes;
		return NextResponse.json(likes);
	} catch (error: any) {
		return NextResponse.json(
			{
				error: "An error occured while fetching likes",
				message: error.message,
			},
			{ status: 500 }
		);
	}
}

export async function POST(
	request: Request,
	{ params }: { params: { post_id: string } }
) {
	auth().protect();

	await connectDB();

	const user = await currentUser();

	if (!user)
		return NextResponse.json(
			{ error: "User not authenticated" },
			{ status: 401 }
		);

	try {
		const post = await Post.findById(params.post_id);

		if (!post)
			return NextResponse.json({ error: "Post not found" }, { status: 404 });

		await post.likePost(user.id);

		return NextResponse.json({ message: "Post liked successfully" });
	} catch (error) {
		return NextResponse.json({ error: "An error occured while " });
	}
}
