const aws = require('aws-sdk'); 

aws.config.update({
  region: process.env.JBC_AWS_REGION,
  accessKeyId: process.env.JBC_AWS_ACCESSKEYID,
  secretAccessKey: process.env.JBC_AWS_SECRETACCESSKEY,
})

const S3_BUCKET = process.env.JBC_AWS_BUCKET;

const handler = async (req, res) => {
	try {
		const s3 = new aws.S3();  // Create a new instance of S3
		const fileName = req.body.fileName;
		const fileType = req.body.fileType;
		// Set up the payload of what we are sending to the S3 api
		console.log("S3 SIGN", { fileName, fileType });
		const s3Params = {
			Bucket: S3_BUCKET,
			Key: fileName,
			Expires: 3000,
			ContentType: fileType,
			ACL: 'public-read'
		};
		// Make a request to the S3 API to get a signed URL which we can use to upload our file
		await s3.getSignedUrl('putObject', s3Params, (err, data) => {
			if(err){
				console.log({success: false, error: err});
				res.json({success: false, error: err})
			}
			// Data payload of what we are sending back,
			// the url of the signedRequest and a URL where we can access the content after its saved. 
			const returnData = {
				signedRequest: data,
				url: `https://${S3_BUCKET}/${fileName}`
			};
			console.log("SIGNED", returnData);
			res.json({success:true, data:{returnData}});
		});
	} catch(e) {
		console.log("ERROR", e);
		res.json({success: false, data: e });
	}
}

export default handler;
