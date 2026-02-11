import { createRemoteJWKSet, jwtVerify } from "jose";

import { env } from "../config/env";

const issuer = env.cognitoUserPoolId
  ? `https://cognito-idp.${env.awsRegion}.amazonaws.com/${env.cognitoUserPoolId}`
  : "";

const jwks = issuer ? createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`)) : null;

export async function verifyAccessToken(token: string) {
  if (!issuer || !jwks) {
    throw new Error("Cognito issuer not configured");
  }

  const { payload } = await jwtVerify(token, jwks, {
    issuer,
    audience: env.cognitoClientId,
  });

  return payload;
}
