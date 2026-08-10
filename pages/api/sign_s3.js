import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const region = process.env.JBC_AWS_REGION;
const bucket = process.env.JBC_AWS_BUCKET;
const accessKeyId = process.env.JBC_AWS_ACCESSKEYID;
const secretAccessKey = process.env.JBC_AWS_SECRETACCESSKEY;

const handler = async (req, res) => {
	const key = req.body.fileName;
	const client = new S3Client({ region, accessKeyId, secretAccessKey });
	const command = new PutObjectCommand({ Bucket: bucket, Key: key });
	const signedRequest = await getSignedUrl(client, command, { expiresIn: 3600 });
	console.log("API", { success: true, returnedData: { url: key, signedRequest }});
	return res.json({ success: true, url: key, signedRequest });
}

export default handler;
