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

export const encodeImage = (event, setImageEncoded) => {
    const files = Array.from(event.target.files);
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result;
        setImageEncoded(base64String);
    };
    reader.readAsDataURL(files[0]);
};

export const encodeImagesFromDb = (files) => {
    const promises = files.map(
        (file) =>
            new Promise((resolve, reject) => {
                const base64String = file; // replace with your base64 string
                const byteCharacters = atob(base64String);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                // const blob = new Blob([byteArray], { type: 'image/png' });
                const blob = new Blob([byteArray]);
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    reject(reader.error);
                };
            })
    );
    return Promise.all(promises);
};

export default encodeImages;
