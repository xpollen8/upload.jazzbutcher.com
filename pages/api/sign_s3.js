import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const handler = async (req, res) => {
	const key = req.body.fileName;
	const region = process.env.JBC_AWS_REGION;
	const bucket = process.env.JBC_AWS_BUCKET;

	const client = new S3Client({ region, credentials: {
	    secretAccessKey: process.env.JBC_AWS_ACCESSKEYID,
			accessKeyId: process.env.JBC_AWS_SECRETACCESSKEY,
	}});
	const command = new PutObjectCommand({ Bucket: bucket, Key: key });
	const signedRequest = await getSignedUrl(client, command, { expiresIn: 3600 });
	console.log("API", { success: true, returnedData: { url: key, signedRequest }});
	return res.json({ success: true, url: key, signedRequest });
}

export default handler;
