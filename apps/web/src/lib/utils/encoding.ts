export const blobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((fulfill, reject) => {
        let reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => fulfill(reader.result as string);
        reader.readAsDataURL(blob);
    });
};

export const Uint8ArrayToJSONArray = <T>(u8a: Uint8Array): T[] | null => {
    // use the browser compatible TextDecoder instead of Buffer
    let jsonString: string = "";
    try {
        jsonString = new TextDecoder("utf-8").decode(u8a);
        // hack to support streaming responses
        // TODO: find a better way to do this
        jsonString = jsonString.replace(/\}\{/g, "},{");
        return [JSON.parse(`[${jsonString}]`)];
    } catch (e) {
        console.error(e, jsonString);
        return null;
    }
};
