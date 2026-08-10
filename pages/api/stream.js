/* NEEDS V3 treatment
const aws = require('aws-sdk');

const { Upload } = require('@aws-sdk/lib-storage');
const { S3 } = require('@aws-sdk/client-s3');

const stream = require('stream');
const https = require('https');
const http = require('http');

// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
aws.config.update({
	region: process.env.JBC_AWS_REGION,
	accessKeyId: process.env.JBC_AWS_ACCESSKEYID,
	secretAccessKey: process.env.JBC_AWS_SECRETACCESSKEY,
});

const S3_BUCKET = process.env.JBC_AWS_BUCKET;

const uploadStream = ({ Bucket, Key }) => {
  const s3 = new S3({
	region: process.env.JBC_AWS_REGION,

	credentials: {
		accessKeyId: process.env.JBC_AWS_ACCESSKEYID,
		secretAccessKey: process.env.JBC_AWS_SECRETACCESSKEY,
	  },
  });
  const pass = new stream.PassThrough();
	const upload = new Upload({
		client: s3,
		params: { Bucket, Key, Body: pass },
	});
  return {
	writeStream: pass,
		upload,
	promise: // The `.promise()` call might be on an JS SDK v2 client API.
	// If yes, please remove .promise(). If not, remove this comment.
	upload.promise(),
  };
}

const handler = async (req, res) => {
	try {
		const s3 = new S3({
			region: process.env.JBC_AWS_REGION,

			credentials: {
				accessKeyId: process.env.JBC_AWS_ACCESSKEYID,
				secretAccessKey: process.env.JBC_AWS_SECRETACCESSKEY,
			},
		});  // Create a new instance of S3
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
*/
