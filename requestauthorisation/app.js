/*jslint node: true */
'use strict';

const AWS = require('aws-sdk');

exports.lambdaHandler = async (event, context) => {
    console.log(`Authorization, Event: ${JSON.stringify(event)}`);
    const origin = event.headers.Origin;
    console.log(`origin is ${origin}`);
    const methodArn = event.methodArn;

    try {
        const methodArn = event.methodArn;
        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: process.env.AUTHORIZATION_TABLE_NAME,
            Key: { "id": 1 }
        };
        const response = await dynamoDb.get(params).promise();
        console.log(`response data: ${JSON.stringify(response)}`);
        if (typeof response.Item === 'undefined') {
            console.log('undefined Item retrieved from DynamoDB');
            return generateAuthResponse('user', 'Deny', methodArn);
        }

        const authorizedList = JSON.parse(response.Item.authorization);
        console.log(`authorized list is ${authorizedList}`);
        const found = authorizedList.find(element => element === origin);
        if (found === undefined) {
            console.log('could not find the origin in the authorized list');
            return generateAuthResponse('user', 'Deny', methodArn);
        }
        return generateAuthResponse('user', 'Allow', methodArn);
    } catch (err) {
        console.log(`catching err from dynamoDb get ${err}`);
        return generateAuthResponse('user', 'Deny', methodArn);
    }
};

function generateAuthResponse (principalId, effect, methodArn) {
    // If you need to provide additional information to your integration
    // endpoint (e.g. your Lambda Function), you can add it to `context`
    const context = {  } ;

    const policyDocument = generatePolicyDocument(effect, methodArn);

    return {
        principalId,
        context,
        policyDocument
    };
}

function generatePolicyDocument (effect, methodArn) {
    if (!effect || !methodArn) return null;

    const policyDocument = {
        Version: '2012-10-17',
        Statement: [{
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: methodArn
        }]
    };

    return policyDocument;
}