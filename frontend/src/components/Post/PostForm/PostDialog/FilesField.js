import React, { useRef, Fragment } from "react";
import { Tooltip, IconButton } from "@material-ui/core";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FilesField = ({ multipleUpload, setFilesUpload, setFilesPreview }) => {
    const fileRef = useRef();

    const handleClickUpload = (e) => {
        e.preventDefault();
        fileRef.current.click();
    };

    const handleChangeFile = (e) => {
        const { files } = e.target;
        if (multipleUpload) {
            setFilesUpload((preValue) => [...preValue, ...files]);

            for (const file of files) {
                const reader = new FileReader();

                reader.readAsDataURL(file);
                reader.onload = () => {
                    setFilesPreview((preValue) => [...preValue, reader.result]);
                };
            }
        } else {
            const formData = new FormData();
            formData.append("files", files[0]);
            formData.append("folder", "comment");
            setFilesUpload(formData);

            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = () => {
                setFilesPreview(reader.result);
            };
        }
        // if (multipleUpload) {
        //     setFilesUpload((preValue) => [...preValue, ...files]);

        //     for (const file of files) {
        //         const reader = new FileReader();

        //         reader.readAsDataURL(file);
        //         reader.onload = () => {
        //             setFilesPreview((preValue) => [...preValue, reader.result]);
        //         };
        //     }
        // } else {
        //     setFilesUpload(files[0]);

        //     const reader = new FileReader();

        //     reader.readAsDataURL(files[0]);
        //     reader.onload = () => {
        //         setFilesPreview(reader.result);
        //     };
        // }
    };

    return (
        <Fragment>
            <Tooltip arrow placement="bottom" title="Upload images from device">
                <IconButton onClick={handleClickUpload}>
                    <FontAwesomeIcon icon={faImage} color="rgb(73,189,99)" />
                </IconButton>
            </Tooltip>
            <input
                type="file"
                ref={fileRef}
                accept="image/*,video/*"
                multiple={multipleUpload}
                onChange={handleChangeFile}
                style={{ display: "none" }}
            />
        </Fragment>
    );
};

export default FilesField;
