import express, { Request, Response } from 'express';
import multer, { Multer } from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import config from './config';

// Configuration AWS
const endpoint = config.endpoint;
const bucket = config.bucket;
const region = config.region;
const accessKeyId = config.accessKeyId;
const secretAccessKey = config.secretAccessKey;

const s3 = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    endpoint,
});

// Configuration Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Création de l'application Express
const app = express();

// Route pour l'upload de fichiers
app.post('/upload', upload.array('files'), async (req: Request, res: Response) => {
    try {
        // Récupération des fichiers uploadés
        const files: Express.Multer.File[] = req.files as Express.Multer.File[];

        // Création d'un tableau de promesses d'envoi vers S3
        const uploadPromises: Promise<string>[] = files.map(async (file) => {
            // Paramètres pour l'envoi vers S3
            const params = {
                Bucket: bucket,
                Key: file.originalname,
                Body: file.buffer
            };

            // Envoi du fichier vers S3
            await s3.send(new PutObjectCommand(params));

            // Retour de l'URL du fichier S3
            return `https://YOUR_BUCKET_NAME.s3.YOUR_AWS_REGION.amazonaws.com/${file.originalname}`;
        });

        // Attendre que toutes les promesses d'envoi soient résolues
        const fileURLs: string[] = await Promise.all(uploadPromises);

        // Retour des URLs des fichiers S3
        res.send(`Fichiers uploadés avec succès : ${fileURLs.join(', ')}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Une erreur s\'est produite lors de l\'envoi des fichiers vers S3.');
    }
});

// Démarrage du serveur
app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});