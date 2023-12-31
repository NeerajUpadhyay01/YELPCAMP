const BaseJoi = require("joi"); //JOI Package for Schema Validations  //we can define our own extensions
const SanitizeHtml = require("sanitize-html");

const Joi = BaseJoi.extend((joi) => {
  //create an extension to prohibit Code Injection
  return {
    type: "string",
    base: joi.string(),
    messages: {
      "string.htmlStrip": "{{ #label }} must not include HTML!",
    },
    rules: {
      htmlStrip: {
        validate(value, helpers) {
          const clean = SanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {},
          });
          if (clean !== value) {
            return helpers.error("string.htmlStrip", { value });
          }
          return clean;
        },
      },
    },
  };
});

module.exports.campgroundSchema = Joi.object({
  //JOI Schema Validations
  campground: Joi.object({
    title: Joi.string().required().htmlStrip(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    location: Joi.string().required().htmlStrip(),
    description: Joi.string().required().htmlStrip(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().htmlStrip(),
  }).required(),
});
