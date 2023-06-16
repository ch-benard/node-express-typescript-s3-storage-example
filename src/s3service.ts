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


    try {
        // Création d'un tableau de promesses d'envoi vers S3
        const uploadPromises: Promise<string>[] = files.map(async (file) => {
            // Paramètres pour l'envoi vers S3
            const params = {
                Bucket: config.bucket,
                Key: `${uuidv4()}-${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            // Envoi du fichier vers S3
            await s3client.send(new PutObjectCommand(params));

            // Retour de l'URL du fichier S3
            return `https://YOUR_BUCKET_NAME.s3.YOUR_AWS_REGION.YOUR_HOSTING_PROVIDER/${file.originalname}`;
        });

        // Attendre que toutes les promesses d'envoi soient résolues
        const fileURLs: string[] = await Promise.all(uploadPromises);

        // Retour des URLs des fichiers S3
        return (fileURLs.join(', '));
    } catch (err) {
        console.error(err);
        throw new Error('Une erreur s\'est produite lors de l\'envoi des fichiers vers S3.');
    }



};