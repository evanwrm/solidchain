import { Button } from "@kobalte/core";
import { createDropzone, createFileUploader, UploadFile } from "@solid-primitives/upload";
import { createMemo, createSignal, For, Match, mergeProps, Show, Switch } from "solid-js";
import Icon, { getIconAliased } from "~/components/Icon";
import NavLink from "~/components/navigation/NavLink";
import { formatBytes } from "~/lib/utils/string";
import { cn } from "~/lib/utils/styles";

interface Props {
    multiple?: boolean;
    accept?: string;
    displayUploads?: boolean;
    class?: string;
    onDrop?: (files: File[]) => void;
}

const Dropzone = (props: Props) => {
    props = mergeProps({ accept: ".pdf,.txt", multiple: true, displayUploads: true }, props);

    const [isDragging, setIsDragging] = createSignal(false);
    const {
        selectFiles,
        files: selectedFiles,
        clearFiles: clearSelectedFiles
    } = createFileUploader({
        multiple: props.multiple,
        accept: props.accept
    });
    const {
        setRef: dropzoneRef,
        files: droppedFiles,
        clearFiles: clearDroppedFiles
    } = createDropzone({
        onDragEnter: () => {
            setIsDragging(true);
        },
        onDragLeave: () => {
            setIsDragging(false);
        },
        onDragEnd: () => {
            setIsDragging(false);
        }
    });
    const files = createMemo(() => [...selectedFiles(), ...droppedFiles()]);

    const handleFileUpload = async (files: UploadFile[]) => {
        const rawFiles = files.map(f => f.file);
        props.onDrop?.(rawFiles);
        // await indexCreate({ files: rawFiles });
    };
    const handleClearFiles = () => {
        clearSelectedFiles();
        clearDroppedFiles();
    };

    return (
        <div class={cn("flex max-w-full flex-col p-2", props.class)}>
            <div
                class={cn(
                    "h-full w-full rounded-md bg-base-200 outline-dashed outline-2 outline-offset-2 outline-base-300 transition-all duration-300 hover:bg-opacity-100",
                    isDragging()
                        ? "bg-opacity-100 outline-base-200"
                        : "bg-opacity-60 outline-base-300"
                )}
                ref={dropzoneRef}
            >
                <div
                    class="flex h-full w-full cursor-pointer flex-col items-center justify-center"
                    onClick={() => selectFiles(handleFileUpload)}
                >
                    <div class="pointer-events-none flex select-none flex-col items-center justify-center">
                        <span class="text-lg">Upload Files</span>
                        <span class="pb-4 text-sm opacity-60">{props.accept}</span>
                        <Icon.HiOutlineUpload class="h-6 w-6" />
                    </div>
                </div>
            </div>
            <Show when={props.displayUploads}>
                <Switch>
                    <Match when={files().length === 0}>
                        <div class="mt-2">
                            <div class="p-2">No files selected.</div>
                        </div>
                    </Match>
                    <Match when={files().length > 0}>
                        <div class="mt-2">
                            <div class="flex items-center justify-between p-2">
                                <span>{files().length} file(s) selected.</span>
                                <Button.Root
                                    class="rounded-md border border-error px-2 py-1 text-error opacity-80"
                                    onClick={handleClearFiles}
                                >
                                    Clear files
                                </Button.Root>
                            </div>
                            <For each={files()}>
                                {file => {
                                    const FileIcon =
                                        getIconAliased(file.name.split(".").pop() ?? "") ??
                                        Icon.HiOutlineDocument;
                                    return (
                                        <div class="flex flex-row justify-between px-2 py-0.5">
                                            <FileIcon class="h-6 w-6" />
                                            <div class="relative ml-2 flex flex-1 justify-end overflow-hidden">
                                                <div class="absolute h-full w-1/6 bg-gradient-to-l from-base-100" />
                                                <NavLink
                                                    href={file.source}
                                                    class="w-full text-left font-semibold"
                                                >
                                                    {file.name}
                                                </NavLink>
                                            </div>
                                            <span class="ml-2 italic">
                                                {formatBytes(file.size)}
                                            </span>
                                        </div>
                                    );
                                }}
                            </For>
                        </div>
                    </Match>
                </Switch>
            </Show>
        </div>
    );
};

export default Dropzone;
