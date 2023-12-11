const express = require('express')
const router = express.Router()

let {
    createOrder,
    receiveWebhook,
}  = require('../controllers/payments.controller')



router.post("/createOrder", createOrder);

router.post("/webhook", receiveWebhook);


router.get("/success", (req, res) => res.send("Success"));
router.get("/failure", (req, res) => res.send("failure"));
router.get("/pending", (req, res) => res.send("pending"));


module.exports = router
