"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import generateSASToken, { containerName } from "@/lib/generateSASToken";
import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { BlobServiceClient } from "@azure/storage-blob";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

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
		await connectDB();

		if (image.size > 0) {
			const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
			const sasToken = await generateSASToken();
			const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}?${sasToken}`;

			const blobServiceClient = new BlobServiceClient(sasUrl);
			const containerClient =
				blobServiceClient.getContainerClient(containerName);
			const timestamp = new Date().getTime();
			const file_name = `${randomUUID()}_${timestamp}.png`;

			const blockBlobClient = containerClient.getBlockBlobClient(file_name);
			const imageBuffer = await image.arrayBuffer();

			await blockBlobClient.uploadData(imageBuffer);
			imageUrl = blockBlobClient.url;
			console.log("File uploaded successfully", imageUrl);

			const body: AddPostRequestBody = {
				user: userDb,
				text: postInput,
				imageUrl,
			};

			await Post.create(body);
		} else {
			const body: AddPostRequestBody = {
				user: userDb,
				text: postInput,
			};

			await Post.create(body);
		}

		revalidatePath("/");
	} catch (error) {
		console.log("Failed to create post", error as ErrorOptions)
	}
}
