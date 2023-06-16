import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.PORT ?? 4050;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, this is Express + TypeScript');
});

app.listen(port, () => {
    // only log this information in development.
    if (process.env?.NODE_ENV !== "production") {
        console.log(process.env?.NODE_ENV || 'Not in PRODUCTION');
        console.log(`[Server]: I am running at https://localhost:${port}`);
    }
});