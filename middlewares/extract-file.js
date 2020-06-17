const multer = require('multer')

//multer configuration
const upload = multer({         //dest: 'avatars',  not to save it inside the app, rather in database
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
            return cb(new Error('Only jpg/jpeg/png files are allowed !!', false));

        cb(undefined, true);
    }
})

exports.uploadAsBuffer = upload.single('avatar')


//TODO:
const MIME_TYPE = {
  'image/png' : 'png',
  'image/jpg' : 'jpg',
  'image/jpeg' : 'jpeg',

}

 const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype]

    let error = new Error('Invlid mime-type error')
    if(isValid)
      error = null

    cb(error, './assets/images/postMedias')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = '-' + Date.now()
    const name = file.originalname.toLowerCase().split(' ').join('-')  + uniqueSuffix
    const ext = MIME_TYPE[file.mimetype]
    
    cb(null, name + uniqueSuffix + '.' + ext)
  },
  
})

exports.uploadAsString = multer({storage:storage}).single("media")

const resultStorage = multer.diskStorage({
  destination: (req, file, cb) => {    
    cb(null, './assets/studentResults')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = '-' + Date.now()
    let index = file.originalname.lastIndexOf('.')
    const name = file.originalname.substring(0,index).toLowerCase().split(' ').join('-')
    const ext = req.body.type
    
    cb(null, name + uniqueSuffix + '.' + ext)
  },
  fileFilter : function(req, file, callback) { //file filter
    if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
        return callback(new Error('Wrong extension type'));
    }
    callback(null, true);
  }
})

exports.uploadResult = multer({storage:resultStorage}).single("resultFile")


