import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { User } from "../models";
import storage from "../config/firebase";
import { createPostValidation } from "../validator/post";

const uploadFiles = async (req, res, next) => {
    try {
        const { error } = createPostValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

    const { folder } = req.body;
    const { files, user_id } = req;

    try {
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(403).json({ message: "You don't have permission" });
        }

        const imagesUrl = [];

        for (const file of files) {
            const { buffer, mimetype, originalname } = file;
            const metatype = { name: originalname, contentType: mimetype };

            const imageRef = ref(storage, `${folder}/${originalname}`);
            await uploadBytes(imageRef, buffer, metatype);

            const url = await getDownloadURL(imageRef);
            imagesUrl.push(url);
        }

        req.body.images = imagesUrl;
        next();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export default uploadFiles;