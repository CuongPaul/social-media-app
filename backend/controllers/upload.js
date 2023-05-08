import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { User } from "../models";
import storage from "../config/firebase";

const uploadImagesController = async (req, res) => {
    const { folder } = req.body;
    const { files, user_id } = req;

    if (!folder || !folder.trim()) {
        return res.status(400).json({ message: "Folder name is required" });
    }
    if (!files?.length) {
        return res.status(400).json({ message: "No files have been uploaded" });
    }

    try {
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(401).json({ message: "You don't have permission" });
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

        return res.status(200).json({ message: "success", data: { images: imagesUrl } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export { uploadImagesController };
