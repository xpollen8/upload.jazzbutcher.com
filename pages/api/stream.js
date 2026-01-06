const aws = require('aws-sdk');
const stream = require('stream');
const https = require('https');
const http = require('http');

aws.config.update({
	region: process.env.JBC_AWS_REGION,
	accessKeyId: process.env.JBC_AWS_ACCESSKEYID,
	secretAccessKey: process.env.JBC_AWS_SECRETACCESSKEY,
});

const S3_BUCKET = process.env.JBC_AWS_BUCKET;

const uploadStream = ({ Bucket, Key }) => {
  const s3 = new aws.S3();
  const pass = new stream.PassThrough();
	const upload = s3.upload({ Bucket, Key, Body: pass });
  return {
    writeStream: pass,
		upload,
    promise: upload.promise(),
  };
}

const handler = async (req, res) => {
	try {
		const s3 = new aws.S3();  // Create a new instance of S3
		const url = req.body.url;
		const who = req.body?.who;

		// TODO HEAD to ensure that the URL mimetype is same as filetype

		const parsed = new URL(url);
		const path = parsed?.pathname?.split('/');
		const Key = `${who}::${path[path?.length - 1] || 'UNDEFINED'}`;
		//console.log("FILE", { parsed, path, Key });
		const { writeStream, promise, upload } = uploadStream({ Bucket: S3_BUCKET, Key });
		const client = (parsed.protocol == "https:") ? https : http;
		client.get(parsed, (stream) => stream.pipe(writeStream));
		//upload.on('httpUploadProgress', onProgress);
		await promise;
		res.json({success:true});

	} catch(e) {
		console.log("ERROR", e);
		res.json({success: false, message: e });
	}
}

export default handler;
