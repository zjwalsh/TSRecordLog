// AWS Lambda function to fetch recording logs from DynamoDB
// Deploy this function and connect it to API Gateway GET /api/

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || 'RecordingLogs';

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    try {
        // Extract query parameters
        const startDate = event.queryStringParameters?.startDate;
        const endDate = event.queryStringParameters?.endDate;

        if (!startDate || !endDate) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
                },
                body: JSON.stringify({ error: 'Start and end dates are required' })
            };
        }

        // Convert dates to ISO format for comparison
        const startDateTime = new Date(startDate).toISOString();
        const endDateTime = new Date(endDate + 'T23:59:59').toISOString();

        console.log(`Fetching logs from ${startDateTime} to ${endDateTime}`);

        // Option 1: Use Scan with filter (for small tables or no GSI)
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: 'CreatedOn BETWEEN :start AND :end',
            ExpressionAttributeValues: {
                ':start': startDateTime,
                ':end': endDateTime
            }
        };

        const command = new ScanCommand(params);
        const result = await docClient.send(command);

        // Option 2: If you have a GSI on CreatedOn, use Query instead (more efficient)
        /*
        const params = {
            TableName: TABLE_NAME,
            IndexName: 'CreatedOnIndex',
            KeyConditionExpression: 'CreatedOn BETWEEN :start AND :end',
            ExpressionAttributeValues: {
                ':start': startDateTime,
                ':end': endDateTime
            }
        };
        const command = new QueryCommand(params);
        const result = await docClient.send(command);
        */

        console.log(`Found ${result.Items?.length || 0} items`);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: JSON.stringify(result.Items || [])
        };

    } catch (error) {
        console.error('Error fetching recording logs:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: JSON.stringify({
                error: 'Failed to fetch recording logs',
                message: error.message
            })
        };
    }
};
