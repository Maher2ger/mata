const express = require("express");
const User = require('../db/models/user')
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');

module.exports = router;

router.post("/signup", (req, res) => {
    console.log(req.body);
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });
            user.save()
                .then((result) => {
                    res.status(200).json({
                        message: 'User created successfully',
                        result: result
                    })
                }).catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });
        });


    }
)

router.post('/login', (req, res, next) => {
    User.findOne({
        email: req.body.email,
    })
        .then(
            user => {
                if (!user) {
                    return res.status(401).json({
                        message: 'email not found in the database!'
                    })
                }
                return bcrypt.compare(req.body.password, user.password)
                    .then(result => {
                            if (result) {
                                const token = jwt.sign({
                                    email: user.email,
                                    userId: user._id
                                },"secret_this_should_be_longer"
                                , {
                                    expiresIn: "1h",
                                    }
                                )
                                res.status(200).json({
                                    message: 'jwt token created successfully',
                                    token: token
                                })
                            } else {
                                res.status(500).json({
                                    message: "password is wrong!"
                                })
                            }
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            message: "Auth faild!"
                        })
                    })
            }
        )
    }
)
