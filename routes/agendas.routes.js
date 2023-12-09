const express = require('express')
const router = express.Router()

let calendarController = require('../controllers/calendarDates.controller')


router.post('/createOne', calendarController.createOne)
router.post('/datatable_aggregate', calendarController.datatable_aggregate)
router.put('/updateById/:id', calendarController.updateById)
router.delete('/findIdAndDelete/:id', calendarController.findIdAndDelete)
router.get('/getOneById/:id', calendarController.getOneById)
router.get('/getMany', calendarController.getMany)
router.get('/getManyActives', calendarController.getManyActives)

router.post('/createMany', calendarController.createMany)
router.post('/aggregate', calendarController.aggregate)

router.get('/getOneWhere/one', calendarController.getOneWhere)


router.put('/findUpdateOrCreate', calendarController.findUpdateOrCreate)
router.put('/findUpdate', calendarController.findUpdate)
router.get('/createMonths', calendarController.createMonths)


module.exports = router
