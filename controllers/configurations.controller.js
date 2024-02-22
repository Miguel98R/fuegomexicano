let ms = require('../helpers/apiato.helper')
let configurationsModel = require('../models/configurations.model')


//APIATO CONFIGURE
let validationObject = {}
let populationObject = false
let options = {}
let aggregate_pipeline_dt = []
let aggregate_pipeline = []


module.exports = {
    createOrUpdateConf: async (req, res) => {
        let body = req.body
        try {

            let searchConf = await configurationsModel.findOne({description: body.description})

            if (!searchConf) {
                await configurationsModel.create(body)
            } else {
                searchConf.value = body.value
                await searchConf.save()
            }

            res.status(200).json({
                success: true,

            })
        } catch (e) {
            res.status(500).json({
                success: false,
                error: e
            })
        }
    },
    createOne: ms.createOne(configurationsModel, validationObject, populationObject, options),
    createMany: ms.createMany(configurationsModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(configurationsModel, populationObject, options),
    getOneById: ms.getOneById(configurationsModel, populationObject, options),
    getMany: ms.getMany(configurationsModel, populationObject, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(configurationsModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(configurationsModel, validationObject, populationObject, options),
    updateById: ms.updateById(configurationsModel, validationObject, populationObject, options),

    findIdAndDelete: ms.findIdAndDelete(configurationsModel, options),

    datatable_aggregate: ms.datatable_aggregate(configurationsModel, aggregate_pipeline_dt, ''),
    aggregate: ms.aggregate(configurationsModel, aggregate_pipeline, options),
}
