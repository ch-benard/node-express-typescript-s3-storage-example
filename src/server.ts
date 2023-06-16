import express, { Express, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import s3Uploadv3 from './s3service';
import config from './config';

const app: Express = express();
const port = config.port ?? 4050;

// Store on S3 Bucket
const storage = multer.memoryStorage();

// multiple files upload with custom files names
const fileFilter = (req: Request, files: Express.Multer.File, cb: FileFilterCallback) => {
    if (files.mimetype.split("/")[0] === 'image') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1000000,
        files: 2,
    }
});

app.get('/', (res: Response) => {
    res.send('Hello, this is Express + TypeScript');
});

app.post('/upload', upload.array("files"), async (req: Request, res) => {
    console.log('================================================================================');
    console.log(req.files);
    console.log('================================================================================');

    const files: Express.Multer.File[] = req.files as Express.Multer.File[];
    try {
        const results = await s3Uploadv3(files);
        console.log('results:');
        console.log(results);
        console.log('================================================================================');
    } catch (error) {
        console.log(error);
    }
});

// multiple fields files upload
// const multiUpload = upload.fields([
//     { name: "avatar", maxCount: 1 },
//     { name: "resume", maxCount: 1 },
// ]);
// app.post('/upload', multiUpload, (req, res) => {
//     console.log(req.files);
//     res.json({ status: "success" });
// });

app.use((error: Error, req: Request, res: Response, next: any) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "File is too large !",
            });
        }

        if (error.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                message: "File limit reached !",
            });
        }

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                message: "File must be an image !",
            });
        }

    }
});

app.listen(port, () => {
    // only log this information in development.
    if (process.env?.NODE_ENV !== "production") {
        console.log(process.env?.NODE_ENV || 'Not in PRODUCTION');
        console.log(`[Server]: I am running at https://localhost:${port}`);
    }
});