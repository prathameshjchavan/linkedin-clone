"use client";

import { useRef, useState } from "react";
import createPostAction from "@/actions/createPostAction";
import PostFormFields from "./PostFormFields";
import { toast } from "sonner";

const PostForm = () => {
	const ref = useRef<HTMLFormElement>(null);
	const [preview, setPreview] = useState<string | null>(null);

	const handlePostAction = async (formData: FormData) => {
		const formDataCopy = formData;
		ref.current?.reset();

		const text = formDataCopy.get("postInput") as string;

		if (!text.trim()) throw new Error("You must provide a post input");

		setPreview(null);

		try {
			await createPostAction(formDataCopy);
		} catch (error) {
			console.log("Error creating post: ", error);
		}
	};

	return (
		<div className="mb-2">
			<form
				ref={ref}
				action={async (formData) => {
					// handle form submittion with server action
					const promise = handlePostAction(formData);

					// Toast notification based on the promise above
					toast.promise(promise, {
						loading: "Creating post...",
						success: "Post created",
						error: "Failed to create post",
					});
				}}
				className="p-3 bg-white rounded-lg border"
			>
				<PostFormFields preview={preview} setPreview={setPreview} />
			</form>

			<hr className="mt-2 borer-gray-300" />
		</div>
	);
};

export default PostForm;
