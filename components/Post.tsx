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

type PostProps = {
	post: IPost;
};

const Post = ({ post }: PostProps) => {
	const { user } = useUser();
	const isAuthor = post.user.userId === user?.id;

	return (
		<div className="bg-white rounded-md border">
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
						<p className="font-semibold">
							{post.user.firstName} {post.user.lastName}{" "}
							{isAuthor && (
								<Badge className="ml-2" variant="secondary">
									Author
								</Badge>
							)}
						</p>
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
							}}
						>
							<Trash2 />
						</Button>
					)}
				</div>
			</div>

			<div>
				<p>{post.text}</p>

				{post.imageUrl && (
					<Image
						src={post.imageUrl}
						alt="post image"
						width={500}
						height={500}
						className="w-full mx-auto"
					/>
				)}
			</div>

			{/* Post Options */}
		</div>
	);
};

export default Post;
