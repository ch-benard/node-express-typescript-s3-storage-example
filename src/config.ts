import dotenv from "dotenv";

dotenv.config();

interface S3CLIENTCONF {
    endpoint: string | undefined;
    bucket: string | undefined;
    region: string | undefined;
    accessKeyId: string | undefined;
    secretAccessKey: string | undefined;
}

interface S3ClientConf {
    endpoint: string;
    bucket: string | undefined;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
}


const getS3ClientConfig = (): S3CLIENTCONF => {
    return {
        endpoint: process.env.S3_ENDPOINT,
        bucket: process.env.S3_BUCKET,
        region: process.env.S3_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
}

// Throwing an Error if any field was undefined. We don't 
// want our app to run if it can't connect to the Bucket.
// If all is good return it as Config which just removes
// the undefined from our type definition.
const getSanitzedConfig = (config: S3CLIENTCONF): S3ClientConf => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }
    return config as S3ClientConf;
};

const config = getS3ClientConfig();
const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;