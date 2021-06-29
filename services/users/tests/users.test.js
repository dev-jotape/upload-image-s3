import { login, register } from '../usersHandler';

jest.mock('../usersDatasource', () => {
  return {
    findUserByEmail: jest.fn((_tableName, email) => {
      if(email === 'test1@gmail.com') return new Promise((resolve) => resolve(null));
      else return new Promise((resolve) => resolve({
        email: 'test1@gmail.com',
        password: '$2a$08$DFDKzEo/3wobygjXA67jL.bd1C8YHWBCFC.n4ew3Behc9AOMiL7XK',
      }));
    }),
    createUser: jest.fn(() => new Promise((resolve) => resolve({
      email: 'test1@gmail.com',
      password: '$2a$08$DFDKzEo/3wobygjXA67jL.bd1C8YHWBCFC.n4ew3Behc9AOMiL7XK'
    })))
  }
});

describe('Users Tests', () => {
  describe('Register test', () => {
    it('should return success', async () => {
      const event = {
        "body": `{
            "email": "test1@gmail.com",
            "password": "test123"
        }`
      };

      const result = await register(event);
      expect(typeof result).toEqual('object');
      expect(result.statusCode).toEqual(200);
      expect(result.body).toEqual('{"email":"test1@gmail.com","password":"$2a$08$DFDKzEo/3wobygjXA67jL.bd1C8YHWBCFC.n4ew3Behc9AOMiL7XK"}');
    });
  });

  describe('Login test', () => {
    it('should return success', async () => {
      const event = {
        "body": `{
            "email": "test2@gmail.com",
            "password": "test123"
        }`
      };

      const result = await login(event);
      expect(typeof result).toEqual('object');
      expect(result.statusCode).toEqual(200);
      expect(JSON.parse(result.body).token).toBeTruthy()
    });
  })
})