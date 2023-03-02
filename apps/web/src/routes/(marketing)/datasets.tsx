import { Button, TextField } from "@kobalte/core";
import { UploadFile } from "@solid-primitives/upload";
import { createSignal, onMount, Show, useContext } from "solid-js";
import { createRouteAction, createRouteData, refetchRouteData, useRouteData } from "solid-start";
import DatasetTable from "~/components/data/DatasetTable";
import Icon from "~/components/Icon";
import Dropzone from "~/components/inputs/Dropzone";
import SelectInput from "~/components/inputs/Select";
import {
    vectorstoreCreate,
    VectorstoreCreateRequest,
    vectorstoreFindMany
} from "~/lib/services/api-v1/api";
import { cn } from "~/lib/utils/styles";
import { EmbeddingsType, embeddingsValidator } from "~/lib/validators/Embeddings";
import { VectorDbType, vectorDbValidator } from "~/lib/validators/VectorStore";
import { SettingsContext } from "~/routes/(marketing)";

export const routeData = () => {
    return createRouteData(() => vectorstoreFindMany({}), { key: ["vectorstoreFindMany"] });
};
vectorstoreFindMany;

const Datasets = () => {
    const [, { setLayout }] = useContext(SettingsContext);
    onMount(() => setLayout("scroll"));

    const datasets = useRouteData<typeof routeData>();
    const [vectorstoreName, setVectorstoreName] = createSignal("");
    const [vectorstoreDescription, setVectorstoreDescription] = createSignal("");
    const [vectorstoreDb, setVectorstoreDb] = createSignal<VectorDbType>("chroma");
    const [embeddings, setEmbeddings] = createSignal<EmbeddingsType>("huggingface_instruct");
    const [files, setFiles] = createSignal<UploadFile[]>([]);

    const [submitting, createVectorstore] = createRouteAction(
        async (formData: VectorstoreCreateRequest) => {
            const response = vectorstoreCreate(formData);
            return response;
        }
    );

    const handleUpload = async () => {
        await createVectorstore({
            name: vectorstoreName() || new Date().toLocaleDateString(),
            description: vectorstoreDescription() || "",
            vectorDbType: vectorstoreDb(),
            embeddingsType: embeddings(),
            files: files().map(f => f.file)
        });
        await refetchRouteData(["vectorstoreFindMany"]);
        setFiles([]);
    };

    return (
        <main class="flex h-full w-full flex-1 flex-col items-center justify-center">
            <section class="flex h-full w-full max-w-4xl flex-1 flex-col items-start justify-between px-4">
                <h1 class="my-16 text-4xl font-thin uppercase sm:text-5xl">Datasets</h1>
                <div class="grid h-full w-full flex-1 grid-cols-1 sm:grid-cols-3">
                    <div class="flex flex-col sm:col-span-1">
                        <TextField.Root
                            class="relative mr-4"
                            value={vectorstoreName()}
                            onValueChange={setVectorstoreName}
                        >
                            <TextField.Label class="mb-1 mr-1 text-sm opacity-80">
                                Vectorstore Name
                            </TextField.Label>
                            <TextField.TextArea
                                class={cn(
                                    "flex h-full w-full select-none resize-none text-base-content transition placeholder:text-base-content/80",
                                    "mb-2 rounded-md border border-base-300 bg-base-200 p-2 outline-none ring-base-300 ring-offset-1 ring-offset-base-100 focus:ring-2 focus:ring-offset-2",
                                    "disabled:cursor-not-allowed disabled:opacity-50"
                                )}
                                placeholder="Vectorstore Name"
                                rows={1}
                                autoResize
                            />
                        </TextField.Root>
                        <TextField.Root
                            class="relative mr-4"
                            value={vectorstoreDescription()}
                            onValueChange={setVectorstoreDescription}
                        >
                            <TextField.Label class="mb-1 mr-1 text-sm opacity-80">
                                Vectorstore Description
                            </TextField.Label>
                            <TextField.TextArea
                                class={cn(
                                    "flex h-full w-full select-none resize-none text-base-content transition placeholder:text-base-content/80",
                                    "mb-2 rounded-md border border-base-300 bg-base-200 p-2 outline-none ring-base-300 ring-offset-1 ring-offset-base-100 focus:ring-2 focus:ring-offset-2",
                                    "disabled:cursor-not-allowed disabled:opacity-50"
                                )}
                                placeholder="Vectorstore Description"
                                rows={1}
                                autoResize
                            />
                        </TextField.Root>
                        <SelectInput
                            class="mb-2 w-48"
                            options={Object.values(vectorDbValidator.Values).map(value => ({
                                value
                            }))}
                            label="Vectorstore DB"
                            placeholder="Vectorstore"
                            initialValue={vectorstoreDb()}
                            onValueChange={option => setVectorstoreDb(option.value)}
                        />
                        <SelectInput
                            class="mb-2 w-48"
                            options={Object.values(embeddingsValidator.Values).map(value => ({
                                value
                            }))}
                            label="Embeddings"
                            placeholder="Embeddings"
                            initialValue={embeddings()}
                            onValueChange={option => setEmbeddings(option.value)}
                        />
                    </div>
                    <div class="sm:col-span-2">
                        <Dropzone class="h-96" files={files()} onDrop={setFiles} />
                        <Button.Root
                            class={cn(
                                "ml-4 mt-4 flex items-center justify-center rounded-md border border-secondary px-2 py-1 text-secondary opacity-80 transition hover:opacity-100"
                            )}
                            onClick={handleUpload}
                        >
                            <span class="mr-1">Create</span>
                            <Show
                                when={!submitting.pending}
                                fallback={<Icon.VsLoading class="h-6 w-6 animate-spin" />}
                            >
                                <Icon.VsCloudUpload class="h-6 w-6" />
                            </Show>
                        </Button.Root>
                    </div>
                    <div class="mt-16 flex flex-col sm:col-span-3">
                        <h1 class="text-3xl font-thin uppercase sm:text-4xl">Vectorstores</h1>
                        <DatasetTable class="my-2" data={datasets()} />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Datasets;
