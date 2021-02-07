const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
//import {config} from '../../config/default';

const User = require('../../modals/User')

//@route        POST api/users
//@description  Register User
//@accress      public
router.post('/', [
    check('name', 'Name is requried')
    .not()
    .isEmpty()
    .trim(),
    check('email','Please include a valid email')
    .isEmail()
    .normalizeEmail(),
    check('password','Please enter pwd with 6 or more characters')
    .isLength({min: 6})
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {name, email, password} = req.body;

    try{

     // See if user exists
     let user = await User.findOne({email})
     if(user){
         return res.status(400).json({errors: [{msg: "user already exists"}]})
     }
    //Get Users gravatar
    const avatar = gravatar.url(email, {
        s:"200",
        r:'pg',
        d:"mm"
    });
    
    user = new User({
        name,
        email,
        avatar,
        password
    });

        // Encrpt pwd
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();


    // return jsonwebtoken
    //res.send('User registered')

    const payload = {
        user:{
            id:user.id
        }
    }

    jwt.sign(
        payload, 
        config["jwtToken"],//config.get('jwtToken'),
        {expiresIn: 360000},
        (err, token) => {
            if (err) throw err;
            res.json({token});
        });

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error')
    }

    
});

module.exports = router;