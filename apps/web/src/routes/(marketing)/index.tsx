import Dropzone from "~/components/inputs/Dropzone";

export default function Home() {
    return (
        <main class="h-full w-full p-4">
            <section class="flex flex-col items-center justify-center">
                <h1 class="my-16 text-6xl font-thin uppercase">SolidChain</h1>
                <Dropzone class="h-72 w-96" />
            </section>
        </main>
    );
}
