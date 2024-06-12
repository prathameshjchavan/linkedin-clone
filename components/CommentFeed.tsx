import { IPost } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ReactTimeago from "react-timeago";
import { Badge } from "./ui/badge";

interface CommentFeedProps {
	post: IPost;
}

const CommentFeed = ({ post }: CommentFeedProps) => {
	const { user } = useUser();
	const isAuthor = user?.id === post.user.userId;

	return (
		<div className="space-y-2 mt-3">
			{post.comments?.map((comment) => (
				<div key={comment._id.toString()} className="flex space-x-1">
					<Avatar>
						<AvatarImage src={comment.user.userImage} />
						<AvatarFallback>
							{comment.user.firstName.charAt(0)}
							{comment.user.lastName?.charAt(0)}
						</AvatarFallback>
					</Avatar>

					<div className="bg-gray-100 px-4 py-2 rounded-md w-full sm:w-auto sm:min-w-[400px]">
						<div className="flex justify-between">
							<div>
								<div className="flex items-center">
									<p className="font-semibold">
										{comment.user.firstName} {comment.user.lastName}
									</p>
									{isAuthor && <Badge className="ml-2">Author</Badge>}
								</div>
								<p className="text-xs text-gray-400">
									@{comment.user.firstName}
									{comment.user.lastName}-{comment.user.userId.slice(-4)}
								</p>
							</div>
							<p className="text-xs text-gray-400">
								<ReactTimeago date={new Date(comment.createdAt)} />
							</p>
						</div>
						<p className="mt-3 text-sm">{comment.text}</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default CommentFeed;
