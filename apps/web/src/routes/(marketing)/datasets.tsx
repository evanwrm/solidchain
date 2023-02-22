import Dropzone from "~/components/inputs/Dropzone";

export default function Datasets() {
    return (
        <main class="flex h-full w-full max-w-4xl flex-1 flex-col items-center justify-center">
            <section class="flex h-full w-full flex-1 flex-col items-start justify-between px-4">
                <h1 class="my-16 text-4xl font-thin uppercase sm:text-5xl">Datasets</h1>
                <div class="grid h-full w-full flex-1 auto-cols-auto grid-cols-1 sm:grid-cols-3">
                    <Dropzone class="col-span-3 h-96" />
                </div>
            </section>
        </main>
    );
}
