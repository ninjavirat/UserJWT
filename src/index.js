require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const { User } = require('./models/user')
const {Todo} = require('./models/Todo');
const { celebrate, Joi, errors, Segments } = require('celebrate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var port = process.env.PORT || 3001;
const authSchemas = require('./schemas/auth');
const auth = require('./middleware/auth');
const expressJwt = require('express-jwt')
Joi.objectId = require('joi-objectid')(Joi)

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
// server.post('/api/v1/register', celebrate({
//     [Segments.BODY]: Joi.object().keys({
//         name: Joi.string().min(5).max(50).required(),
//     })
// }), async (req, res) => {
//     const { authorization } = req.headers

//     if (!authorization)
//         throw new Error('Email and password invalid')

//     const credentials = authorization.split(' ')[1]

//     const [email, password] = Buffer.from(credentials, 'base64').toString().split(':')

//     //Check if this user already exisits
//     let user = await User.findOne({ email });
//     if (user) {
//         return res.status(400).send('That user already exisits!');
//     } else {
//         console.log("password", password)
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
//         console.log("hashedpassword", hashedPassword)
//         //Insert the new user if they do not exist yet
//         user = await User.create({
//             name: req.body.name,
//             email: email,
//             // password:req.body.password
//             password: hashedPassword
//         });


//         const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
//         res.send({ value: { token } });
//     }
// });




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
server.get('/api/v1/login', loginController);

const requireAuth = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
})


server.get('/api/v1/profile', requireAuth, async (req, res) => {
    console.log(req.user)
    try {

        userID = req.user;
        let user = await User.findOne({ _id: userID }).lean();
        if (!user) {
            return res.status(404).json({ type: 'info', message: 'User does not exists' });
        }
        const { password, ...rest } = user
        const userObj = Object.assign({}, { ...rest })
        res.status(200).json(userObj)
    } catch (err) {
        res.status(400).json({ type: 'error', message: err.message })
    }

});


//create an Todo list
server.post('/api/v1/create_todo',requireAuth, async (req, res) => {
    //Check if this user already exisits
        
     const  user = await Todo.create({
            title: req.body.title,
            uid: req.body.id
        });

    if(!user){
        return res.status(404).json({ type: 'info', message: 'User does not exists' });
    }

        res.json({ user });
    }
);

//Todo App
server.get('/api/v1/todo', requireAuth, async (req, res) => {
    try {
        let TodoList = await Todo.find();
        if (!TodoList) {
            return res.status(404).json({ type: 'info', message: 'Todo does not exists' });
        }
        console.log(TodoList);
        res.status(200).json(TodoList)
    } catch (err) {
        res.status(400).json({ type: 'error', message: err.message })
    }

});



//Todo App
server.put('/api/v1/todo/:id', requireAuth, async (req, res) => {
    const id =req.params.id;
    const newTitle = req.body.title;
    console.log('id',id);
    console.log('newTitle',newTitle);
    try {
        let TodoListItem = await Todo.updateOne({_id:id},{$set:{title:newTitle}});
        if (!TodoListItem) {
            return res.status(404).json({ type: 'info', message: 'TodoItem does not exists' });
        }

        console.log(TodoListItem);
        res.status(200).json(TodoListItem)
    } catch (err) {
        res.status(400).json({ type: 'error', message: err.message })
    }

});




//Todo App
server.delete('/api/v1/todo/:id', requireAuth, async (req, res) => {
    const id =req.params.id;
    console.log('id',id);
    try {
        let TodoListItem = await Todo.deleteOne({_id:id});
        if (!TodoListItem) {
            return res.status(404).json({ type: 'info', message: 'TodoItem does not exists' });
        }

        console.log(TodoListItem);
        res.status(200).json(TodoListItem)
    } catch (err) {
        res.status(400).json({ type: 'error', message: err.message })
    }

});


server.use(errors());
server.listen(port, () => {
    console.log(`server is running at port:${port}`)
});

