import { Button } from "@kobalte/core";
import { createMicrophones } from "@solid-primitives/devices";
import { IMediaRecorder } from "extendable-media-recorder";
import { createEffect, createSignal } from "solid-js";
import Icon from "~/components/Icon";
import { blobToDataUrl } from "~/lib/utils/audio";
import { cn } from "~/lib/utils/styles";

interface Props {
    class?: string;
    onValueChange?: (value: File) => void;
}

const AudioInput = (props: Props) => {
    const microphones = createMicrophones();
    const [stream, setStream] = createSignal<MediaStream | undefined>(undefined);
    const [recorder, setRecorder] = createSignal<IMediaRecorder | undefined>(undefined);
    const [recording, setRecording] = createSignal(false);
    const [audioChunks, setAudioChunks] = createSignal<Blob[]>([]);
    const [audioUrl, setAudioUrl] = createSignal<string | undefined>(undefined);

    const handleRecord = async () => {
        const mediaStream = stream();
        if (!mediaStream) return;

        // lazy load the recorder
        const createRecorder = await import("~/lib/utils/audioRecorder").then(
            module => module.createRecorder
        );
        const recorder = await createRecorder(mediaStream);
        setRecorder(recorder);

        // listen for data (streaming), and stop events
        recorder.ondataavailable = event => {
            setAudioChunks(audioChunks => [...audioChunks, event.data]);
        };
        recorder.onstop = () => {
            setRecording(false);
            const blob = new Blob(audioChunks(), { type: "audio/wav" });
            const file = new File([blob], "record.wav", { type: "audio/wav" });
            blobToDataUrl(blob).then(setAudioUrl);
            props.onValueChange?.(file);
            setAudioChunks([]);
        };
        recorder.start();
    };

    createEffect(async () => {
        if (microphones().length <= 0) return;
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(stream => {
                setStream(stream);
            })
            .catch(error => {
                console.error(error);
            });
    });
    createEffect(async () => {
        if (recording()) handleRecord();
        else recorder()?.stop();
    });

    const toggleRecording = () => {
        setRecording(recording => !recording);
    };

    return (
        <div class={cn(props.class)}>
            <Button.Root
                class={cn(
                    "flex select-none items-center justify-center rounded-md px-2 pb-2 opacity-80 transition hover:opacity-100",
                    recording() ? "text-error" : "text-base-content"
                )}
                onClick={toggleRecording}
            >
                <span class="mr-1 text-sm">Record Microphone</span>
                <Icon.HiOutlineMicrophone class="h-4 w-4" />
            </Button.Root>
            <audio class="mt-1" src={audioUrl()} preload="metadata" controls={false} />
        </div>
    );
};

export default AudioInput;
