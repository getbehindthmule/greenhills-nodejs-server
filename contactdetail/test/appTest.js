/*jslint node: true */
'use strict';
const AWS = require('aws-sdk-mock');
const chai = require('chai');
const should = chai.should();
const describe = require("mocha").describe;
const before = require("mocha").before;
const after = require("mocha").after;
const it = require('mocha').it;
const app = require('../app');
const event = {
    "resource": "/details/{contact_id}",
    "path": "/details/1",
    "httpMethod": "GET",
    "headers": null,
    "multiValueHeaders": null,
    "queryStringParameters": null,
    "multiValueQueryStringParameters": null,
    "pathParameters": {
        "contact_id": "1"
    },
    "stageVariables": null,
    "requestContext": {
        "resourceId": "r4tuew",
        "resourcePath": "/details/{contact_id}",
        "httpMethod": "GET",
        "extendedRequestId": "JpDUOHIajoEFROw=",
        "requestTime": "19/Mar/2020:14:18:54 +0000",
        "path": "/details/{contact_id}",
        "accountId": "382959638855",
        "protocol": "HTTP/1.1",
        "stage": "test-invoke-stage",
        "domainPrefix": "testPrefix",
        "requestTimeEpoch": 1584627534113,
        "requestId": "9fd7d6fe-99eb-4fd4-8a23-09f14d1d45af",
        "identity": {
            "cognitoIdentityPoolId": null,
            "cognitoIdentityId": null,
            "apiKey": "test-invoke-api-key",
            "principalOrgId": null,
            "cognitoAuthenticationType": null,
            "userArn": "arn:aws:iam::382959638855:user/getbehindthmule",
            "apiKeyId": "test-invoke-api-key-id",
            "userAgent": "aws-internal/3 aws-sdk-java/1.11.719 Linux/4.9.184-0.1.ac.235.83.329.metal1.x86_64 OpenJDK_64-Bit_Server_VM/25.242-b08 java/1.8.0_242 vendor/Oracle_Corporation",
            "accountId": "382959638855",
            "caller": "AIDAVSKRMLFDZFUZHLLXX",
            "sourceIp": "test-invoke-source-ip",
            "accessKey": "ASIAVSKRMLFD4VHTEWXA",
            "cognitoAuthenticationProvider": null,
            "user": "AIDAVSKRMLFDZFUZHLLXX"
        },
        "domainName": "testPrefix.testDomainName",
        "apiId": "by4pc0wbrg"
    },
    "body": null,
    "isBase64Encoded": false
};

describe('main lambda handler tests', function () {

    before('set up mocks', function () {
        AWS.mock('DynamoDB', 'getItem', function (params, callback) {
            callback(null, { id: 1, phone: '074 1500 1600', email: 'gerardsavage@me.com'});
        })

    });

    after('remove mocks', function () {
        AWS.restore('DynamoDB');
    });

    it('response body should return an object with id, phone and email properties', async function () {
        // arrange
        let context;

        // act
        const result = await app.lambdaHandler(event, context);

        // assert
        let responseBody = JSON.parse(result.body);
        responseBody.should.have.property('id');
        responseBody.should.have.property('phone');
        responseBody.should.have.property('email');

    });

    it('verify successful response', async function () {
        // arrange
        let context;
        const expectedPhoneNumber = '074 1500 1600';
        const expectedEmail = 'gerardsavage@me.com';
        const expectedBody = {id: 1,phone: expectedPhoneNumber,email: expectedEmail};

        // act
        const  result = await app.lambdaHandler(event, context);

        // assert
        let responseBody = JSON.parse(result.body);
        result.statusCode.should.equal(200);
        responseBody.should.deep.equal(expectedBody);

    });

});