import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadToS3(file, fileName) {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `shop-images/${Date.now()}-${fileName}`,
    Body: buffer,
    ContentType: file.type,
  };

  await s3Client.send(new PutObjectCommand(params));
  
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
}