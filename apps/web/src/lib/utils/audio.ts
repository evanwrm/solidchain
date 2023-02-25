export const blobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((fulfill, reject) => {
        let reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => fulfill(reader.result as string);
        reader.readAsDataURL(blob);
    });
};
