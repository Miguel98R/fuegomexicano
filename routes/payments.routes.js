const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');

let {
    createOrder,
    receiveWebhook,
    createOrderStripe,
    webhookStripe
}  = require('../controllers/payments.controller')



router.post("/createOrder", createOrder);
router.post("/createOrderStripe", createOrderStripe);

router.post("/webhook", receiveWebhook);




router.get("/success", (req, res) => res.send("Success"));
router.get("/failure", (req, res) => res.send("failure"));
router.get("/pending", (req, res) => res.send("pending"));

// Middleware global para JSON y URL-encoded bodies
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
// Middleware específico para la ruta del webhook de Stripe
router.post('/webhookStripe', bodyParser.raw({ type: 'application/json' }), webhookStripe);


module.exports = router
