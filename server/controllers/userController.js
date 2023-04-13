const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/models')

const generateJwt = (id, email, avatar) => {
    return  jwt.sign(
        {id, email, avatar},
        process.env.SECRET_KEY,
        {expiresIn: '24h'})
}

class UserController {
    async registration(req, res, next) {
        const {name, surname, email, password} = req.body
        if(!email || !password){
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hasPassword = await bcrypt.hash(password, 5)
        const user = await User.create({name, surname, email, password: hasPassword, avatar: "avatar-default.jpg"})
        console.log({user})
        const token = generateJwt(user.id, user.email, user.avatar)
        return res.json({token})

    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь с таким email не найден'))
        }
        let comperePassword = bcrypt.compareSync(password, user.password)
        if(!comperePassword) {
            return next(ApiError.internal('Указан не верный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.avatar)
        return res.json({token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email)
        return res.json({token})
    }
}

module.exports = new UserController()