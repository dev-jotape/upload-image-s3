import bcrypt from 'bcryptjs-then';
import * as userDatasource from './usersDatasource';
import jwt from 'jsonwebtoken';

const TableName = process.env.TABLE_NAME;

export const verifyToken = async (event, _context, callback) => {
  try {
    const token = event.authorizationToken.replace('Bearer ', '');

    const methodArn = event.methodArn;

    if (!token || !methodArn) return callback(null, "Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded && decoded.email) {
      const user = await userDatasource.findUserByEmail(TableName, decoded.email);
      if(user) {
        return callback(null, generateAuthResponse(user.email, "Allow", methodArn));
      } else {
        return callback(null, generateAuthResponse(user.email, "Deny", methodArn));
      }
    } else {
      return callback(null, "Unauthorized");
    }
  } catch (error) {
    return callback(null, "Unauthorized");
  }
};

function generateAuthResponse(principalId, effect, methodArn) {
  const policyDocument = generatePolicyDocument(effect, methodArn);

  return {
    principalId,
    policyDocument
  };
}

function generatePolicyDocument(effect, methodArn) {
  if (!effect || !methodArn) return null;

  const policyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: methodArn
      }
    ]
  };

  return policyDocument;
}

export const login = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    const user = await userDatasource.findUserByEmail(TableName, email);

    if (!user) return {
      statusCode: 400,
      body: 'Email is not correct'
    };

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) return {
      statusCode: 400,
      body: 'Password is not correct'
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        token: jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: 86400 }),
        user
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};

export const register = async (event) => {
  try {
    const { name, email, password } = JSON.parse(event.body);

    const user = await userDatasource.findUserByEmail(TableName, email);

    if (user) return {
      statusCode: 400,
      body: 'User already exists'
    };

    const params = {
      TableName,
      Item: {
        name,
        email,
        password: await bcrypt.hash(password, 8),
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      },
    };

    const resp = await userDatasource.createUser(params);
    return {
      statusCode: 200,
      body: JSON.stringify(resp)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};
