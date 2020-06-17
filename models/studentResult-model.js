const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema(
  {
    sem:{
      type:String,
      required:true,
      trim:true,
    },
    name:{
      type:String,
      required:true,
      trim:true,
      maxlength:20
    },
    contact:{
      type:String,
      required:true,
      trim:true,
      maxlength:10,
      minlength:10
    },
    subject:{
      type:String,
      required:true,
      trim:true,
  },
  fullMark:{
      type:String,
      required:true,
  },
  passMark:{
      type:String,
      required:true,
  },
  markScored:{
      type:String,
      required:true,
  },
  persentage:{
      type:String,
      required:true,
  },
      
    
},{
    timestamps:true
  }
)


/* facultySchema.methods.generateAuthToken = async function() {
  const result = this;


  result.tokens = result.tokens.concat({token});
  await result.save();
  return token;
} */

const Result = mongoose.model('Result', resultSchema)

module.exports = Result
