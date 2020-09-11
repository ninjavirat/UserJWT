require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const { User } = require('./models/user')
const { celebrate, Joi, errors, Segments } = require('celebrate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var port = process.env.PORT || 3001;
const authSchemas = require('./schemas/auth');
const auth = require('./middleware/auth');

const server = express()
server.use(cors())
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

const genericHandler = (req, res) => {
    res.json({
        status: 'success',
        data: req.body
    });
};

server.get('/', genericHandler)


//Create user account
server.post('/api/v1/register', celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().required()
    })
}), async (req, res) => {
    //Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        console.log("password", req.body.password)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log("hashedpassword", hashedPassword)
        //Insert the new user if they do not exist yet
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            // password:req.body.password
            password: hashedPassword
        });


        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.send({ value: { token } });
    }
});

const loginDao = (email, password) => {
    return new Promise(async (resolve, reject) => {
        let user = await User.findOne({ email });
        if (!user) {
            reject(new Error('Incorrect email or password'))
            // return res.status(404).send('Incorrect email or password');
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            reject(new Error('Incorrect email or password.'))
            // return res.status(400).send('Incorrect email or password.');
        }
        resolve(user)
    })
}

const loginController = async (req, res) => {
    //Check if this user already exisits
    const user = await loginDao(req.body.email, req.body.password)
    // console.log("User", user)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '365d'
    });
    if (user) {
        return res.json({ value: { token } })
    } else {
        return res.status(400).json({
            error: err.details[0].message
        })
    }

};

// //User Login 
server.post('/api/v1/login', [celebrate(authSchemas.loginSchema)], loginController);




server.get('/api/v1/profile',auth,async(req,res)=>{
   userID=req.user;
   let user = await User.findOne({ _id:userID });
        if (!user) {
            return res.status(404).send('User does not exists');
            
        }else{
            res.send(user)
        }
    //res.json(user)


});



server.use(errors());
server.listen(port, () => {
    console.log(`server is running at port:${port}`)
});

