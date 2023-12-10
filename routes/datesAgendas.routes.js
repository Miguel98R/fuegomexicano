const express = require('express')
const router = express.Router()

let datesAgendaController = require('../controllers/datesAgenda.controller')


router.post('/createOne', datesAgendaController.createOne)
router.post('/datatable_aggregate', datesAgendaController.datatable_aggregate)
router.put('/updateById/:id', datesAgendaController.updateById)
router.delete('/findIdAndDelete/:id', datesAgendaController.findIdAndDelete)
router.get('/getOneById/:id', datesAgendaController.getOneById)
router.get('/getMany', datesAgendaController.getMany)

router.post('/createMany', datesAgendaController.createMany)
router.post('/aggregate', datesAgendaController.aggregate)

router.get('/getOneWhere/one', datesAgendaController.getOneWhere)


router.put('/findUpdateOrCreate', datesAgendaController.findUpdateOrCreate)
router.put('/findUpdate', datesAgendaController.findUpdate)


module.exports = router
