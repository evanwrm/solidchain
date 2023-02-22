import NavLink from "~/components/navigation/NavLink";

export default function NotFound() {
    return (
        <div class="flex min-h-screen flex-col items-center justify-between overflow-clip bg-base-100 text-base-content transition">
            <main class="flex h-full w-full max-w-4xl flex-1 flex-col items-center justify-center">
                <section class="flex flex-col items-center justify-center px-4">
                    <h1 class="my-16 text-4xl font-thin uppercase sm:text-5xl">Not Found</h1>
                    <p class="my-4 flex items-center">
                        <span class="mr-2">Return</span>
                        <NavLink
                            href="/"
                            class="text-xl opacity-80 hover:underline hover:opacity-100"
                        >
                            Home
                        </NavLink>
                        ?
                    </p>
                </section>
            </main>
        </div>
    );
}
