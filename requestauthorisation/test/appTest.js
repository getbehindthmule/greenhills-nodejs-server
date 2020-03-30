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
    "methodArn": "methodArn",
    "resource": "/details/{contact_id}",
    "path": "/details/1",
    "httpMethod": "GET",
    "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-GB,en;q=0.5",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-Country": "GB",
        "Host": "by4pc0wbrg.execute-api.eu-west-1.amazonaws.com",
        "origin": "http://localhost:3000",
        "Referer": "http://localhost:3000/contact-us",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:74.0) Gecko/20100101 Firefox/74.0",
        "Via": "2.0 a0109015e151889f438bfafccc3d5bea.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "CkANY2PHPSOUBVMBZO2Y3uAzMPhy3ZuhnJ5L2yVgmXu0acMhe1QLdQ==",
        "X-Amzn-Trace-Id": "Root=1-5e7cdf24-bb8f00dae437342494bbeb4b",
        "X-Forwarded-For": "81.96.141.44, 130.176.99.90",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
    },
    "multiValueHeaders": {
        "Accept": [
            "*/*"
        ],
        "Accept-Encoding": [
            "gzip, deflate, br"
        ],
        "Accept-Language": [
            "en-GB,en;q=0.5"
        ],
        "CloudFront-Forwarded-Proto": [
            "https"
        ],
        "CloudFront-Is-Desktop-Viewer": [
            "true"
        ],
        "CloudFront-Is-Mobile-Viewer": [
            "false"
        ],
        "CloudFront-Is-SmartTV-Viewer": [
            "false"
        ],
        "CloudFront-Is-Tablet-Viewer": [
            "false"
        ],
        "CloudFront-Viewer-Country": [
            "GB"
        ],
        "Host": [
            "by4pc0wbrg.execute-api.eu-west-1.amazonaws.com"
        ],
        "origin": [
            "http://localhost:3000"
        ],
        "Referer": [
            "http://localhost:3000/contact-us"
        ],
        "User-Agent": [
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:74.0) Gecko/20100101 Firefox/74.0"
        ],
        "Via": [
            "2.0 a0109015e151889f438bfafccc3d5bea.cloudfront.net (CloudFront)"
        ],
        "X-Amz-Cf-Id": [
            "CkANY2PHPSOUBVMBZO2Y3uAzMPhy3ZuhnJ5L2yVgmXu0acMhe1QLdQ=="
        ],
        "X-Amzn-Trace-Id": [
            "Root=1-5e7cdf24-bb8f00dae437342494bbeb4b"
        ],
        "X-Forwarded-For": [
            "81.96.141.44, 130.176.99.90"
        ],
        "X-Forwarded-Port": [
            "443"
        ],
        "X-Forwarded-Proto": [
            "https"
        ]
    },
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

describe('main authorization handler tests', function() {

    before('set up mocks', function () {
        AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
            callback(null, { Item: {authorization: '["http://localhost:3000", "https://www.greenhillsconsultancy.co.uk"]'} });
        });
    });

    after('remove mocks', function () {
        AWS.restore('DynamoDB');
    });

    it('response body should return allow access when valid origin specified', async function () {
        // arrange
        let context;
        event.headers.origin = 'http://localhost:3000';

        // act
        const result = await app.lambdaHandler(event, context);

        // assert
        result.policyDocument.Statement[0].Action.should.equal('execute-api:Invoke');
        result.policyDocument.Statement[0].Effect.should.equal('Allow');
        result.policyDocument.Statement[0].Resource.should.equal('methodArn');

    });

    it('response body should return deny access when invalid origin specified', async function () {
        // arrange
        let context;
        event.headers.origin = 'https://google.com';

        // act
        const result = await app.lambdaHandler(event, context);

        // assert
        result.policyDocument.Statement[0].Action.should.equal('execute-api:Invoke');
        result.policyDocument.Statement[0].Effect.should.equal('Deny');
        result.policyDocument.Statement[0].Resource.should.equal('methodArn');

    });
});