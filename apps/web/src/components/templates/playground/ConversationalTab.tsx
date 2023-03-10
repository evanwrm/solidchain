import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import { createRouteAction } from "solid-start";
import Typing from "~/components/animation/Typing";
import ChatArea, { ChatDisplayType } from "~/components/inputs/ChatArea";
import SelectInput from "~/components/inputs/Select";
import Slider from "~/components/inputs/Slider";
import { causalLMConversational, CausalLMConversationalRequest } from "~/lib/services/api-v1/api";
import { createStorageSignal } from "~/lib/utils/storage";
import { ChatMessage } from "~/lib/validators/ChatMessage";
import { CausalModel, causalModelValidator } from "~/lib/validators/TextGeneration";

const [messages, setMessages] = createStore<ChatMessage[]>([]);
const Conversational = () => {
    const [displayType, setDisplayType] = createStorageSignal<ChatDisplayType>(
        "solidchain.conversational.displayType",
        "raw"
    );
    const [model, setModel] = createStorageSignal<CausalModel | undefined>(
        "solidchain.conversational.modelName",
        undefined
    );
    const [temperature, setTemperature] = createStorageSignal<number>(
        "solidchain.conversational.temperature",
        0.7
    );
    const [maxTokens, setMaxTokens] = createStorageSignal<number>(
        "solidchain.conversational.maxTokens",
        1024
    );

    const [submitting, generate] = createRouteAction(
        async (formData: CausalLMConversationalRequest) => {
            const response = causalLMConversational(formData);
            return response;
        }
    );

    const handleMessage = (message: ChatMessage) => {
        if (submitting.pending) return;
        setMessages(messages => [...messages, message]);
        generate({
            text: message.content,
            modelName: model(),
            temperature: temperature()
        }).then(response => {
            setMessages(messages => [
                ...messages,
                {
                    content: response.text,
                    userId: "bot",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ]);
        });
    };

    return (
        <div class="h-full w-full overflow-hidden p-4">
            <div class="grid h-full w-full flex-1 auto-cols-auto grid-cols-1 sm:grid-cols-3">
                <div class="flex h-full w-full flex-col items-start justify-start">
                    <h1 class="my-8 text-4xl font-thin uppercase sm:text-5xl">Conversational</h1>
                    <SelectInput
                        class="mb-2 w-48"
                        options={[{ value: "raw" }, { value: "markdown" }]}
                        label="Output type"
                        placeholder="Output type"
                        initialValue={displayType()}
                        onValueChange={option => setDisplayType(option.value)}
                    />
                    <SelectInput
                        class="mb-2 w-48"
                        options={Object.values(causalModelValidator.Values).map(value => ({
                            value
                        }))}
                        label="Model"
                        placeholder="Model"
                        initialValue={model()}
                        onValueChange={option => setModel(option.value)}
                    />
                    <Slider
                        value={temperature()}
                        min={0}
                        max={1}
                        step={0.01}
                        label="Temperature"
                        onValueChange={value => setTemperature(value)}
                    />
                    <Slider
                        value={maxTokens()}
                        min={0}
                        max={4096}
                        step={32}
                        label="Max Tokens"
                        onValueChange={value => setMaxTokens(value)}
                    />
                </div>
                <div class="col-span-2 flex h-full w-full flex-col items-start justify-center overflow-hidden">
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
        </div>
    );
};

export default Conversational;
