import UserInformation from "@/components/UserInformation";

export default function Home() {
	return (
		<main className="grid grid-cols-1">
			<section>
				<UserInformation />
			</section>
			<section>
				{/* Post Form */}
				{/* Post Feed */}
			</section>
			<section>{/* Widget */}</section>
		</main>
	);
}
