import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const handler = async (req, res) => {
	const Key = req.body.fileName;
	const Bucket = process.env.JBC_AWS_BUCKET;

	const client = new S3Client();
	const command = new PutObjectCommand({ Bucket, Key });
	const signedRequest = await getSignedUrl(client, command, { expiresIn: 3600 });
	return res.json({ success: true, url: Key, signedRequest });
}

export default handler;
