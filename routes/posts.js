const express = require('express')
const { mainModule } = require('process')
const Post = require('../models/post')

router = express.Router()

router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find()
        res.json(posts)
    } catch {
        res.json({ message: err})
    }
})

router.post('/new-post', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    })
    try {
        const savedPost = await post.save()
        res.json(savedPost)
    } catch {
        res.json({ message: err })
    }
})

router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
        res.json(post)
    } catch (error) {
        res.json({ message: error })
    }
})

router.delete('/:postId', async (req, res) => {
    try {
        const removedPost = await Post.deleteOne({_id: req.params.postId })
    } catch (error) {
        res.json({ message: error })
    }
})

router.patch('/:postId', async (req, res) => {
    try {
        const updatedPost = await Post.updateOne({_id: req.params.postId }, [ { $set: { title: req.body.title } }, { $set: { description: req.body.description } } ] )
        res.json(updatedPost)
    } catch (error) {
        res.json({ message: error })
    }
})

router.use('/', (req, res) => {
    res.send('404! Seems like the page does not exist :(')
})

module.exports = router