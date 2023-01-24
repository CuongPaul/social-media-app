const Post = require('../../models/Post')
const FilterPostData = require('../../utils/FilterPostData')

exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.postId)
      .populate('user')
      .populate({ path: 'body.with'})

    res.status(200).json({ message: "success" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({error:"Something went wrong"})
  }
}

exports.editPost = async (req, res) => {
  try {
    const { privacy, content } = req.body;

    await Post.findByIdAndUpdate(req.params.postId, { privacy, content })
      .populate('user')
      .populate({ path: 'body.with'})

    res.status(200).json({ message: "success" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({error:"Something went wrong"})
  }
}

exports.fetchPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('user')
      .populate({ path: 'body.with'})

    let postData = FilterPostData(post)

    res.status(200).json({ post: postData })
  } catch (err) {
    console.log(err)
    return res.status(500).json({error:"Something went wrong"})
  }
}

exports.fetchAllPosts = async (req, res) => {
  let page = parseInt(req.query.page || 0)
  let limit = 3

  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(page * limit)
      .populate('user')
      .populate({ path: 'body.with' })

    let postsData = posts.map((post) => FilterPostData(post))

    const totalCount = await Post.estimatedDocumentCount().exec()
    const paginationData = {
      currentPage:page,
      totalPage:Math.ceil(totalCount/limit),
      totalPost:totalCount
    }
    res.status(200).json({ posts: postsData,pagination:paginationData })
  } catch (err) {
    console.log(err)
    return res.status(500).json({error:"Something went wrong"})
  }
}
