const express = require('express')
const router = express.Router()

router.use("/users/", require("./users.router"))
router.use("/auth/", require("./auth.routes"))
router.use("/products/", require("./products.routes"))
router.use("/upload/", require("./upload.routes"))
module.exports = router