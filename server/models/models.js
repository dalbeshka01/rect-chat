const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type: DataTypes.STRING, allowNull:false},
    surname:{type: DataTypes.STRING, allowNull:false},
    email:{type: DataTypes.STRING, unique: true},
    password:{type: DataTypes.STRING, allowNull:false},
    avatar:{type: DataTypes.STRING}


})

const Messages = sequelize.define('messages', {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    content:{type: DataTypes.STRING, allowNull:false},
    img:{type: DataTypes.STRING, allowNull: true},
    recipient_id:{type: DataTypes.INTEGER, allowNull:false}
})

const Online_status = sequelize.define('online_status', {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    is_online:{type: DataTypes.BOOLEAN, allowNull:false},
    last_active:{type: DataTypes.DATE, allowNull:false}
})

const Contacts = sequelize.define('contacts', {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    contact_id:{type: DataTypes.INTEGER, allowNull:false},
})

const Calls = sequelize.define('calls', {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    call_type:{type: DataTypes.STRING, allowNull:false},
    start_time:{type: DataTypes.DATE, allowNull:false},
    end_time:{type: DataTypes.DATE, allowNull:false}
})

const Groups = sequelize.define('groups', {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type: DataTypes.STRING, unique: true, allowNull:false},
    owner_id:{type: DataTypes.INTEGER, allowNull:false}
})

const Group_members = sequelize.define('group_member', {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

User.hasMany(Contacts)
Contacts.belongsTo(User)

User.hasMany(Messages)
Messages.belongsTo(User)

User.hasOne(Online_status)
Online_status.belongsTo(User)

User.belongsToMany(Groups, {through: Group_members})
Groups.belongsToMany(User, {through: Group_members})


module.exports = {
    User,
    Contacts,
    Messages,
    Online_status,
    Groups,
    Calls,
    Group_members
}


