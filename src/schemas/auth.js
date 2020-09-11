const { Joi, Segments } = require('celebrate');
const loginSchema = {
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().required()
    })
}

module.exports = { loginSchema }