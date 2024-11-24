import Joi from "joi";

const topUpTransactionValidation = Joi.object({
  email: Joi.string().max(50).required(),
  top_up_amount: Joi.number().min(0).required().messages({
    "any.required":
      "Parameter top_up_amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
    "number.empty":
      "Parameter top_up_amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
    "number.base":
      "Parameter top_up_amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
    "number.min":
      "Parameter top_up_amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
  }),
});

const purchaseTransactionValidation = Joi.object({
  email: Joi.string().max(50).required(),
  service_code: Joi.string().required().messages({
    "any.required": "Parameter service_code harus di isi",
    "string.empty": "Parameter service_code harus di isi",
  }),
});

export { topUpTransactionValidation, purchaseTransactionValidation };
