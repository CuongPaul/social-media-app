import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import storage from "../config/firebase";

const uploadImagesController = async (req, res) => {
    const { files } = req;
    const { folder } = req.body;

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
    
        return imagesUrl;
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export { uploadImagesController };
