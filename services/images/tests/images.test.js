import { uploadImage } from '../imagesHandler';

jest.mock('aws-sdk', () => {
  const putObjectOutputMock = {
    promise: jest.fn(() => ({
      "ETag": "123"
    })),
  };

  return {
    S3: jest.fn(() => {
      return {
        putObject: jest.fn(() => putObjectOutputMock)
      }
    }) 
  };
});

describe('Images Tests', () => {
  describe('Upload image', () => {
    it('should return success', async () => {
      const event = {
        "body": `{
            "image_url": "https://github.githubassets.com/images/modules/open_graph/github-mark.png",
            "key": "github.png"
        }`
      };

      const result = await uploadImage(event);
      expect(typeof result).toEqual('object');
      expect(result.statusCode).toEqual(200);
      expect(result.body).toEqual('{"ETag":"123"}');
    });
  });
})