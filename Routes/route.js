const express = require('express')
const router = express.Router()

var Controller = require('../Controller/controller')

router.get('/read', Controller.ReadDataController)
router.post('/write', Controller.WriteDataController)
router.delete('/delete/:id', Controller.DeleteDataController)
router.put('/update/:id', Controller.UpdateDataController)

module.exports = {
  Router: router,
}
