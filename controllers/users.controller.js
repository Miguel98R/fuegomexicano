let usersModel = require('../models/users.model')


let apiato = require('apiato')
let ms = new apiato()
const {encrypt} = require('../helpers/handleBcrypt')
const {datatable_aggregate} = require("../helpers/dt_aggregate.helper");

//APIATO CONFIGURE
let validationObject = {}
let populationObject = false
let options = {}

let aggregate_pipeline = []


module.exports = {
    createAdmin: async (req, res) => {
        let body = req.body


        try {

            // Buscar si ya existe un usuario con el mismo correo electrónico o nombre de usuario
            let searchUser = await usersModel.findOne({$or: [{email: body.email}, {user_name: body.user_name}]});

            if (searchUser) {
                res.status(403).json({
                    success: false,
                    message: 'El usuario ya existe'
                })
                return
            }

            let passwordHash = await encrypt(body.password)

            let newUser = new usersModel({
                name: body.name,
                user_name: body.user_name,
                email: body.email,
                password: passwordHash,
                usersTypes: 'admin'

            })
            await newUser.save()
            res.status(200).json({
                success: true,
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                success: false,
                error: e

            })
        }
    },
    createUsers: async (req, res) => {
        let body = req.body


        try {

            // Buscar si ya existe un usuario con el mismo correo electrónico o nombre de usuario
            let searchUser = await usersModel.findOne({$or: [{email: body.email}, {user_name: body.user_name}]});

            if (searchUser) {
                res.status(403).json({
                    success: false,
                    message: 'El usuario ya existe'
                })
                return
            }

            let passwordHash = await encrypt(body.password)

            let newUser = new usersModel({
                name: body.name,
                user_name: body.user_name,
                email: body.email,
                password: passwordHash,
                usersTypes: body.usersTypes

            })
            await newUser.save()
            res.status(200).json({
                success: true,
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                success: false,
                error: e

            })
        }
    },
    datatable_aggregate: async (req, res) => {


        try {

            let dataUsers = await usersModel.find().select('user_name email name usersTypes active')
            res.status(200).json({
                success: true,
                data: dataUsers
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                success: false,
                error: e
            })
        }
    },
    createMany: ms.createMany(usersModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(usersModel, populationObject, options),
    getOneById: ms.getOneById(usersModel, populationObject, options),
    getMany: ms.getMany(usersModel, populationObject, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(usersModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(usersModel, validationObject, populationObject, options),
    updateById: ms.updateById(usersModel, validationObject, populationObject, options),

    findIdAndDelete: ms.findIdAndDelete(usersModel, options),


    aggregate: ms.aggregate(usersModel, aggregate_pipeline, options),

}
