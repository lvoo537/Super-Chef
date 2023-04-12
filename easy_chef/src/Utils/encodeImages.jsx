/**
 * Handle file upload by first encoding the image from event as
 * base64 string, then adding said string as value for ingredientImage
 * key in rows and ingredients states.
 * @param event
 * @param setImageCount state callback function for setting # of images selected (string)
 * @param setImagesEncoded state callback function for writing list of encodings (array of strings)
 */
const encodeImages = (event, setImageCount, setImagesEncoded) => {
    const files = Array.from(event.target.files);
    const numSelected = `${files.length} Files Selected`;
    setImageCount(numSelected);

    for (let file of files) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setImagesEncoded((prevState) => [...prevState, base64String]);
        };
        reader.readAsDataURL(file);
    }
};

export default encodeImages;
