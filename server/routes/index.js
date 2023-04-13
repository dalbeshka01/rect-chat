const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const chatRouter = require('./chatRouter')
const avatarRouter = require('./avatarRouter')

router.use('/user', userRouter)
router.use('/chat', chatRouter)
router.use('/avatar', avatarRouter)

module.exports = router