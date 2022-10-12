import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { document } from '@libs/dynamodbClient';
import { APIGatewayProxyHandler } from 'aws-lambda';

const getUserTodos: APIGatewayProxyHandler = async (event) => {

  const { user_id } = event.pathParameters;

  const todos = await document.scan({
    TableName: 'todos',
    FilterExpression: 'user_id = :user_id',
    ExpressionAttributeValues: {
      ':user_id': user_id
    }
  }).promise();

  if (!todos.Count) {
    return formatJSONResponse({
      message: `No todos have been found for user: ${user_id}`
    });
  }

  return formatJSONResponse({
    todos: todos.Items,
  });
};

export const main = middyfy(getUserTodos);