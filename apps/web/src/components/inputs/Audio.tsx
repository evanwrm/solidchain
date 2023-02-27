import { Button } from "@kobalte/core";
import { createMicrophones } from "@solid-primitives/devices";
import { IMediaRecorder } from "extendable-media-recorder";
import { createEffect, createSignal, mergeProps, Show } from "solid-js";
import Icon from "~/components/Icon";
import { blobToDataUrl } from "~/lib/utils/encoding";
import { cn } from "~/lib/utils/styles";

interface Props {
    class?: string;
    iconClass?: string;
    label?: string;
    onValueChange?: (value: File) => void;
}

const AudioInput = (props: Props) => {
    props = mergeProps({ label: "Record Microphone" }, props);

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
        <>
            <Button.Root
                class={cn(props.class, recording() ? "text-error" : "text-base-content")}
                onClick={toggleRecording}
            >
                <Show when={props.label}>
                    <span class="mr-1 text-sm">{props.label}</span>
                </Show>
                <Icon.HiOutlineMicrophone class={cn(props.iconClass, "h-4 w-4")} />
            </Button.Root>
            <audio class="mt-1" src={audioUrl()} preload="metadata" controls={false} />
        </>
    );
};

export default AudioInput;
