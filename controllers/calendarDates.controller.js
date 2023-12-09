let ms = require('../helpers/apiato.helper')

let calendarModel = require('../models/calendarDates.model')
let agendaModel = require('../models/datesAgenda.model')


//APIATO CONFIGURE
let validationObject = {}
let populationObject = false
let options = {}
let aggregate_pipeline_dt = []
let aggregate_pipeline = []


module.exports = {
    createOne: ms.createOne(calendarModel, validationObject, populationObject, options),
    createMany: ms.createMany(calendarModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(calendarModel, populationObject, options),
    getOneById: ms.getOneById(calendarModel, populationObject, options),
    getMany: async (req, res) => {
        try {
            const result = await calendarModel.aggregate([

                {
                    $lookup: {
                        from: agendaModel.collection.name,
                        localField: 'events',
                        foreignField: '_id',
                        as: 'events',
                    },
                },

            ]);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (e) {
            res.status(500).json({
                success: false,
                error: e.message,
            });
            console.error(e);
        }
    },
    getManyActives: async (req, res) => {
        try {
            const result = await calendarModel.aggregate([
                {
                    $match: {
                        active: true
                    }
                },

                {
                    $lookup: {
                        from: agendaModel.collection.name,
                        localField: 'events',
                        foreignField: '_id',
                        as: 'events',
                    },
                },

            ]);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (e) {
            res.status(500).json({
                success: false,
                error: e.message,
            });
            console.error(e);
        }
    },

    findUpdateOrCreate: ms.findUpdateOrCreate(calendarModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(calendarModel, validationObject, populationObject, options),
    updateById: ms.updateById(calendarModel, validationObject, populationObject, options),

    findIdAndDelete: ms.findIdAndDelete(calendarModel, options),

    datatable_aggregate: ms.datatable_aggregate(calendarModel, aggregate_pipeline_dt, ''),
    aggregate: ms.aggregate(calendarModel, aggregate_pipeline, options),
    createMonths: async (req, res) => {
        try {

            let months = [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre',
            ];

            let events = []
            let active = false


            for (let item of months) {
                await calendarModel.create({
                    mes: item,
                    events,
                    active
                })
            }
            res.status(200).json({
                success: true
            })
        } catch (e) {
            res.status(500).json({
                success: false
            })
            console.error(e)
        }
    }
}
