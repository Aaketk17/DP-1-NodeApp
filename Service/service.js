const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'})
const {DateTime} = require('luxon')

const ReadDataService = async (data, callback) => {
  console.log('\n\n', 'Table Name: ', process.env.TABLE)
  let dbData = []

  let params = {
    TableName: process.env.TABLE,
  }

  let results

  try {
    do {
      results = await documentClient.scan(params).promise()
      console.log('Results from Scan :-', results)

      results.Items.forEach((value) => dbData.push(value))
      params.ExclusiveStartKey = results.LastEvaluatedKey
    } while (typeof results.LastEvaluatedKey !== 'undefined')

    console.log('All data from DB', dbData)

    const response = {
      statusCode: 200,
      body: {
        Message: 'Data received from DynamoDB',
        TotalDataCount: dbData.length,
        Data: dbData,
      },
    }

    callback(null, response)
  } catch (error) {
    console.log('Error in reading data from DB ', error)
    const response = {
      statusCode: 500,
      body: {
        Message: 'Error in reading data from DB',
        Error: error,
      },
    }
    callback(response, null)
  }
}

const WriteDataService = async (data, callback) => {
  // const receivedPayload = JSON.parse(data)
  console.log(
    '\n\n',
    'Received Payload: ',
    data,
    '\n\n',
    'Table Name: ',
    process.env.TABLE
  )
  if (data === undefined || data === null) {
    const response = {
      statusCode: 500,
      body: {
        message: 'No data provided to write to database',
      },
    }
    callback(response, null)
  }

  try {
    const params = {
      TableName: process.env.TABLE,
      Item: {
        id: `${DateTime.now().valueOf()}-${data.name}`,
        ...data,
      },
    }
    console.log('DB params :', params)
    documentClient.put(params, (error, data) => {
      if (error) {
        console.log('Error in writing data to DB: ', error)
        const response = {
          statusCode: 500,
          body: {
            Message: 'Error in writing data to DB',
            Error: error,
          },
        }
        callback(response, null)
      }
      console.log('Data successfully written to DB: ', data)
      const response = {
        statusCode: 200,
        body: {
          Message: 'Data successfully written to DB',
          Data: data,
        },
      }
      callback(null, response)
    })
  } catch (error) {
    console.log('Error in Writing to DB :(', error)
    const response = {
      statusCode: 500,
      body: {
        message: 'Error in Writing to DB :(',
        error: error,
      },
    }
    callback(response, null)
  }
}

const DeleteDataService = async (data, callback) => {
  console.log(
    '\n\n',
    'Received Payload:',
    data.id,
    '\n\n',
    'Table Name:',
    process.env.TABLE
  )
  try {
    const params = {
      TableName: process.env.TABLE,
      Key: {
        id: data.id,
      },
    }
    await documentClient.delete(params, (error, val) => {
      if (error) {
        console.error('Error deleting item:', error)
        const response = {
          statusCode: 500,
          body: {
            Message: 'Error in deleting given data from DB',
            Error: error,
          },
        }
        callback(response, null)
      } else {
        const response = {
          statusCode: 200,
          body: {
            Message: `Data with Id ${data.id} successfully deleted`,
            Data: val,
          },
        }
        console.log('Deletion Success :-', val)
        callback(null, response)
      }
    })
  } catch (error) {
    console.log('Error in deleting given data from DB ', error)
    const response = {
      statusCode: 500,
      body: {
        Message: 'Error in deleting given data from DB',
        Error: error,
      },
    }
    callback(response, null)
  }
}

const UpdateDataService = async (data, callback) => {
  const receivedPayload = data.body
  const updateId = data.params.id

  console.log(
    '\n\n',
    'Received Payload: ',
    receivedPayload,
    '\n\n',
    'Table Name: ',
    process.env.TABLE
  )
  if (receivedPayload === null) {
    const response = {
      statusCode: 404,
      body: {
        Message: `Updating Data with Id ${data.id} is missing parameters`,
      },
    }
    callback(response, null)
  }
  try {
    const params = {
      TableName: process.env.TABLE,
      Key: {
        id: updateId,
      },
      UpdateExpression:
        'set #name = :name, #age = :age, #city = :city, #gender = :gender',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#age': 'age',
        '#city': 'city',
        '#gender': 'gender',
      },
      ExpressionAttributeValues: {
        ':name': receivedPayload.name,
        ':age': receivedPayload.age,
        ':city': receivedPayload.city,
        ':gender': receivedPayload.gender,
      },
      ReturnValues: 'UPDATED_NEW',
    }
    const updatedResults = await documentClient.update(params).promise()
    const response = {
      statusCode: 200,
      body: {
        Message: `Data with Id ${updateId} successfully Updated with the new given values`,
        Results: updatedResults,
      },
    }
    console.log('Updated Results :-', updatedResults)
    callback(null, response)
  } catch (error) {
    console.log('Error in updating given data ', error)
    const response = {
      statusCode: 500,
      body: {
        Message: 'Error in updating given data',
        Error: error,
      },
    }
    callback(response, null)
  }
}

module.exports = {
  ReadDataService: ReadDataService,
  WriteDataService: WriteDataService,
  DeleteDataService: DeleteDataService,
  UpdateDataService: UpdateDataService,
}
