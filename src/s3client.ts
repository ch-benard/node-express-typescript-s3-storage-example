import { S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import config from './config';

const endpoint = config.endpoint;
const region = config.region;
const accessKeyId = config.accessKeyId;
const secretAccessKey = config.secretAccessKey;

export default new S3Client({
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    region,
    // bucketEndpoint: true,
    // forcePathStyle: true,
    endpoint,
    maxAttempts: 3,
    requestHandler: new NodeHttpHandler({
        connectionTimeout: 1000,
        requestTimeout: 1000
    }),
});