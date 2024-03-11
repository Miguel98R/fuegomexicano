const express = require('express')
const router = express.Router()

let invitationsController = require('../controllers/invitaciones.controller')



router.post('/createOne', invitationsController.createOne)
router.post('/create_invitation', invitationsController.create_invitation)
router.post('/datatable_aggregate', invitationsController.datatable_aggregate)
router.put('/updateById/:id', invitationsController.updateById)
router.delete('/findIdAndDelete/:id', invitationsController.findIdAndDelete)
router.get('/getOneById/:id', invitationsController.getOneById)
router.get('/getMany', invitationsController.getMany)

router.post('/createMany', invitationsController.createMany)
router.post('/aggregate', invitationsController.aggregate)

router.get('/getOneWhere/one', invitationsController.getOneWhere)


router.put('/findUpdateOrCreate', invitationsController.findUpdateOrCreate)
router.put('/findUpdate', invitationsController.findUpdate)





module.exports = router
