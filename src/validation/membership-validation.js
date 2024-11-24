import e from "express";
import Joi from "joi";

const registerMembershipValidation = Joi.object({
  email: Joi.string().max(50).required().messages({
    "any.required": "Parameter email harus di isi",
    "string.empty": "Parameter email harus di isi",
    "string.max": "Parameter email tidak sesuai format",
  }),
  password: Joi.string().max(100).min(8).required().messages({
    "any.required": "Parameter password harus di isi",
    "string.empty": "Parameter password harus di isi",
    "string.min": "Password length minimal 8 karakter",
  }),
  first_name: Joi.string().max(100).required().messages({
    "any.required": "Parameter first_name harus di isi",
    "string.empty": "Parameter first_name harus di isi",
    "string.max": "Parameter first_name maksimal 100 character",
  }),
  last_name: Joi.string().max(100).required().messages({
    "any.required": "Parameter end_name harus di isi",
    "string.empty": "Parameter end_name harus di isi",
    "string.max": "Parameter end_name maksimal 100 character",
  }),
});

const loginMembershipValidation = Joi.object({
  email: Joi.string().max(50).required().messages({
    "any.required": "Parameter email harus di isi",
    "string.empty": "Parameter email harus di isi",
    "string.max": "Parameter email tidak sesuai format",
  }),
  password: Joi.string().max(100).min(8).required().messages({
    "any.required": "Parameter password harus di isi",
    "string.empty": "Parameter password harus di isi",
    "string.min": "Password length minimal 8 karakter",
  }),
});

const updateMembershipValidation = Joi.object({
  email: Joi.string().max(50).required(),
  first_name: Joi.string().max(100).required().messages({
    "string.max": "Parameter first_name maksimal 100 character",
    "any.required": "Parameter first_name harus di isi",
  }),
  last_name: Joi.string().max(100).required().messages({
    "string.max": "Parameter end_name maksimal 100 character",
    "any.required": "Parameter end_name harus di isi",
  }),
});

export {
  registerMembershipValidation,
  loginMembershipValidation,
  updateMembershipValidation,
};
