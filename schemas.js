const Joi = require('joi');
const { number } = require('joi');



module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})

module.exports.teaSchema = Joi.object({
    tea: Joi.object({
        name: Joi.string().required(),
    description: Joi.string(),
    type: Joi.string().required(),
    year: Joi.number().min(1900),
    region: Joi.string(),
    village: Joi.string(),
    ageing_location: Joi.string(),
    ageing_conditions: Joi.string(),
    shape: Joi.string()
})
})