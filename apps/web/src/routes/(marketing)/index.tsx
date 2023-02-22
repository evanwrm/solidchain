import {} from "@kobalte/core";
import { createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { createRouteAction } from "solid-start";
import Typing from "~/components/animation/Typing";
import ChatArea, { ChatDisplayType } from "~/components/inputs/ChatArea";
import SelectInput from "~/components/inputs/Select";
import Slider from "~/components/inputs/Slider";
import { causalLMGenerate, CausalLMGenerateRequest } from "~/lib/services/api-v1/api";
import { ChatMessage } from "~/lib/validators/ChatMessage";
import { CausalModel, causalModelValidator } from "~/lib/validators/TextGeneration";

export default function Home() {
    const [messages, setMessages] = createStore<ChatMessage[]>([]);
    const [displayType, setDisplayType] = createSignal<ChatDisplayType>("raw");
    const [model, setModel] = createSignal<CausalModel | undefined>(undefined);

    const [submitting, generate] = createRouteAction(async (formData: CausalLMGenerateRequest) => {
        const response = causalLMGenerate(formData);
        return response;
    });

    const handleMessage = (message: ChatMessage) => {
        if (submitting.pending) return;
        setMessages(messages => [...messages, message]);
        generate({ text: message.content, modelName: model() }).then(response => {
            setMessages(messages => [
                ...messages,
                {
                    content: response.content,
                    userId: "bot",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ]);
        });
    };

    return (
        <main class="flex h-full w-full max-w-4xl flex-1 flex-col items-center justify-center">
            <section class="flex h-full w-full flex-1 flex-col items-start justify-between px-4">
                <h1 class="my-16 text-4xl font-thin uppercase sm:text-5xl">Causal LM</h1>
                <div class="grid h-full w-full flex-1 auto-cols-auto grid-cols-1 sm:grid-cols-3">
                    <div class="flex h-full w-full flex-col items-start justify-start p-2">
                        <SelectInput
                            class="mb-2 w-48"
                            options={[{ value: "raw" }, { value: "markdown" }]}
                            label="Output type"
                            placeholder="Output type"
                            onValueChange={option => setDisplayType(option.value)}
                        />
                        <SelectInput
                            class="mb-2 w-48"
                            options={Object.values(causalModelValidator.Values).map(value => ({
                                value
                            }))}
                            label="Model"
                            placeholder="Model"
                            onValueChange={option => setModel(option.value)}
                        />
                        <Slider value={0.7} min={0} max={1} step={0.01} label="Temperature" />
                    </div>
                    <div class="col-span-2 flex h-full w-full flex-col items-start justify-center p-2">
                        <ChatArea
                            class="flex h-full w-full flex-col"
                            chatContainerClass="h-full w-full"
                            messages={messages}
                            onMessage={handleMessage}
                            displayType={displayType()}
                        />
                        <Show when={submitting.pending}>
                            <Typing class="ml-4 mt-4" />
                        </Show>
                    </div>
                </div>
            </section>
        </main>
    );
}
