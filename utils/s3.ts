import aws from 'aws-sdk'
import crypto from 'crypto'
import { promisify } from "util"
const randomBytes = promisify(crypto.randomBytes)


const region = "us-west-1"
const bucketName = "fitterapp"
const accessKeyId = 'AKIAQ7BNSSTO426AWSNJ'
const secretAccessKey = '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'

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})

async function generateUploadURL() {
    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
}

export default generateUploadURL