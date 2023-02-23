import { Button } from "@kobalte/core";
import { createSignal, Show } from "solid-js";
import { createRouteAction, createRouteData, useRouteData } from "solid-start";
import DatasetTable from "~/components/data/DatasetTable";
import Icon from "~/components/Icon";
import Dropzone from "~/components/inputs/Dropzone";
import {
    vectorstoreCreate,
    VectorstoreCreateRequest,
    vectorstoreFindMany
} from "~/lib/services/api-v1/api";
import { cn } from "~/lib/utils/styles";

export const routeData = () => {
    return createRouteData(() => vectorstoreFindMany({}), { key: ["vectorstoreFindMany"] });
};
vectorstoreFindMany;

const Datasets = () => {
    const datasets = useRouteData<typeof routeData>();
    const [files, setFiles] = createSignal([]);

    const [submitting, createVectorstore] = createRouteAction(
        async (formData: VectorstoreCreateRequest) => {
            const response = vectorstoreCreate(formData);
            return response;
        }
    );

    const handleUpload = async () => {
        await createVectorstore({ name: new Date().toLocaleDateString(), files: files() });
    };

    return (
        <main class="flex h-full w-full max-w-4xl flex-1 flex-col items-center justify-center">
            <section class="flex h-full w-full flex-1 flex-col items-start justify-between px-4">
                <h1 class="my-16 text-4xl font-thin uppercase sm:text-5xl">Datasets</h1>
                <div class="grid h-full w-full flex-1 auto-cols-auto grid-cols-1 sm:grid-cols-3">
                    <div class="col-span-2">
                        <Dropzone class="h-96" onDrop={setFiles} />
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
                    <div class="col-span-3">
                        <DatasetTable data={datasets()} />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Datasets;
