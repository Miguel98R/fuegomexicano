const express = require('express')
const router = express.Router()

router.use("/users/", require("./users.router"))
router.use("/auth/", require("./auth.routes"))
module.exports = router