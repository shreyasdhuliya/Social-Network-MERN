const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../modals/Profile');
const User = require('../../modals/User');
const {check, validationResult} = require('express-validator');
const request = require('request');
const config = require('config');


//@route        post api/profile/me
//@description  get current user profile
//@accress      private
router.get('/me', auth, async (req, res) => {
    try{

        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar'])

        if(!profile){
            return res.status(400).json({msg:"no profile for thiss user"})
        }

        res.json(profile)

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//@route        post     api/profile
//@description  create/update user profile
//@accress      private 
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills',"skills is required").not().isEmpty(),

]],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors  .isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram,linkedin} = req.body

        //build profile object
        const profileFields = {};
        profileFields.user = req.user.id
        if(company) profileFields.company = company
        if(website) profileFields.website = website
        if(location) profileFields.location = location
        if(bio) profileFields.bio = bio
        if(status) profileFields.status = status
        if(githubusername) profileFields.githubusername = githubusername
        if(skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }
        console.log(profileFields.skills);

        //build social object
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try{

            let profile = await Profile.findOne({user: req.user.id})
            if(profile){
                //update
                console.log('update')
                profile = await Profile.findOneAndUpdate(
                    {user: req.user.id}, 
                    {$set: profileFields },
                    {new:true},
                     );
                     return res.json(profile)
                }
                
                //create
                profile = new Profile(profileFields);
                console.log('create')

                await profile.save();

                return res.json(profile)
            }

        catch(err){
            console.error(err.message);
            res.status(500).send('server error')
        }

        res.send('hello')
    }
)

//@route        GET     api/profile
//@description  get all profiles
//@accress      public 

router.get('/', async(req,res) => {
    try{
        const profiles  = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles)

    }catch(err){
        console.error(err.message)
        return res.status(500).send('server error')
    }
}

)

//@route        GET     api/profile/user/:user_id
//@description  get  profiles by user id
//@accress      public 
router.get('/user/:user_id', async(req,res) => {
    try{
        const profile  = await Profile.findOne({user: req.params.user_id}).populate('user',['name','avatar']);
        
        if(!profile){
            return res.status(400).json({msg:"Profile not found"})
        }

        res.json(profile)

    }catch(err){
        console.error(err.message)
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg:"profile not found"})
        }
        return res.status(500).send('server error')
    }
}

)

//@route        DElete     api/profile
//@description  profile user and post
//@accress      private 

router.delete('/', auth, async(req,res) => {
    try{
        //todo - remove user posts

        //remove profile
        await Profile.findOneAndRemove({user: req.user.id});

        await User.findOneAndRemove({_id: req.user.id})
        res.send("user removed")

    }catch(err){
        console.error(err.message)
        return res.status(500).send('server error')
    }
}
);

//@route        PUT     api/profile/experience
//@description  add profile experience
//@accress      private 

router.put('/experience', [auth,[

    check('title','title is required')
    .not()
    .isEmpty(),
    check('company','company is required')
    .not()
    .isEmpty(),
    check('from','from date is required')
    .not()
    .isEmpty()]

], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try{
        const profile = await Profile.findOne({user: req.user.id});

        profile.experience.unshift(newExp);

        await profile.save()

        res.json(profile);
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
});

//@route        delete     api/profile/experience/:exp_id
//@description  delete experience from profile
//@accress      private 
router.delete('/experience/:exp_id', auth, async(req,res) => {
    try {

        const profile = await Profile.findOne({user: req.user.id});

        //get remove index 
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

        profile.experience.splice(removeIndex, 1);

        await profile.save()

        res.json(profile)

    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//@route        PUT     api/profile/education
//@description  add profile education
//@accress      private 

router.put('/education', [auth,[

    check('school','school is required')
    .not()
    .isEmpty(),
    check('degree','degree is required')
    .not()
    .isEmpty(),
    check('fieldofstudy','fieldofstudy is required')
    .not()
    .isEmpty(),
    check('from','from date is required')
    .not()
    .isEmpty()]

], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,      
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,      
        current,
        description
    }

    try{
        const profile = await Profile.findOne({user: req.user.id});

        profile.education.unshift(newEdu);

        await profile.save()

        res.json(profile);
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
});

//@route        delete     api/profile/experience/:exp_id
//@description  delete experience from profile
//@accress      private 
router.delete('/education/:edu_id', auth, async(req,res) => {
    try {

        const profile = await Profile.findOne({user: req.user.id});

        //get remove index 
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

        profile.education.splice(removeIndex, 1);

        await profile.save()

        res.json(profile)

    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//@route        get     api/profile/github/:username
//@description  get user repos from github
//@accress      public
router.get('/github/:username', async (req,res) => {
    try {

        
        const options = {
            uri: `https://api.github.com/users/${req.params.username
        }/repos?per_page=5&sort=created:asc&client_id=${config['githubClientId']}&client_secret=${config['githubSecret']}`,
        method:'GET',
        headers: {'user-agent': 'node.js'}

        };

        request(options, (error, response, body) => {
            if(error)   console.error(error.message)

            if(response.statusCode !== 200){
                res.status(404).json({msg:"no github profile"})
            }

            res.json(JSON.parse(body));
        })
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
}) 



module.exports = router;