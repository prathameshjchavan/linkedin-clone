"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";

export default async function createPostAction(formData: FormData) {
	const user = await currentUser();

	if (!user) throw new Error("User not authenticated");

	const postInput = formData.get("postInput") as string;
	const image = formData.get("image") as File;
	let imageUrl: string | undefined;

	if (!postInput) throw new Error("Post input is required");

	// define user
	const userDb: IUser = {
		userId: user.id,
		userImage: user.imageUrl,
		firstName: user.firstName || "",
		lastName: user.lastName || "",
	};

	try {
		if (image.size > 0) {
			const body: AddPostRequestBody = {
				user: userDb,
				text: postInput,
				// imageUrl: image_url
			};

			await Post.create(body);
		} else {
			const body: AddPostRequestBody = {
				user: userDb,
				text: postInput,
			};

			await Post.create(body);
		}

		// create post in database

		// revalidatePath '/' - home page
	} catch (error) {
		throw new Error("Failed to create post", error as ErrorOptions);
	}
}
