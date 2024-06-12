"use client";

import { useFormStatus } from "react-dom";

const CommentFormFields = () => {
	const { pending } = useFormStatus();

	return (
		<div className="flex flex-1 bg-white border rounded-full px-3 py-2">
			<input
				disabled={pending}
				type="text"
				name="commentInput"
				placeholder="Add a comment..."
				className="outline-none flex-1 text-sm bg-transparent"
			/>
			<button disabled={pending} type="submit" hidden>
				Comment
			</button>
		</div>
	);
};

export default CommentFormFields;
