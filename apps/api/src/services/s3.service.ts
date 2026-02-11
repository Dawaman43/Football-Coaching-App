import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3Client } from "../lib/aws";
import { env } from "../config/env";

export async function getPresignedUploadUrl(input: { key: string; contentType: string }) {
  const command = new PutObjectCommand({
    Bucket: env.s3Bucket,
    Key: input.key,
    ContentType: input.contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 900 });
  return url;
}
