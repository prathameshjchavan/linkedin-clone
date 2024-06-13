"use server";

import { containerName } from "@/lib/generateSASToken";
import generateSASUrl from "@/lib/generateSASUrl";
import { Post } from "@/mongodb/models/post";
import { BlobServiceClient } from "@azure/storage-blob";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deletePostAction(postId: string) {
	const user = await currentUser();

	if (!user?.id) throw new Error("User not authenticated");

	const post = await Post.findById(postId);

	if (!post) throw new Error("Post not found");

	if (post.user.userId !== user.id)
		throw new Error("Post does not belong to the user");

	try {
		// delete blob image
		if (post.imageName && post.imageUrl) {
			const imageName = post.imageName;
			const sasUrl = await generateSASUrl();
			const blobServiceClient = new BlobServiceClient(sasUrl);
			const containerClient =
				blobServiceClient.getContainerClient(containerName);
			const blockBlobClient = containerClient.getBlockBlobClient(imageName);

			await blockBlobClient.delete();
		}

		await post.removePost();
		revalidatePath("/");
	} catch (error) {
		console.log(error);
		throw new Error("An error occured while deleting the post");
	}
}
