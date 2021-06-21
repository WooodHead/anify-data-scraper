import { Lambda } from "@aws-sdk/client-lambda";

require("dotenv").config();

const sendToLambda = async (input: any) => {
  // if no input (404), just return
  if (!input.id) {
    console.log(`🔵 [SKIPPED] - No Lambda input provided, skipping item...`);
    return;
  }

  // check for required variables
  if (!process.env.AWS_ACCESS_KEY)
    throw new Error("AWS_ACCESS_KEY not provided");
  if (!process.env.AWS_SECRET_ACCESS_KEY)
    throw new Error("AWS_SECRET_ACCESS_KEY not provided");
  if (!process.env.LAMBDA_FUNCTION_NAME)
    throw new Error("LAMBDA_FUNCTION_NAME not provided");

  console.log(
    `🟡 [IN PROGRESS] - Sending input to Lambda: ${JSON.stringify(input)}`
  );

  // send to input to Lambda
  const client = new Lambda({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const response = await client.invoke({
    FunctionName: process.env.LAMBDA_FUNCTION_NAME,
    Payload: new TextEncoder().encode(JSON.stringify(input)),
  });

  console.log(`🟢 [SUCCESS] - Sent ${input.id} to Lambda`);

  return response;
};

module.exports = sendToLambda;
