/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ hostname: "links.papareact.com", protocol: "https" },
			{ hostname: "img.clerk.com", protocol: "https" },
			{ hostname: "linkedincloneprathamesh.blob.core.windows.net", protocol: "https" },
		],
	},
};

export default nextConfig;
