import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = "earthquake-sensor";

const s3 = new S3Client({
    region: "ap-south-1",  // ✅ Ensure this matches your bucket region
    endpoint: "https://s3.ap-south-1.amazonaws.com",  // ✅ Explicitly set the regional endpoint
    forcePathStyle: false // ✅ Default for AWS SDK v3
});

export async function handler(event) {
    console.log("✅ Received IoT event:", JSON.stringify(event, null, 2));

    try {
        const fileName = `iot-data-${Date.now()}.json`;
        const fileContent = JSON.stringify(event, null, 2);

        await s3.send(new PutObjectCommand({
            Bucket: BUCKET_NAME, // ✅ Use the correct variable
            Key: fileName,
            Body: fileContent,
            ContentType: "application/json"
        }));

        console.log(`✅ Successfully uploaded ${fileName} to S3.`);
        return { status: "success", file: fileName };
    } catch (error) {
        console.error("❌ Error uploading to S3:", error);
        return { status: "error", message: error.message };
    }
}
