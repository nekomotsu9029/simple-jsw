const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();

const secretToken = 'nekomotsuSecretToken'

const _user = require('../models/user');

router.post('/api/signup', async (req, res)=>{
    const {name, email, password} = req.body;
    const userSave = new _user({
        name,
        email,
        password
    });
    userSave.password = await userSave.encryptPassword(userSave.password);
    await userSave.save();
    const token = jwt.sign({id: userSave._id}, secretToken, {
        expiresIn: 60 * 60 * 24 * 2
    })
    res.json({
        auth: true,
        token
    })
});

router.post('/api/signin', async (req, res)=>{
    const {email, password} = req.body;
    const user = await _user.findOne({
        email
    });
    if(!user){
        return res.status(404).json({
            auth: false,
            message: "The email doesn't exists"
        })
    }
    const passwordIsValid = await user.comparePassword(password);
    if(!passwordIsValid){
        return res.status(401).json({
            auth: false,
            message: "Wrong password"
        })
    }
    const token = jwt.sign({id: user._id}, secretToken, {
        expiresIn: 60 * 60 * 24 * 2
    })
    res.json({
        auth: true,
        token
    })
});

router.get('/api/my', async (req, res)=>{
    const tokenClient = req.header('x-access-token');
    if(!tokenClient){
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }
    const decoded = jwt.verify(tokenClient, secretToken);
    const user = await _user.findById(decoded.id, {password: 0});
    if(!user){
        return res.status(404).json({
            auth: false,
            message: 'No user found'
        })
    }
    res.json({
        auth: true,
        user
    })
});

module.exports = router;