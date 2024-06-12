"use client";

import {
	ChangeEvent,
	Dispatch,
	Fragment,
	RefObject,
	SetStateAction,
	useRef,
	useState,
} from "react";
import { useFormStatus } from "react-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ImageIcon, XIcon } from "lucide-react";

interface PostFormFieldsProps {
	preview: string | null;
	setPreview: Dispatch<SetStateAction<string | null>>;
}

const PostFormFields = ({ preview, setPreview }: PostFormFieldsProps) => {
	const { pending } = useFormStatus();
	const { user } = useUser();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setPreview(URL.createObjectURL(file));
		}
	};

	return (
		<Fragment>
			<div className="flex items-center space-x-2">
				<Avatar>
					<AvatarImage src={user?.imageUrl} />
					<AvatarFallback>
						{user?.firstName?.charAt(0)}
						{user?.lastName?.charAt(0)}
					</AvatarFallback>
				</Avatar>

				<input
					type="text"
					name="postInput"
					disabled={pending}
					placeholder="Start writing a post..."
					className="flex-1 outline-none rounded-full py-3 px-4 border"
				/>

				<input
					ref={fileInputRef}
					onChange={handleImageChange}
					disabled={pending}
					type="file"
					name="image"
					accept="image/*"
					hidden
				/>

				<button disabled={pending} type="submit" hidden>
					Post
				</button>
			</div>

			{preview && (
				<div className="mt-3">
					<img src={preview} alt="preview" className="w-full rounded-lg" />
				</div>
			)}

			<div className="flex justify-end mt-2 space-x-2">
				<Button
					type="button"
					disabled={pending}
					onClick={() => fileInputRef.current?.click()}
				>
					<ImageIcon className="mr-2" size={16} color="currentColor" />
					{preview ? "Change" : "Add"} image
				</Button>

				{preview && (
					<Button
						variant="outline"
						disabled={pending}
						type="button"
						onClick={() => setPreview(null)}
					>
						<XIcon className="mr-2" size={16} color="currentColor" /> Remove
						image
					</Button>
				)}
			</div>
		</Fragment>
	);
};

export default PostFormFields;
