import storage from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const uploadImages = async ({files, folder}) => {
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
};

export default uploadImages;
