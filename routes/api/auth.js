const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

const User = require('../../modals/User');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

//@route        GET api/auth
//@description  Test route
//@accress      public
router.get('/', auth, async (req, res) => {
    try{

        //middleware auth.js req.user = decoded.user
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.log(err.message)
        res.status(500).send('servr error');
    }
});

//@route        POST api/auth
//@description  Authenticate user and get token
//@accress      public
router.post('/', [
     check('email','Please include a valid email')
    .isEmail()
    .normalizeEmail(),
    check('password','Password is required')
    .exists()
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const { email, password} = req.body;

    try{

     // See if user exists
     let user = await User.findOne({email})
     if(!user){
         return res.status(400).json({errors: [{msg: "invalid credentials"}]})
     }

     //password matches validation using bcrypt
     const isMatch = await bcrypt.compare(password, user.password);

     if(!isMatch){ return res.status(400).json({errors: [{msg: "invalid credentials"}]})}

    const payload = {
        user:{
            id:user.id
        }
    }

    jwt.sign(
        payload, 
        config.get('jwtToken'),
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