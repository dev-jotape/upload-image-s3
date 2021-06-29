# Upload image to S3 - Serverless Framework (AWS)

API created for fetch an image and upload to a S3 bucket.

# Get started
### Install
`yarn`
`npm install`

### Create .env
Use the env.example to create an .env file.

### Deploy
`serverless deploy`

### Test
`npm run test`

### ESlint
`npm run lint`

# Usage
## Register

POST https://hgdek56d34.execute-api.us-east-1.amazonaws.com/prod/register

Body:
```json
{
    "email": "test@gmail.com",
    "password": "test123",
    "name": "Test"
}
```

## Login

POST https://hgdek56d34.execute-api.us-east-1.amazonaws.com/prod/login

```json
{
    "email": "test@gmail.com",
    "password": "test123"
}
```

## Upload Image

POST https://hgdek56d34.execute-api.us-east-1.amazonaws.com/prod/images

Header:
```bash
Authorization: Bearer ACCESS_TOKEN
```

Body:
```json
{
    "image_url": "https://github.githubassets.com/images/modules/open_graph/github-mark.png",
    "key": "github.png"
}
```