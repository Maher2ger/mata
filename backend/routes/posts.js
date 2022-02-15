const express = require('express');
const Post = require('../db/models/post');


const router = express.Router();

router.post('', (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });                //we cannot read the req.body without importing the body parser
    post.save()
        .then((createdPost) => {
                res.status(200).json({
                    message: 'post added seccessfully',
                    postId: createdPost._id
                })

            }
        );
})


router.get('',(req, res) => {
    console.log('get requested');
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: 'posts fetched successfully',
                posts: documents
            })

        })

});

router.delete('/:id', (req , res ) => {
    Post.deleteOne({
        _id: req.params.id
    })
        .then(() => {
                res.status(200).json({message: req.params.id + ' deleted successfully'});
            }
        )
});

router.put("/:id", (req, res) => {
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content:req.body.content
    })
    Post.updateOne(
        {
            _id: req.params.id
        }, post)
        .then((result) => {
            res.status(200).json({message:'updated successfully'});
        })
        .catch(err => {console.log(err);});
})

module.exports = router;
