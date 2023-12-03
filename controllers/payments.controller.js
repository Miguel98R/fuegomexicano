const paymentModel = require("../models/payments.model")
const {MercadoPagoConfig, Payment, Preference} = require("mercadopago")

const client = new MercadoPagoConfig({accessToken: process.env.MERCADOPAGO_API_KEY,});
const payment = new Payment(client);
const preference = new Preference(client);


module.exports = {
    createOrder: async (req, res) => {
        const urlHost = req.protocol + '://' + req.get('host');

        try {


            let result = await preference.create({
                body: {
                    items: [
                        {
                            title: 'lap',
                            quantity: 1,
                            unit_price: 100,
                            currency_id: "MX"
                        }
                    ],
                    back_urls: {
                        success: urlHost + "/api/payments/success",
                        failure: urlHost + "/api/payments/failure",
                        pending: urlHost + "/api/payments/pending",

                    },
                    redirect_urls: {
                        success: urlHost + "/api/payments/success",
                        failure: urlHost + "/api/payments/failure",
                        pending: urlHost + "/api/payments/pending",

                    },
                    //notification_url:urlHost+"/webhook"
                    notification_url: "https://6115-187-187-206-41.ngrok-free.app/api/payments/webhook"
                }
            })


            console.log("result---------------", result)

            let init_point = result.init_point


            let newPayment = new paymentModel({
                client_id: result.client_id,
                id_payment: result.collector_id,
                operation_type: result.operation_type,
                total: 100,
                url_payment: init_point,
                status_order:'create',
                status_detail:'create',

            })

            await newPayment.save()


            res.status(200).json({
                success: true,
                result,
                init_point

            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                success: false,
                error: e

            })
        }
    },
    receiveWebhook: async (req, res) => {
        try {
            const payment_ = req.query;

            if (payment_.type === "payment") {
                const data = await payment.get({
                    id: payment_['data.id'],
                })
                console.log("data--------------",data);

                let searchPayment = await paymentModel.findOne({id_payment: data.collector_id})

                searchPayment.status_order = data.status
                searchPayment.status_detail = data.status_detail
                searchPayment.total = data?.transaction_amount?.total_paid_amount
                await searchPayment.save()
            }


            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Something goes wrong"});
        }
    }
}
