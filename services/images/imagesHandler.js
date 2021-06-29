import * as AWS from 'aws-sdk';
import fetch from 'node-fetch';

const s3 = new AWS.S3();

export const uploadImage = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const imageFetched = await fetch(body.image_url);
    const arrayBuffer = await imageFetched.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const putImage = await s3.putObject({
      Bucket: process.env.BUCKET,
      Key: body.key,
      Body: buffer,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(putImage),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};
