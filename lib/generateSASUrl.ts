import generateSASToken, { containerName } from "./generateSASToken";

export default async function generateSASUrl() {
	const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
	const sasToken = await generateSASToken();
	const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}?${sasToken}`;

    return sasUrl;
}
