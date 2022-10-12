import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { document } from '@libs/dynamodbClient';
import { v4 as uuid } from 'uuid';

import schema from './schema';

const createTodo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const { user_id } = event.pathParameters;
  const { title, deadline } = event.body;

  try {
    await document.put({
      TableName: 'todos',
      Item: {
        _id: uuid(),
        user_id,
        title,
        done: false, 
        deadline
      }
    })
    .promise();  
  } catch (error) {
    return formatJSONResponse({
      error: `Database error: ${error}`
    })
  }

  return formatJSONResponse({
    message: `Succesfully saved todo: ${title}`,
  });
};

export const main = middyfy(createTodo);
