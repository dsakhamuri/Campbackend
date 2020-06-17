const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const authy = require('authy')(process.env.AUTHYAPIKEY)

const studentSchema = new mongoose.Schema({
  studentAuthyId:{
    type:String
  },
  studentName:{
    type:String,
    trim:true,
    required:true,
    minlength:4
  },
  rollNo:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },
  branch:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    trim:true,
    unique:true,
    validate(value){
      if(!validator.isEmail(value))
        throw new Error('enter a valid email')
    }
  },
  password:{
    type:String,
    required:true,
    validate(value){
      if(value.includes('password'))
        throw new Error("entered password field can't contain word: 'password'")

      /* if (!value.match(/[a-z]/g) &&
          !value.match(/[A-Z]/g) &&
          !value.match(/[0-9]/g) &&
          !value.match(/[^a-zA-Z\d]/g))
        throw new Error('Re-Check password policy') */
    }
  },
  avatar:{
    type:Buffer
  },
  gender:{
    type:String,
    required:true
  },
  primaryContact:{
    type:String,
    required:true
  },
  tokens:[{
    token:{
        type: String,
        required: true
    }
  }],
},{
  timestamps:true
})


//generating auth token
studentSchema.methods.generateAuthToken = async function() {
  const student = this;
  const token = jwt.sign({_id:student._id.toString()}, process.env.JWT_SECRET, {expiresIn:"1h"}); //{expiresIn: '1h'} <- 3rd param

  student.tokens = student.tokens.concat({token});
  await student.save();
  return token;
}

//generating authyId as studentId
studentSchema.methods.generateStudentAuthyId = async function() {
  const student = this
  let studentAuthyId = ''
  
  // creating authy id using twilio api
  authy.register_user(student.email, student.primaryContact, '61', function (err, res) {
    if(err){
      throw new Error(err) 
    }

    if (!res.user.id || !res.success) {
      throw new Error('unable to regiter authy') 
    }

    const authy_id = res.user.id
    studentAuthyId = res.user.id.toString()
    
    authy.user_status(authy_id, async function (err, res) {
        if (res.status.authy_id) {
          studentAuthyId = res.status.authy_id.toString()
          student.studentAuthyId = res.status.authy_id.toString()
          await student.save() 
        }
    })   
  })
}

//login security validation
studentSchema.statics.findByCredentials = async (email, password) => {
  const foundStudent = await Student.findOne({email});

  if(!foundStudent)
      throw new Error('unable to login, try again !!');
  const isMatch = await bcrypt.compare(password, foundStudent.password);

  if(!isMatch)
      throw new Error('unable to login, try again !!');

  return foundStudent;
}

// hash the plain text before saving
studentSchema.pre('save', async function(next) {
  const student = this;

  if( student.isModified('password')) {
    student.password = await bcrypt.hash(student.password, 8);
  }

  next();
});

//hidding private data
studentSchema.methods.toJSON = function () {
  const student = this.toObject();

  //deleting private data and retuning
  delete student.password;
  delete student.tokens;
  delete student.avatar;
  return student;
}

const Student = mongoose.model('Student',studentSchema)

module.exports = Student
