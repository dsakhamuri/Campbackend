const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const authy = require('authy')(process.env.AUTHYAPIKEY)

const facultySchema = new mongoose.Schema({
  facultyAuthyId:{
    type:String
  },
  facultyName:{
    type:String,
    trim:true,
    required:true,
    minlength:4
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

// realationship
facultySchema.virtual('post', {
  ref:'Post',
  localField: '_id',
  foreignField: 'owner'
})

//generating auth token
facultySchema.methods.generateAuthToken = async function() {
  const faculty = this;
  const token = jwt.sign({_id:faculty._id.toString()}, process.env.JWT_SECRET, {expiresIn:"1h"}); //{expiresIn: '1h'} <- 3rd param

  faculty.tokens = faculty.tokens.concat({token});
  await faculty.save();
  return token;
}

//generating authyId as facultyId
facultySchema.methods.generateFacultyAuthyId = async function() {
  const faculty = this
  let facultyAuthyId = ''
  // creating authy id using twilio api
  authy.register_user(faculty.email, faculty.primaryContact, '61', function (err, res) {
    if(err){
      throw new Error(err) 
    }
      
    if (!res.user.id || !res.success) {
      throw new Error('unable to regiter authy') 
    }

    const authy_id = res.user.id
    facultyAuthyId = res.user.id.toString()
    
    authy.user_status(authy_id, async function (err, res) {
        if (res.status.authy_id) {
          facultyAuthyId = res.status.authy_id.toString()
          faculty.facultyAuthyId = res.status.authy_id.toString()
          await faculty.save() 
        }
    })   
  })
}

//login security validation
facultySchema.statics.findByCredentials = async (email, password) => {
  const foundFaculty = await Faculty.findOne({email});

  if(!foundFaculty)
      throw new Error('unable to login, try again !!');
  const isMatch = await bcrypt.compare(password, foundFaculty.password);

  if(!isMatch)
      throw new Error('unable to login, try again !!');

  return foundFaculty;
}

// hash the plain text before saving
facultySchema.pre('save', async function(next) {
  const faculty = this;

  if( faculty.isModified('password')) {
      faculty.password = await bcrypt.hash(faculty.password, 8);
  }

  next();
});

//hidding private data
facultySchema.methods.toJSON = function () {
  const faculty = this.toObject();

  //deleting private data and retuning
  delete faculty.password;
  delete faculty.tokens;
  delete faculty.avatar;
  return faculty;
}

const Faculty = mongoose.model('Faculty',facultySchema)

module.exports = Faculty
