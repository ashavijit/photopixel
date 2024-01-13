const {
    S3Client,
    ListObjectsCommand,
    GetObjectCommand,
} = require("@aws-sdk/client-s3");
const REGION = "ap-south-1";
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const getBucketObjects = async (bucketName) => {
    const command = new ListObjectsCommand({
        Bucket: "pixelxs",
    });

    try {
        const response = await s3.send(command);
        return response.Contents;

    } catch (error) {
        console.error(error);
        return [];
    }
};



exports.getBucketObjects = getBucketObjects;