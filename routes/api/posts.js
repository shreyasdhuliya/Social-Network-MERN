const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator')
const auth = require('../../middleware/auth')
const User = require('../../modals/User')
const Profile = require('../../modals/Profile')
const Post = require('../../modals/Post')

//@route        POST api/posts
//@description  create a post
//@accress      private
router.post('/', [auth , [

    check('text', 'text is required')
    .not()
    .isEmpty(),
]
],

async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });

    }

    try{
    const user  = await User.findById(req.user.id).select('-password');

    const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    })

    const post = await newPost.save();

    res.json(post)
}
catch(err){
    console.error(err.message);
    res.status(500).send("server error")
}
});

//@route        GET api/posts
//@description  get all posts
//@accress      private
router.get('/', auth, async (req,res) => {
    try {
        const posts = await Post.find().sort({ date:  -1 }) 
        res.json(posts)       
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error")
    }
})

//@route        GET api/posts/:id
//@description  get post by id
//@accress      private
router.get('/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id) 
        if(!post){
            return res.status(404).json({msg:"Post not found"})
        }
        res.json(post)       
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:"Post not found"})
        }
        res.status(500).send("server error")
    }
})

//@route        DELETE api/posts/:id
//@description  delete a post
//@accress      private
router.delete('/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg:"Post not found"})
        }

        //cehck user
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: "User not authorized"})
        }

        await post.remove();

        res.json({msg:"Post Removed"})
        
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:"Post not found"})
        }
        res.status(500).send("server error")
    }
})

//@route        PUT api/posts/like/:id
//@description  like a post
//@accress      private
router.put('/like/:id', auth, async (req,res) => { 
    try {
        const post = await Post.findById(req.params.id);

        //cehck if the post has been liked 
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg:"Post already liked"})
        }

        post.likes.unshift({user: req.user.id})

        await post.save();

        res.json(post.likes)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error');
    }
})

//@route        PUT api/posts/unlike/:id
//@description  like a post
//@accress      private
router.put('/unlike/:id', auth, async (req,res) => { 
    try {
        const post = await Post.findById(req.params.id);

        //cehck if the post has been liked 
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({msg:"Post has not been liked"})
        }

        //get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error');
    }
});

//@route        POST api/posts/comment/:id
//@description  comment on a post
//@accress      private
router.post('/comment/:id', [auth , [

    check('text', 'text is required')
    .not()
    .isEmpty(),
]
],

async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });

    }

    try{
    const user  = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);

    const newCommment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    }

    post.comments.unshift(newCommment);

    await post.save();

    res.json(post.comments)
}
catch(err){
    console.error(err.message);
    res.status(500).send("server error")
}
});

//@route        DElete api/posts/comment/:id/:comment_id
//@description  delete a comment on a post
//@accress      private
router.delete('/comment/:id/:comment_id', auth, async (req,res) => {
    try {

        const post = await Post.findById(req.params.id);

        //Pull out comment
        const comment  = post.comments.find(comment => comment.id === req.params.comment_id);

        // Make sure comment exists
        if(!comment){
            return res.status(404).json({msg: "comment does not exist"});
        }        

        //cehck user
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg: "user not authorised"}); 
        }

        // get remove index
        const removeIndex = post.comments
        .map(comment => comment.user.toString())
        .indexOf(req.user.id)

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments)        
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router;