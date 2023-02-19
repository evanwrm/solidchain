export const formatBytes = (bytes: number, decimals: number = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const prefixes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const unit = Math.floor(Math.log(bytes) / Math.log(k));
    const scale = bytes / Math.pow(k, unit);
    const decimal = Math.max(decimals, 0);

    return `${scale.toFixed(decimal)}${prefixes[unit]}`;
};
