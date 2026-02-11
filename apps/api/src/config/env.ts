import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: process.env.DATABASE_URL ?? "",
  databaseSsl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  awsRegion: process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? "us-east-1",
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID ?? "",
  cognitoClientId: process.env.COGNITO_CLIENT_ID ?? "",
  s3Bucket: process.env.S3_BUCKET ?? "",
  cloudfrontDomain: process.env.CLOUDFRONT_DOMAIN ?? "",
  cloudfrontKeyId: process.env.CLOUDFRONT_KEY_ID ?? "",
  cloudfrontPrivateKey: process.env.CLOUDFRONT_PRIVATE_KEY ?? "",
};
