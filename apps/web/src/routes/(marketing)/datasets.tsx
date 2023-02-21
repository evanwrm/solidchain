import Dropzone from "~/components/inputs/Dropzone";

export default function Datasets() {
    return (
        <main class="h-full w-full p-4">
            <section class="flex flex-col items-center justify-center">
                <h1 class="my-16 text-5xl font-thin uppercase sm:text-6xl">Dataset Page</h1>
                <Dropzone class="h-72 w-96" />
            </section>
        </main>
    );
}
