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
