import { IPost } from "@/mongodb/models/post";
import Post from "./Post";

interface PostFeedProps {
	posts: IPost[];
}

const PostFeed = ({ posts }: PostFeedProps) => {
	return (
		<div className="space-y-2 pb-20">
			{posts.map((post) => (
				<Post key={post._id.toString()} post={post} />
			))}
		</div>
	);
};

export default PostFeed;
