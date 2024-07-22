const express = require('express')
const router = express.Router()

let suscriptionsController = require('../controllers/suscription.controller')


router.post('/createSuscription', suscriptionsController.createSuscription)

router.post('/datatable_aggregate', suscriptionsController.datatable_aggregate)
router.post('/sendNotification', suscriptionsController.sendNotification)
router.put('/updateById/:id', suscriptionsController.updateById)
router.put('/updatePayementTransfer/:id', suscriptionsController.updatePayementTransfer)
router.put('/updateStatusSendSale/:id', suscriptionsController.updateStatusSendSale)
router.put('/upateSaleToHistoricStatus/:id', suscriptionsController.upateSaleToHistoricStatus)
router.put('/upateSendToSaleStatus/:id', suscriptionsController.upateSendToSaleStatus)
router.delete('/findIdAndDelete/:id', suscriptionsController.findIdAndDelete)
router.get('/getOneById/:id', suscriptionsController.getOneById)
router.get('/getDetailsSale/:id', suscriptionsController.getDetailsSale)
router.get('/getMany', suscriptionsController.getMany)


router.post('/createMany', suscriptionsController.createMany)
router.post('/aggregate', suscriptionsController.aggregate)
router.get('/getOneWhere/one', suscriptionsController.getOneWhere)
router.put('/findUpdateOrCreate', suscriptionsController.findUpdateOrCreate)
router.put('/findUpdate', suscriptionsController.findUpdate)


module.exports = router
