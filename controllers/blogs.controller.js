let ms = require('../helpers/apiato.helper')
let blogsModel = require('../models/blogs.model')



//APIATO CONFIGURE
let validationObject = {}
let populationObject = false
let options = {}
let aggregate_pipeline_dt = []
let aggregate_pipeline = []


module.exports = {
    createOne: ms.createOne(blogsModel, validationObject, populationObject, options),
    createMany: ms.createMany(blogsModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(blogsModel, populationObject, options),
    getOneById: ms.getOneById(blogsModel, populationObject, options),
    getMany: async (req, res) => {


        try {

            let dataB = await blogsModel.find({ isPublicate: true });

            res.status(200).json({
                success: true,
                data: dataB
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                success: false,
                error: e
            })
        }
    },

    findUpdateOrCreate: ms.findUpdateOrCreate(blogsModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(blogsModel, validationObject, populationObject, options),
    updateById: ms.updateById(blogsModel, validationObject, populationObject, options),

    findIdAndDelete: ms.findIdAndDelete(blogsModel, options),

    datatable_aggregate: async (req, res) => {


        try {

            let dataB = await blogsModel.find()
            res.status(200).json({
                success: true,
                data: dataB
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                success: false,
                error: e
            })
        }
    }, aggregate: ms.aggregate(blogsModel, aggregate_pipeline, options),
}
