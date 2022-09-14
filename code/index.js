const AWS = require('aws-sdk');
const { buildResponse } = require('/opt/http-builder');


module.exports.getProducts = async (event, context) => {
    try {
        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: 'Products'
        };
        const result = await dynamoDb.scan(params).promise();
        return buildResponse(200, result["Items"]);
    } catch (error) {
        console.log(error);
        return buildResponse(500, error.message);
    }
}
// END

module.exports.upsertProduct = async (event, context) => {
    try {
        const { v4: uuidv4 } = require('uuid');
        const body = JSON.parse(event["body"]);
        const id = body.product_id || uuidv4();
        const updated_at = Date.now();
        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: 'Products',
            Key: {
                product_id: id
            },
            UpdateExpression: 'set #name = :name, #price = :price, #updated_at = :updated_at',
            ExpressionAttributeNames: {
                '#name': 'name',
                '#price': 'price',
                '#updated_at': 'updated_at'
            },
            ExpressionAttributeValues: {
                ':name': body.name,
                ':price': body.price,
                ':updated_at': updated_at
            }
        };

        const result = await dynamoDb.update(params).promise();
        return buildResponse(200, result);
    } catch (error) {
        console.log(error);
        return buildResponse(500, error.message);
    };
}
// END

module.exports.deleteProduct = async (event, context) => {
    try {
        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: 'Products',
            Key: {
                product_id: event.pathParameters.product_id
            },
            ReturnValues: 'ALL_OLD'
        };
        const result = await dynamoDb.delete(params).promise();
        return buildResponse(200, result);
    } catch (error) {
        console.log(error);
        return buildResponse(500, error.message);
    }
}
    // END