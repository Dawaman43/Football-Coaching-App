import {
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand,
  ForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { cognitoClient } from "../lib/aws";
import { env } from "../config/env";

export async function signUpUser(input: { email: string; password: string; name: string }) {
  const command = new SignUpCommand({
    ClientId: env.cognitoClientId,
    Username: input.email,
    Password: input.password,
    UserAttributes: [
      { Name: "email", Value: input.email },
      { Name: "name", Value: input.name },
    ],
  });

  const response = await cognitoClient.send(command);
  return response;
}

export async function confirmSignUp(input: { email: string; code: string }) {
  const command = new ConfirmSignUpCommand({
    ClientId: env.cognitoClientId,
    Username: input.email,
    ConfirmationCode: input.code,
  });

  const response = await cognitoClient.send(command);
  return response;
}

export async function resendConfirmation(input: { email: string }) {
  const command = new ResendConfirmationCodeCommand({
    ClientId: env.cognitoClientId,
    Username: input.email,
  });

  const response = await cognitoClient.send(command);
  return response;
}

export async function loginUser(input: { email: string; password: string }) {
  const command = new InitiateAuthCommand({
    ClientId: env.cognitoClientId,
    AuthFlow: "USER_PASSWORD_AUTH",
    AuthParameters: {
      USERNAME: input.email,
      PASSWORD: input.password,
    },
  });

  const response = await cognitoClient.send(command);
  return response;
}

export async function startForgotPassword(input: { email: string }) {
  const command = new ForgotPasswordCommand({
    ClientId: env.cognitoClientId,
    Username: input.email,
  });

  const response = await cognitoClient.send(command);
  return response;
}

export async function confirmForgotPassword(input: { email: string; code: string; password: string }) {
  const command = new ConfirmForgotPasswordCommand({
    ClientId: env.cognitoClientId,
    Username: input.email,
    ConfirmationCode: input.code,
    Password: input.password,
  });

  const response = await cognitoClient.send(command);
  return response;
}
