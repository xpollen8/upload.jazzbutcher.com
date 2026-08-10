import { S3RequestPresigner, getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetSignedObject, PutObjectCommand } from "@aws-sdk/client-s3";

const handler = async (req, res) => {
	try {
		const fileName = req.body.fileName;
		//const fileType = req.body.fileType;
		const s3Client = new S3Client({
			region: process.env.JBC_AWS_REGION,
			accessKeyId: process.env.JBC_AWS_ACCESSKEYID,
			secretAccessKey: process.env.JBC_AWS_SECRETACCESSKEY,
		});

		const command = new PutObjectCommand(
			{
				Bucket: process.env.JBC_AWS_BUCKET,
				Key: fileName,
				//ContentType: fileType,
			}
		);
		const signedURL = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
		const returnData = {
			signedRequest: signedURL,
			url: fileName,
		};
		res.json({ success:true, returnData });

	} catch(e) {
		console.log("ERROR", e);
		res.json({success: false, data: e });
	}
}

export default handler;
