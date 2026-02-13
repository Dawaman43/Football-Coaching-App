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

  const { payload } = await jwtVerify(token, jwks, { issuer });

  const tokenUse = payload.token_use as string | undefined;
  if (tokenUse === "access") {
    if (payload.client_id !== env.cognitoClientId) {
      throw new Error("Invalid token");
    }
  } else if (tokenUse === "id") {
    if (payload.aud !== env.cognitoClientId) {
      throw new Error("Invalid token");
    }
  } else {
    throw new Error("Invalid token");
  }

  return payload;
}
