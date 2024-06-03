import connectDB from "@/mongodb/db";
import { Followers } from "@/mongodb/models/followers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const user_id = searchParams.get("user_id");

	try {
		await connectDB();

		if (!user_id)
			return NextResponse.json(
				{ error: "User ID not provided" },
				{ status: 400 }
			);

		const following = await Followers.getAllFollowing(user_id);

		if (!following)
			return NextResponse.json({ error: "User not found" }, { status: 404 });

		return NextResponse.json(following);
	} catch (error) {
		return NextResponse.json(
			{ error: "An error occured while fetching following" },
			{ status: 500 }
		);
	}
}
