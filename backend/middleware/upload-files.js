import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { User } from "../models";
import storage from "../helpers/firebase";
import { createPostValidation, updatePostValidation } from "../validator/post";

const uploadFiles = async (req, res, next) => {
    try {
        if (req.method == "POST" && req.baseUrl == "/post" && req.route.path == "/") {
            const { error } = createPostValidation.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
        }

        if (req.method == "PUT" && req.baseUrl == "/post" && req.route.path == "/:postId") {
            const { error } = updatePostValidation.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

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

            const imageRef = ref(
                storage,
                `${req.baseUrl.substring(1)}/${Date.now()}-${originalname}`
            );
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
