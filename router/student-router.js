const express = require('express')
const studentRouter = new express.Router()
const auth = require('../middlewares/auth')
const StudentController = require('../controllers/student-controller')
const MyMulter = require('../middlewares/extract-file')


// get results
//studentRouter.get('/universityApi/student/getStudentResults', auth, StudentController.getStudentResults)

// get results
studentRouter.get('/universityApi/student/getProfileData/:studentId', auth, StudentController.getStudentProfile)

//  logging in
studentRouter.post('/universityApi/student/login', StudentController.studentLogin)

//  logout
studentRouter.post('/universityApi/student/logout', auth, StudentController.studentLogout)

//  Signup
studentRouter.post('/universityApi/student/newStudent', MyMulter.uploadAsBuffer, StudentController.studentSignup)

//  Get user avatar
studentRouter.get('/universityApi/student/:studentId/avatar',StudentController.getStudentAvatar)

// storing result data
//studentRouter.post('/universityApi/student/resultUpload', MyMulter.uploadResult, StudentController.uploadSuccess)

//otp sending for restting password
studentRouter.post('/universityApi/student/sendOtp', auth, StudentController.sendOtp)

//verifying OTP
studentRouter.post('/universityApi/student/verifyOtp', StudentController.verifyOtp)

//resetting password
studentRouter.post('/universityApi/student/resetPassword', StudentController.resetPassword)

module.exports = studentRouter
