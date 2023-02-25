import { MediaRecorder, register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";

let registered = false;

export const createRecorder = async (stream: MediaStream) => {
    if (!registered) {
        await register(await connect());
        registered = true;
    }
    const recorder = new MediaRecorder(stream, {
        mimeType: "audio/wav"
    });
    return recorder;
};
