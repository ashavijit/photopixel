const getBucketObjects = require("../aws/s3lib").getBucketObjects; 

const get = async (req, res, next) => {
    try {
        const objects = await getBucketObjects("pixelxs");
        res.status(200).json({
            status: true,
            message: "Successfully fetched objects",
            data: objects,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
}

exports.getAllImages = async (req, res) => {
    try {
        const bucketName = 'testbucketfp'; // Replace with your actual bucket name
        // Extract the pagination parameters from query parameters, or use default values if not provided
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Fetch data from S3 or use cached data if available
        const allImages = await getImagesFromBucket(bucketName);

        // Count the total number of images in the bucket
        const totalImages = allImages.length;

        // Calculate the total number of pages based on the total images and limit per page
        const totalPages = Math.ceil(totalImages / limit);

        // Apply pagination and limit the number of images
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const images =
            limit !== 10 ? allImages.slice(startIndex, endIndex) : allImages;

        // Extract the image links from the retrieved images and create an array of links
        const imageLinks = images.map((image) => {
            return {
                key: image.key,
                link: `https://s3.${REGION}.amazonaws.com/${bucketName}/${encodeURIComponent(
                    image.key
                )}`
            };
        });

        // Send the image links as the response
        res.status(200).json({
            status: 'success',
            images: imageLinks,
            totalPages: totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};

module.exports = get;