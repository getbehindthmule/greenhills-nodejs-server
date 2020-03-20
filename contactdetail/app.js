/*jslint node: true */
'use strict';

const AWS = require('aws-sdk');

exports.lambdaHandler = async (event, context) => {
    console.log(`Event: ${JSON.stringify(event)}`);
    const contactId = parseInt(event.pathParameters.contact_id, 10);

    try {
        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: process.env.TABLE_NAME,
            Key: { "id": contactId }
        };

        let  response;
        try {
            response = await dynamoDb.get(params).promise();
            console.log(`response data: ${JSON.stringify(response)}`);
            if (typeof response.Item === 'undefined') {
                return {
                    'statusCode': 404,
                    'body': JSON.stringify({
                        id: contactId,
                        error: 'element not found'
                    })
                };
            }
            return {
                'statusCode': 200,
                'body': JSON.stringify({
                    id: response.Item.id,
                    phone: response.Item.phone,
                    email: response.Item.email
                })
            };

        } catch (err) {
            console.log(`catching err from dynamoDb get ${err}`);
            return {
                'statusCode': 500,
                'body': JSON.stringify({
                    error: err
                })
            };
        }

    } catch (err) {
        console.log(err);
        return err;
    }
    console.log('unexpected termination');
    return {
        'statusCode': 500,
        'body': JSON.stringify({})
    };
};
