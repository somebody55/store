const mongoose = require('mongoose')
const validator = require('validator')
const bcrybt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please provide name'],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide email'],
      validate: {
        validator: validator.isEmail,
        message: 'Please provide valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  });


  userSchema.pre('save',async function(){
   const salt = await bcrybt.genSalt(10)
   this.password = await bcrybt.hash(this.password,salt) 
  })

  userSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrybt.compare(candidatePassword,this.password)
    return isMatch
  }
module.exports = mongoose.model('User',userSchema)