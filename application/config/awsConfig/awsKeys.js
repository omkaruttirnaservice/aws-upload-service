const awsKeys = {
	region: process.env.S3_BUCKET_REGION,
	accessKeyId: process.env.S3_ACCESS_KEY,
	secretKeyId: process.env.S3_SECRET_ACCESS_KEY,
	bucketName: process.env.S3_BUCKET_NAME,
	endpoint: process.env.S3_BUCKET_ENDPOINT,
	bucketURL: process.env.S3_BUCKET_URL
};

module.exports = awsKeys;
