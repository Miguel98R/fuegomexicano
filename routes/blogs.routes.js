const express = require('express')
const router = express.Router()

let blogsController = require('../controllers/blogs.controller')


router.post('/createOne', blogsController.createOne)
router.post('/datatable_aggregate', blogsController.datatable_aggregate)
router.put('/updateById/:id', blogsController.updateById)
router.delete('/findIdAndDelete/:id', blogsController.findIdAndDelete)
router.get('/getOneById/:id', blogsController.getOneById)
router.get('/getMany', blogsController.getMany)

router.post('/createMany', blogsController.createMany)
router.post('/aggregate', blogsController.aggregate)

router.get('/getOneWhere/one', blogsController.getOneWhere)


router.put('/findUpdateOrCreate', blogsController.findUpdateOrCreate)
router.put('/findUpdate', blogsController.findUpdate)


module.exports = router
