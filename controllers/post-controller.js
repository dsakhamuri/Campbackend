const Post = require('../models/post-model')
const Facuty = require('../models/faculty-model')


//GET POST
exports.getPost = async (req, res) => {
  const pageSize = +req.query.pagesize
  const currentPage = +req.query.currentpage
  const postQwery = Post.find({})
  let foundPosts = {}

  try {
    let currentPostCount = await Post.countDocuments()
    if(pageSize && currentPage){
      if(currentPostCount > pageSize){
        foundPosts = await postQwery
                        .skip(pageSize * (currentPage-1) )
                        .limit(pageSize)
      }else {
        foundPosts = await postQwery.limit(pageSize)
      }
      
      
    }


    //queries
    foundPosts = await postQwery
    const totalPostsLength = await Post.countDocuments()
    
    
    if(!foundPosts)
      throw new Error()

    res.status(200).send({
      message:'fetched data successfully',
      posts:foundPosts,
      totalPostsLength,
    })
  } catch (error) {
      res.status(404).send({
        message:'no data found, try again !!',
        posts:undefined,
        totalPostsLength:undefined
      })
  }
}

//GET owner profile image
exports.postownerProfilePicture = async (req, res) => {
  try {
    const postOwner = await Facuty.findById(req.params.facultyId)

    let postOwnerProfilePicture = postOwner.avatar
    
    res.set('Content-Type','image/png')
    res.status(200).send(postOwnerProfilePicture)
  } catch (error) {
    res.status(404).send()
  }
}

//ADD POST
exports.addPost = async (req, res) => {
  const url = req.protocol+'://'+req.get('host')

  let mediaUrl = ''
  if(req.file)
   mediaUrl = url+'/assets/images/postMedias/'+req.file.filename
  
  const post = new Post({
    title:req.body.title,
    description:req.body.description,
    media:mediaUrl,
    owner:req.faculty._id});

  try {    
    const createdPost = await post.save()
    
    res.status(201).send({
      message:'post created successfully',
      createdPost:createdPost
      
    })

  } catch (error) {
    res.status(400).send({message:error.message})
  }

}

//EDIT POST
exports.editPost = async (req, res) => {
  const updates = Object.keys(req.body);

  try {
      const editingPost = await Post.findOne({_id:req.params.id, owner: req.faculty._id})
      if(!editingPost)
        return res.status(401).send({ message: "Not authorized!" });

      const editedPost = await Post.updateOne({_id:req.body.id, owner:req.faculty._id}, req.body)
      if (editedPost.n > 0) {
        res.status(200).json({ success: 'Edited successfully'});
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
  }catch (error) {
      res.status(401).send({message:error.message});
  }
}

//DELETE POST
exports.deletePost = async (req, res) => {
  const deletingTask = await Post.findOne({_id:req.params.id, owner: req.faculty._id})
  try {
    if(!deletingTask)
      return res.status(401).send({ message: "Unauthorized to delete!" });

    await deletingTask.remove()
    res.status(200).send({message:'Deleted successfully'})
  } catch (error) {  
    res.status(500).send({message:error.message})
  }
}
