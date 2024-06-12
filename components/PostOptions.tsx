"use client";

import { IPost } from "@/mongodb/models/post";
import { SignedIn, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import CommentFeed from "./CommentFeed";

interface PostOptionsProps {
	post: IPost;
}

const PostOptions = ({ post }: PostOptionsProps) => {
	const [isCommentOpen, setIsCommentOpen] = useState(false);
	const { user } = useUser();
	const [liked, setLiked] = useState(false);
	const [likes, setLikes] = useState(post.likes);
	const postId = post._id.toString();

	const likeOrUnlikePost = async () => {
		if (!user?.id) throw new Error("User not authenticated");

		const originalLiked = liked;
		const originalLikes = likes;

		const newLikes = liked
			? likes?.filter((like) => like !== user.id)
			: [...(likes ?? []), user.id];

		const body = { userId: user.id };

		setLiked(!liked);
		setLikes(newLikes);

		const response = await fetch(
			`/api/posts/${postId}/${liked ? "unlike" : "like"}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			}
		);

		if (!response.ok) {
			setLiked(originalLiked);
			setLikes(originalLikes);
			throw new Error("Failed to Like or Unlike post");
		}

		const fetchLikeResponse = await fetch(`/api/posts/${postId}/like`);
		if (!fetchLikeResponse.ok) {
			setLiked(originalLiked);
			setLikes(originalLikes);
			throw new Error("Failed to fetch likes");
		}

		const newLikedData = await fetchLikeResponse.json();

		setLikes(newLikedData);
	};

	useEffect(() => {
		if (user?.id && post.likes?.includes(user.id)) setLiked(true);
	}, [post, user]);

	return (
		<div>
			<div className="flex justify-between p-4">
				<div>
					{likes && likes.length > 0 && (
						<p className="text-xs text-gray-500 cursor-pointer hover:underline">
							{likes.length} likes
						</p>
					)}
				</div>

				<div>
					{post.comments && post.comments.length > 0 && (
						<p
							onClick={() => setIsCommentOpen(!isCommentOpen)}
							className="text-xs text-gray-500 cursor-pointer hover:underline"
						>
							{post.comments.length} comments
						</p>
					)}
				</div>
			</div>

			<div className="flex p-2 justify-between border-t">
				<Button
					onClick={likeOrUnlikePost}
					variant="ghost"
					className="postButton"
				>
					<ThumbsUpIcon
						className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")}
					/>
					Like
				</Button>

				<Button
					variant="ghost"
					className="postButton"
					onClick={() => setIsCommentOpen(!isCommentOpen)}
				>
					<MessageCircle
						className={cn(
							"mr-1",
							isCommentOpen && "text-gray-600 fill-gray-600"
						)}
					/>
					Comment
				</Button>

				<Button variant="ghost" className="postButton">
					<Repeat2 className="mr-1" />
					Repost
				</Button>

				<Button variant="ghost" className="postButton">
					<Send className="mr-1" />
					Send
				</Button>
			</div>

			{isCommentOpen && (
				<div className="p-4">
					<SignedIn>{/* <CommentForm postId={post.id} /> */}</SignedIn>
					
					<CommentFeed post={post} />
				</div>
			)}
		</div>
	);
};

export default PostOptions;
