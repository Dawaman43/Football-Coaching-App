import {
  ChangePasswordCommand,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandOutput,
  ConfirmForgotPasswordCommandOutput,
  ForgotPasswordCommandOutput,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  ResendConfirmationCodeCommandOutput,
  ResendConfirmationCodeCommand,
  SignUpCommand,
  SignUpCommandOutput,
  CodeDeliveryDetailsType,
  ForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { cognitoClient } from "../lib/aws";
import { env } from "../config/env";

function mapCognitoError(error: any) {
  const name = error?.name || error?.__type;
  if (name === "InvalidPasswordException") {
    return { status: 400, message: "Password must include an uppercase letter, a lowercase letter, and a number." };
  }
  if (name === "UsernameExistsException") {
    return { status: 409, message: "An account with this email already exists." };
  }
  if (name === "InvalidParameterException") {
    return { status: 400, message: "Invalid request." };
  }
  if (name === "NotAuthorizedException") {
    return { status: 401, message: "Invalid credentials." };
  }
  if (name === "UserNotConfirmedException") {
    return { status: 403, message: "User is not confirmed. Please verify your email." };
  }
  if (name === "ExpiredCodeException" || name === "CodeMismatchException") {
    return { status: 400, message: "Invalid or expired verification code." };
  }
  return null;
}

function rethrowCognitoError(error: any): never {
  const mapped = mapCognitoError(error);
  if (mapped) {
    throw mapped;
  }
  throw error;
}

type SignUpResult = SignUpCommandOutput | { alreadyExists: true; CodeDeliveryDetails?: CodeDeliveryDetailsType };

export async function signUpUser(input: { email: string; password: string; name: string }): Promise<SignUpResult> {
  try {
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
  } catch (error) {
    const name = (error as any)?.name || (error as any)?.__type;
    if (name === "UsernameExistsException") {
      const resend = await resendConfirmation(input);
      return { alreadyExists: true, CodeDeliveryDetails: resend.CodeDeliveryDetails };
    }
    rethrowCognitoError(error);
  }
}

export async function confirmSignUp(input: { email: string; code: string }): Promise<ConfirmSignUpCommandOutput> {
  try {
    const command = new ConfirmSignUpCommand({
      ClientId: env.cognitoClientId,
      Username: input.email,
      ConfirmationCode: input.code,
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    rethrowCognitoError(error);
  }
}

export async function resendConfirmation(input: { email: string }): Promise<ResendConfirmationCodeCommandOutput> {
  try {
    const command = new ResendConfirmationCodeCommand({
      ClientId: env.cognitoClientId,
      Username: input.email,
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    rethrowCognitoError(error);
  }
}

export async function loginUser(input: { email: string; password: string }): Promise<InitiateAuthCommandOutput> {
  try {
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
  } catch (error) {
    rethrowCognitoError(error);
  }
}

export async function startForgotPassword(input: { email: string }): Promise<ForgotPasswordCommandOutput> {
  try {
    const command = new ForgotPasswordCommand({
      ClientId: env.cognitoClientId,
      Username: input.email,
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    rethrowCognitoError(error);
  }
}

export async function confirmForgotPassword(input: {
  email: string;
  code: string;
  password: string;
}): Promise<ConfirmForgotPasswordCommandOutput> {
  try {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: env.cognitoClientId,
      Username: input.email,
      ConfirmationCode: input.code,
      Password: input.password,
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    rethrowCognitoError(error);
  }
}

export async function changePassword(input: {
  accessToken: string;
  previousPassword: string;
  proposedPassword: string;
}) {
  try {
    const command = new ChangePasswordCommand({
      AccessToken: input.accessToken,
      PreviousPassword: input.previousPassword,
      ProposedPassword: input.proposedPassword,
    });
    return await cognitoClient.send(command);
  } catch (error) {
    rethrowCognitoError(error);
  }
}
