import { DynamoDB } from 'aws-sdk';

const options = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'x',
  secretAccessKey: 'x'
}

const isOffline = () => {
  // This environment variable is set via serverless-offline run
  return process.env.IS_OFFLINE;
}

export const document = isOffline() ? new DynamoDB.DocumentClient(options) : new DynamoDB.DocumentClient();