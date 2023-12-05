let ms = require('../helpers/apiato.helper')

let invitacionesModel = require('../models/invitaciones.model')



//APIATO CONFIGURE
let validationObject = {}
let populationObject = false
let options = {}
let aggregate_pipeline_dt = []
let aggregate_pipeline = []


module.exports = {
    createOne: ms.createOne(invitacionesModel, validationObject, populationObject, options),
    createMany: ms.createMany(invitacionesModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(invitacionesModel, populationObject, options),
    getOneById: ms.getOneById(invitacionesModel, populationObject, options),
    getMany: ms.getMany(invitacionesModel, populationObject, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(invitacionesModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(invitacionesModel, validationObject, populationObject, options),
    updateById: ms.updateById(invitacionesModel, validationObject, populationObject, options),

    findIdAndDelete: ms.findIdAndDelete(invitacionesModel, options),
    datatable_aggregate: async (req, res) => {


        try {

            let dataI = await invitacionesModel.find()
            res.status(200).json({
                success: true,
                data: dataI
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                success: false,
                error: e
            })
        }
    },

    aggregate: ms.aggregate(invitacionesModel, aggregate_pipeline, options),
}
