const express = require('express')
const postRouter = new express.Router()
const PostController = require('../controllers/post-controller')
const auth = require('../middlewares/auth')
const MyMulter = require('../middlewares/extract-file')


// get post
postRouter.get('/universityApi/posts', auth, PostController.getPost)

// get owner media
postRouter.get('/universityApi/posts/:facultyId/avatar', PostController.postownerProfilePicture)

//add post
postRouter.post('/universityApi/posts', auth, MyMulter.uploadAsString, PostController.addPost)

//edit post
postRouter.patch('/universityApi/posts/:id', auth, PostController.editPost)

//delete post
postRouter.delete('/universityApi/posts/:id', auth, PostController.deletePost)


module.exports = postRouter
