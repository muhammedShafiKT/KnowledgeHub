import { s3Client } from "../../lib/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadtoS3(
    buffer :Buffer ,
    key : string ,
    contentType :string
){
    const command = new PutObjectCommand({
        Bucket : process.env.AWS_S3_BUCKET,
        Key : key,
        Body : buffer,
        ContentType : contentType
    })

    await s3Client.send(command)
return key;
}