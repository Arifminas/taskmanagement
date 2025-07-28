const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const crypto = require('crypto');

// Configure your AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION, // e.g. 'ap-southeast-1' for Singapore
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to upload a buffer/file to S3
async function uploadFileToS3(buffer, bucketName, key, mimetype) {
  try {
    const uploadParams = {
      Bucket: bucketName,
      Key: key, // e.g. 'tasks/filename.ext'
      Body: buffer,
      ContentType: mimetype,
      ACL: 'public-read', // Optional: Makes file public
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Return the public URL or S3 path
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
}

// Optional: Generate random filename
function generateRandomFilename(originalName) {
  const ext = path.extname(originalName);
  const randomName = crypto.randomBytes(16).toString('hex');
  return `${randomName}${ext}`;
}

module.exports = { uploadFileToS3, generateRandomFilename };
