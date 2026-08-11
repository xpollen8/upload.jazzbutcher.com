const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

const handler = async (req, res) => {
	const url = req.body.url;
	const who = req.body?.who;
	const parsed = new URL(url);
	const path = parsed?.pathname?.split('/');
	const Bucket = process.env.JBC_AWS_BUCKET;
	const Key = `${who}::${path[path?.length - 1] || 'UNDEFINED'}`;

	try {
		const fetched = await fetch(url);
		if (fetched?.status === 200) {
			const xfer = new Upload({ client: new S3Client(), params: { Bucket, Key, Body: fetched.body} });
			await xfer.done();
			res.json({ success: true });
		}
		throw(fetched?.statusText);
	} catch (e) {
		res.json({ success: false, message: e.toString() });
	}
}

export default handler;
