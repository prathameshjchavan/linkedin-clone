"use client";

import { useUser } from "@clerk/nextjs";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import createCommentAction from "@/actions/createCommentAction";
import CommentFormFields from "./CommentFormFields";
import { toast } from "sonner";

interface CommentFormProps {
	postId: string;
}

const CommentForm = ({ postId }: CommentFormProps) => {
	const { user } = useUser();
	const ref = useRef<HTMLFormElement>(null);

	const createCommentActionWithPostId = createCommentAction.bind(null, postId);

	const handleCommentAction = async (formData: FormData): Promise<void> => {
		if (!user?.id) throw new Error("User not authenticated");

		const formDataCopy = formData;
		ref.current?.reset();

		try {
			await createCommentActionWithPostId(formDataCopy);
		} catch (error) {
			console.error(`Error creating comment: ${error}`);
		}
	};

	return (
		<form
			ref={ref}
			action={(formData) => {
				const promise = handleCommentAction(formData);

				toast.promise(promise, {
					loading: "Creating comment...",
					success: "Comment created",
					error: "Failed to create comment",
				});
			}}
			className="flex items-center space-x-1"
		>
			<Avatar>
				<AvatarImage src={user?.imageUrl} />
				<AvatarFallback>
					{user?.firstName?.charAt(0)}
					{user?.lastName?.charAt(0)}
				</AvatarFallback>
			</Avatar>

			<CommentFormFields />
		</form>
	);
};

export default CommentForm;
