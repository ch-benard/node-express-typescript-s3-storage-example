import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import s3client from './s3client';
// import sharp from 'sharp'
import config from './config';

export default async function s3Uploadv3(files: Express.Multer.File[],) {

    const params = files.map(file => {
        return {
            Bucket: config.bucket,
            Key: `${uuidv4()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
        }
    });

    console.log('params:');
    console.log(params);
    console.log('================================================================================');


    // const fileBuffer = await sharp(file.buffer)
    //     .resize({ height: 1920, width: 1080, fit: "contain" })
    //     .toBuffer();

    return await Promise.all(params.map(param => {
        s3client.send(new PutObjectCommand(param));
    }));
};