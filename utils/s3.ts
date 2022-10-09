import aws from 'aws-sdk';
import crypto from 'crypto';
import { promisify } from "util";
const randomBytes = promisify(crypto.randomBytes);

export interface S3Vars {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
}

const bucketName = 'fitterapp';

let s3: any;

export const initializeS3 = (
    { accessKeyId, secretAccessKey, region }:
        { region: string, accessKeyId: string, secretAccessKey: string }
) => {
    if (!s3) {
        s3 = new aws.S3({
            region,
            accessKeyId,
            secretAccessKey,
            signatureVersion: 'v4'
        })
    }
}

async function generateUploadURL() {
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString('hex');

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    });

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return uploadURL;
};

export default generateUploadURL;