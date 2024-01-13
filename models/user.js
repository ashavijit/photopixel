const mongoose = require('mongoose');
const bycrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },

    password : {
        type : String,
        required : true,
        minLength : 6,
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user',
    },
});

UserSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }
    this.password = await bycrypt.hash(this.password, 10);
    next();
});
UserSchema.methods.correctPassword = async function (candidatePassword) {
    return await bycrypt.compare(candidatePassword, this.password);
};;

module.exports = mongoose.model('User', UserSchema);