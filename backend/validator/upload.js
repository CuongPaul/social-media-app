import { Joi } from "express-validation";

const uploadImagesValidation = {
    body: Joi.object({
        folder: Joi.string().required().trim(),
    }),
};

export { uploadImagesValidation };
