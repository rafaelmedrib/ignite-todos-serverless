import type { AWS } from '@serverless/typescript';

import createTodo from '@functions/createTodo';
import getUserTodos from '@functions/getUserTodos';

const serverlessConfiguration: AWS = {
  service: 'ignite-todo',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local','serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:*'],
            Resource: ['*']
          }
        ]
      }
    }
  },
  // import the function via paths
  functions: { createTodo, getUserTodos },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ['dev', 'local'],
      start: {
        inMemory: true,
        migrate: true,
        port: 8000
      }
    }    
  },
  resources: {
    Resources: {
      dbTodos: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'todos',
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
          AttributeDefinitions: [
            {
              AttributeName: '_id',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: '_id',
              KeyType: 'HASH'
            }
          ]
        },
      }
    }
  }
};

module.exports = serverlessConfiguration;
