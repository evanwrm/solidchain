import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import ChatArea, { ChatDisplayType } from "~/components/inputs/ChatArea";
import SelectInput from "~/components/inputs/Select";
import { ChatMessage } from "~/lib/validators/ChatMessage";

export default function Home() {
    const [messages, setMessages] = createStore<ChatMessage[]>([]);
    const [displayType, setDisplayType] = createSignal<ChatDisplayType>("raw");

    const handleMessage = (message: ChatMessage) => {
        setMessages(messages => [...messages, message]);
    };

    return (
        <main class="h-full w-full p-4">
            <section class="flex flex-col items-center justify-center">
                <h1 class="my-16 text-5xl font-thin uppercase sm:text-6xl">SolidChain</h1>
                <div class="flex">
                    <div>
                        <SelectInput
                            class="w-48"
                            options={[{ value: "raw" }, { value: "markdown" }]}
                            placeholder="Output type"
                            onValueChange={option =>
                                setDisplayType(option.value as ChatDisplayType)
                            }
                        />
                    </div>
                    <ChatArea
                        class="w-96"
                        messages={messages}
                        onMessage={handleMessage}
                        displayType={displayType()}
                    />
                </div>
            </section>
        </main>
    );
}
