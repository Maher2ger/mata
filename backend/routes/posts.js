const express = require('express');
const Post = require('../db/models/post');
const multer = require('multer');   // this module needed to handle images


//multer config.
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: (req, file,callback) => {
        const isValid = MIME_TYPE_MAP[file.type];
        let error = new Error('invalid MIME type');
        if (isValid) {
          error = null
        }
        callback(null,"backend/images");
    },
    filename: (req, file,callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name+'_'+Date.now()+'.'+ext);
    }


})

const router = express.Router();



router.post('', multer({storage: storage}).single('image') ,(req, res) => {
    console.log('Post requested to add a new post');
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imgPath: url+'/images/'+ req.file.filename,
    });                //we cannot read the req.body without importing the body parser
    post.save()
        .then((createdPost) => {
                res.status(200).json({
                    message: 'post added successfully',
                    post: {
                        ...createdPost,
                        id: createdPost._id,
                    }
                })

            }
        );
})


router.get('',(req, res) => {
    console.log('get requested to get all posts');
    let fetchedPosts;
    const queryParams = {
        pageSize: +req.query.pageSize,     //plus converts string to number
        currentPage: +req.query.currentPage
    };
    const postQuery = Post.find();
    if (queryParams.pageSize && queryParams.currentPage) {
        postQuery
            .skip(queryParams.pageSize * (queryParams.currentPage -1))
            .limit(queryParams.pageSize);
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents;
            return Post.count();
        })
        .then((count) => {
            res.status(200).json({
                message: 'posts fetched successfully',
                posts: fetchedPosts,
                numberOfPosts: count
            })
    })

});

router.delete('/:id', (req , res ) => {
    console.log('Delete requested to delete the Post with Id: '+ req.params.id);

    Post.deleteOne({
        _id: req.params.id
    })
        .then(() => {
                res.status(200).json({message: req.params.id + ' deleted successfully'});
            }
        )
});

router.put("/:id" , multer({storage: storage}).single('image') ,(req, res) => {
    console.log('Put requested to edit post');

    const url = req.protocol + '://' + req.get('host');
    let post;

    if (req.file) {
        post = new Post({
            _id: req.params.id,
            title: req.body.title,
            content:req.body.content,
            imgPath: url+'/images/'+ req.file.filename,

        })
    } else {
        post = new Post({
            _id: req.params.id,
            title: req.body.title,
            content:req.body.content,
        })
    }


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
