const express = require('express')
const router = express.Router()

let salesController = require('../controllers/sales.controller')


router.post('/createSaleTransfer', salesController.createSaleTransfer)
router.post('/datatable_aggregate', salesController.datatable_aggregate)
router.put('/updateById/:id', salesController.updateById)
router.delete('/findIdAndDelete/:id', salesController.findIdAndDelete)
router.get('/getOneById/:id', salesController.getOneById)
router.get('/getMany', salesController.getMany)

router.post('/createMany', salesController.createMany)
router.post('/aggregate', salesController.aggregate)

router.get('/getOneWhere/one', salesController.getOneWhere)


router.put('/findUpdateOrCreate', salesController.findUpdateOrCreate)
router.put('/findUpdate', salesController.findUpdate)


module.exports = router
