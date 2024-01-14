const express = require('express')
const router = express.Router()

let congresosController = require('../controllers/congresos.controller')


router.post('/createOne', congresosController.createOne)
router.post('/datatable_aggregate', congresosController.datatable_aggregate)
router.put('/updateById/:id', congresosController.updateById)
router.delete('/findIdAndDelete/:id', congresosController.findIdAndDelete)
router.get('/getOneById/:id', congresosController.getOneById)
router.get('/getMany', congresosController.getMany)

router.post('/createMany', congresosController.createMany)
router.post('/aggregate', congresosController.aggregate)

router.get('/getOneWhere/one', congresosController.getOneWhere)


router.put('/findUpdateOrCreate', congresosController.findUpdateOrCreate)
router.put('/findUpdate', congresosController.findUpdate)


module.exports = router
