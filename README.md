# Greenhills Server in Nodejs

This project contains an alternative greenhills serverless application, similar to greenhills-server, but omplemented in nodejs.

The application uses several AWS resources, including Lambda functions, DynamosDB and an API Gateway API . These resources are defined in the `template.yaml` file in this project. 
You can update the template to add AWS resources through the same deployment process that updates your application code.

The integrated development environment (IDE) can be used to build and test the application using the AWS Toolkit, but this is a stepping stone to understanding the SAM cli deployment 
options.
The AWS Toolkit is an open source plug-in for popular IDEs that uses the SAM CLI to build and deploy serverless applications on AWS. The AWS Toolkit also adds a simplified step-through 
debugging experience for Lambda function code. See the following link to get started.

* [IntelliJ](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)

## Deploy the sample application

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Java8 - [Install the Java SE Development Kit 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

To fully control the  build and deployment of the application, run the following, with the obvious changes to
directory structures, etc:

```bash
TBD
```
##Local development

**Invoking function locally through local DynamoDB**
1. Start DynamoDB Local in a Docker container. 
 `docker run -p 8000:8000 amazon/dynamodb-local`
2. Create the DynamoDB table. 
 `aws dynamodb create-table --table-name greenhills-contacts --attribute-definitions AttributeName=id,AttributeType=N AttributeName=phone,AttributeType=S, 
 AttributeName=email,AttributeType=S --key-schema AttributeName=id, KeyType=HASH --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000`
3. Start the SAM local API on a Mac: 
 `sam local start-api --env-vars contactdetail/test/resources/test_environment_mac.json`


