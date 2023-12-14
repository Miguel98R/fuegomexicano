let ms = require('../helpers/apiato.helper')
let salesModel = require('../models/sales.model')
let salesDetailsModel = require('../models/salesDetails.model')
let usersModel = require('../models/users.model')
let usersAddresModel = require('../models/userAddress.model')
let usersShoppingModel = require('../models/userShipping.model')
let productModel = require('../models/products.model')

const {sendMail, template} = require('./../helpers/mail.helper')
const mongoose = require("mongoose");

//APIATO CONFIGURE
let validationObject = {}
let populationObject = false
let options = {}
let aggregate_pipeline_dt = []
let aggregate_pipeline = []


module.exports = {
    createSaleTransfer: async (req, res) => {
        let body = req.body

        console.log("body", body)

        try {

            let data_user = body.storedUser
            let conf_sale = body.storedConfSale
            let cart = body.storedCart
            let statusSale = body.statusSale
            let payment_img = body.img_payment

            let type_payout = conf_sale.type_payout
            let cant_products = conf_sale.no_products
            let total_sale = conf_sale.total_Sale
            let total_envio = conf_sale.total_envio || 0
            let subtotal_sale = conf_sale.subtotal_sale || total_sale

//-----------------------------------------------------------CREATE USER

            let searchUser = await usersModel.findOne({email: data_user.email})
            if (!searchUser) {
                const username = data_user.email.split('@')[0];

                searchUser = await usersModel.create({
                    user_name: username,
                    email: data_user.email,
                    name: data_user.name + ' ' + data_user.lastName,
                    usersTypes: 'user',
                    active: false

                })
            }

            let searchShopping = await usersShoppingModel.findOne({userConf: searchUser._id})
            let searchAddress

            if (!searchShopping) {

                searchAddress = await usersAddresModel.create({
                    noExt: data_user.noExt,
                    noInt: data_user.noInt,
                    address: data_user.address,
                    neighborhood: data_user.neighborhood,
                    zip: data_user.zip,
                    city: data_user.city,
                    state: data_user.state,
                    country: data_user.country,
                    reference: data_user.reference,
                })


                searchShopping = await usersShoppingModel.create({
                    name: data_user.name,
                    lastName: data_user.lastName,
                    gender: data_user.gender,
                    cellphone: data_user.cellphone,
                    userConf: searchUser._id,
                    userAddress: searchAddress._id,
                    count_sale: 1,


                })
            } else {

                searchAddress = await usersAddresModel.findById(searchShopping.userAddress)

                searchAddress.noExt = data_user.noExt
                searchAddress.noInt = data_user.noInt
                searchAddress.address = data_user.address
                searchAddress.neighborhood = data_user.neighborhood
                searchAddress.zip = data_user.zip
                searchAddress.city = data_user.city
                searchAddress.state = data_user.state
                searchAddress.country = data_user.country
                searchAddress.reference = data_user.reference

                await searchAddress.save()


                searchShopping.cellphone = data_user.cellphone

                searchShopping.count_sale = Number(searchShopping.count_sale) + 1

                await searchShopping.save()

            }
//-----------------------------------------------------------CREATE SALE

            let array_products_details = []

            for (let item of cart) {
                let searchProduct = await productModel.findById(item.id_product)

                let stockActual = Number(searchProduct.stock)

                let newStock = stockActual - Number(item.quantity)

                if (newStock <= 0) {
                    searchProduct.active = false
                }

                let newDetalle = await salesDetailsModel.create({

                    product: item.id_product,
                    stockAlMomento: stockActual,
                    cant: Number(item.quantity),
                    priceProduct: Number(item.price),
                    total_detalle: Number(item.price) * Number(item.quantity),

                })

                array_products_details.push(newDetalle._id)

                searchProduct.count_sale = searchProduct.count_sale + Number(item.quantity)

                let stock_new = newStock <= 0 ? 0 : newStock
                searchProduct.stock = stock_new


                await searchProduct.save()
            }


            let newSale = await salesModel.create({
                statusSale,
                type_payout,
                user_data: searchShopping._id,
                details_sale: array_products_details,
                payment_img,
                cant_products,
                subtotal_sale,
                total_envio,
                total_sale

            })

            let fullUrl = req.protocol + '://' + req.get('host')

            let URI = fullUrl + '/checkout-payments/' + newSale._id


            let fullName = searchShopping.name + ' ' + searchShopping.lastName + ' '

            let image_banner = 'http://ec2-3-143-55-82.us-east-2.compute.amazonaws.com:3080/public/images/fuego/logo_.png'

            let mail = await template.generic(image_banner, 'Recordatorio de pago', 'Finaliza tu pago', `Hola ${fullName}  es un recordatorio para finalizar tu compra por la cantidad de $ ${total_sale}, dale click al siguiente boton para finalizarla`, URI, 'Click Aqui')

            await sendMail('"Fuego Mexicano - Héctor Andrade" <noreply@fuegomexicano.com>', data_user.email, 'Finaliza tu pago.', mail)


            res.status(200).json({
                success: true,
                data: URI

            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                success: false,
                error: e
            })
        }
    },
    createMany: ms.createMany(salesModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(salesModel, populationObject, options),
    getOneById: async (req, res) => {
        let { id } = req.params;

        try {
            let sale = await salesModel.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: salesDetailsModel.collection.name,
                        localField: 'details_sale',
                        foreignField: '_id',
                        as: 'salesDetails'
                    }
                },
                {
                    $unwind: '$salesDetails'
                },
                {
                    $lookup: {
                        from: productModel.collection.name,
                        localField: 'salesDetails.product',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        cant_products: { $first: '$cant_products' },
                        date_sale: { $first: '$date_sale' },
                        subtotal_sale: { $first: '$subtotal_sale' },
                        total_envio: { $first: '$total_envio' },
                        total_sale: { $first: '$total_sale' },
                        details_sale: {
                            $push: {
                                _id: '$salesDetails._id',
                                product: '$product',
                                cant: '$salesDetails.cant',
                                priceProduct: '$salesDetails.priceProduct',
                                total_detalle: '$salesDetails.total_detalle',

                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        cant_products: 1,
                        date_sale: 1,
                        subtotal_sale: 1,
                        total_envio: 1,
                        total_sale: 1,
                        details_sale: 1
                    }
                }
            ]);

            res.status(200).json({
                success: true,
                sale
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                success: false,
                error: e
            });
        }
    },


    getMany: ms.getMany(salesModel, populationObject, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(salesModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(salesModel, validationObject, populationObject, options),
    updateById: ms.updateById(salesModel, validationObject, populationObject, options),

    findIdAndDelete: ms.findIdAndDelete(salesModel, options),

    datatable_aggregate: ms.datatable_aggregate(salesModel, aggregate_pipeline_dt, ''),
    aggregate: ms.aggregate(salesModel, aggregate_pipeline, options),
}
