import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
	request: Request,
	{ params }: { params: { post_id: string } }
) {
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

		await post.unlikePost(user.id);

		return NextResponse.json({ message: "Post unliked successfully" });
	} catch (error: any) {
		return NextResponse.json(
			{ error: "An error occured while unliking the post" },
			{ status: 500 }
		);
	}
}
