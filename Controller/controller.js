var Services = require('../Service/service')

const ReadDataController = (req, res) => {
  Services.ReadDataService(req, (err, results) => {
    if (err) {
      res.json({status_code: 400, message: err})
    } else {
      res.json({
        status_code: 200,
        message: 'Success',
        result: results.body.Data,
      })
    }
  })
}

const WriteDataController = (req, res) => {
  Services.WriteDataService(req.body, (err, results) => {
    if (err) {
      res.json({status_code: err.statusCode, message: err.body})
    } else {
      res.json({
        status_code: 200,
        message: 'Success',
        result: results.body,
      })
    }
  })
}

const DeleteDataController = (req, res) => {
  Services.DeleteDataService(req.params, (err, results) => {
    if (err) {
      res.json({status_code: err.statusCode, message: err.body})
    } else {
      res.json({
        status_code: 200,
        message: 'Success',
        result: results.body,
      })
    }
  })
}

const UpdateDataController = (req, res) => {
  Services.UpdateDataService(req, (err, results) => {
    if (err) {
      res.json({status_code: err.statusCode, message: err.body})
    } else {
      res.json({
        status_code: 200,
        message: 'Success',
        result: results.body,
      })
    }
  })
}

module.exports = {
  ReadDataController: ReadDataController,
  WriteDataController: WriteDataController,
  DeleteDataController: DeleteDataController,
  UpdateDataController: UpdateDataController,
}
