
const { Messages, User, Contacts} = require('../models/models');
const uuid = require('uuid')
const mv = require('mv');

class AvatarController {
    async uploadAvatar(req, res, next) {
        const {userId} = req.params
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded!'})
        }
        const file = req.file;
        console.log(userId)
        if(!file) return res.json({error: 'Incorrect input name'})

        const newFileName = encodeURI(Date.now() + '-' + file.originalname);
        const filePath = `${__dirname}/../../client/public/static/avatar/${newFileName}`
        console.log(file.path)
        mv(file.path, filePath, err => {
            if (err) {
                console.log(err);
                return res.status(500).send(err)
            }
            console.log('file was uploaded')
        })

        try {
            const recordToUpdate = await User.findOne({
                where: { id: userId }
            }); // находим запись по идентификатору

            if (!recordToUpdate) {
                return res.status(404).json({ message: 'Record not found' });
            }
            recordToUpdate.avatar = newFileName;
            await recordToUpdate.save()
            return res.json({
                fileName: newFileName,
                filePath: `/uploads/${newFileName}`
            })
        } catch (err) {
            next(err);
        }
    }
}
module.exports = new AvatarController()