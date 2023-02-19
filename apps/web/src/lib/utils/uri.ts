export const isExternal = (url: string) => {
    return !(url.startsWith("/") || url.startsWith("#"));
};
