import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import storage from "../config/firebase";

const uploadImagesController = async (req, res) => {
    const { folder } = req.body;
    const { files, user_id } = req;

    if (!files?.length) {
        return res.json({ message: "No files have been uploaded" });
    }

    try {
        const imagesUrl = [];

        for (const file of files) {
            const { buffer, mimetype, originalname } = file;
            const metatype = { name: originalname, contentType: mimetype };

            const imageRef = ref(storage, `${folder}/${originalname}`);
            await uploadBytes(imageRef, buffer, metatype);

            const url = await getDownloadURL(imageRef);
            imagesUrl.push(url);
        }

        return res.status(200).json({ message: "success", data: { user_id, images: imagesUrl } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export { uploadImagesController };
