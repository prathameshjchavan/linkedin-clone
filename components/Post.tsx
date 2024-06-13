"use client";

import { IPost } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import ReactTimeago from "react-timeago";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import deletePostAction from "@/actions/deletePostAction";
import Image from "next/image";
import { Fragment, useState } from "react";
import PostOptions from "./PostOptions";
import { toast } from "sonner";

type PostProps = {
	post: IPost;
};

const Post = ({ post }: PostProps) => {
	const { user } = useUser();
	const isAuthor = post.user.userId === user?.id;
	const [loadingImg, setLoadingImg] = useState(true);

	const onImageLoad = () => {
		setLoadingImg(false);
	};

	return (
		<div className="bg-white rounded-md border overflow-hidden">
			<div className="p-4 flex space-x-2">
				<Avatar>
					<AvatarImage src={post.user.userImage} />
					<AvatarFallback>
						{post.user.firstName.charAt(0)}
						{post.user.lastName?.charAt(0)}
					</AvatarFallback>
				</Avatar>

				<div className="flex justify-between flex-1">
					<div>
						<div className="flex items-center">
							<p className="font-semibold">
								{post.user.firstName} {post.user.lastName}{" "}
							</p>
							{isAuthor && (
								<Badge className="ml-2" variant="secondary">
									Author
								</Badge>
							)}
						</div>
						<p className="text-xs text-gray-400">
							@{post.user.firstName}
							{post.user.lastName}-{post.user.userId.slice(-4)}
						</p>
						<p className="text-xs text-gray-400">
							<ReactTimeago date={new Date(post.createdAt)} />
						</p>
					</div>

					{isAuthor && (
						<Button
							variant="outline"
							onClick={() => {
								const promise = deletePostAction(post._id.toString());

								// Toast
								toast.promise(promise, {
									loading: "Deleting post...",
									success: "Post deleted",
									error: "Failed to delete post",
								});
							}}
						>
							<Trash2 />
						</Button>
					)}
				</div>
			</div>

			<div>
				<p className="px-4 pb-2 mt-2">{post.text}</p>

				{post.imageUrl && (
					<Fragment>
						{loadingImg && (
							<div className="w-[500px] h-[500px] flex items-center justify-center animate-pulse">
								Loading...
							</div>
						)}
						<Image
							src={post.imageUrl}
							priority
							alt="post image"
							width={500}
							height={500}
							onLoad={onImageLoad}
							style={{ display: loadingImg ? "none" : "block" }}
							className="w-full mx-auto"
						/>
					</Fragment>
				)}
			</div>

			{/* Post Options */}
			<PostOptions post={post} />
		</div>
	);
};

export default Post;
