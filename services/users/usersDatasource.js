import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const findUserByEmail = async (TableName, email) => {
  try {
    const res = await dynamoDb.scan({
      TableName,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    }).promise();

    return res && res.Items && res.Items[0] ? res.Items[0] : null;
  } catch (error) {
    throw new Error(error);
  }
};

export const createUser = async (params) => {
  try {
    await dynamoDb.put(params).promise();
    return params.Item;
  } catch (error) {
    throw new Error(error);
  }
};
