const Joi = require("joi");
const { number } = require("joi");

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});

module.exports.vendorSchema = Joi.object({
  name: Joi.any(),
});

module.exports.producerSchema = Joi.object({
  name: Joi.string().allow(""),
});
module.exports.teaSchema = Joi.object({
  name: Joi.string().required(),
  vendor: Joi.any(),
  producer: Joi.any(),
  description: Joi.string().allow(""),
  type: Joi.string().required(),
  year: Joi.any(),
  region: Joi.string().allow(""),
  village: Joi.string().allow(""),
  ageing_location: Joi.string().allow(""),
  ageing_conditions: Joi.string().allow(""),
  shape: Joi.string().allow(""),
});
