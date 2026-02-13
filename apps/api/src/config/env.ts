import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const envPathCandidates = [
  process.env.DOTENV_PATH,
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "apps/api/.env"),
  path.resolve(__dirname, "../../.env"),
].filter(Boolean) as string[];

const resolvedEnvPath = envPathCandidates.find((candidate) => fs.existsSync(candidate));
dotenv.config({ path: resolvedEnvPath, override: true });

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
  allowJwtBypass: process.env.ALLOW_JWT_BYPASS === "true",
  authMode: process.env.AUTH_MODE ?? "cognito",
  localJwtSecret: process.env.LOCAL_JWT_SECRET ?? "local-dev-secret",
  smtpHost: process.env.SMTP_HOST ?? "smtp.gmail.com",
  smtpPort: Number(process.env.SMTP_PORT ?? 465),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  smtpFrom: process.env.SMTP_FROM ?? "",
};
