import {} from "@kobalte/core";
import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import { createRouteAction } from "solid-start";
import Typing from "~/components/animation/Typing";
import ChatArea, { ChatDisplayType } from "~/components/inputs/ChatArea";
import MultiSelectInput from "~/components/inputs/MultiSelect";
import SelectInput from "~/components/inputs/Select";
import Slider from "~/components/inputs/Slider";
import NavTabs from "~/components/navigation/Tabs";
import { causalLMGenerate, CausalLMGenerateRequest } from "~/lib/services/api-v1/api";
import { createStorageSignal } from "~/lib/utils/storage";
import { Agent, agentsValidator, AgentTool, agentToolsValidator } from "~/lib/validators/Agents";
import { ChatMessage } from "~/lib/validators/ChatMessage";
import { CausalModel, causalModelValidator } from "~/lib/validators/TextGeneration";

const Home = () => {
    const [messages, setMessages] = createStore<ChatMessage[]>([]);
    const [displayType, setDisplayType] = createStorageSignal<ChatDisplayType>(
        "solidchain.displayType",
        "raw"
    );
    const [model, setModel] = createStorageSignal<CausalModel | undefined>(
        "solidchain.modelName",
        undefined
    );
    const [temperature, setTemperature] = createStorageSignal<number>(
        "solidchain.temperature",
        0.7
    );
    const [agent, setAgent] = createStorageSignal<Agent | undefined>("solidchain.agent", undefined);
    const [tools, setTools] = createStorageSignal<AgentTool[]>("solidchain.agentTools", [
        "serpapi",
        "llm-math"
    ]);

    const [submitting, generate] = createRouteAction(async (formData: CausalLMGenerateRequest) => {
        const response = causalLMGenerate(formData);
        return response;
    });

    const handleMessage = (message: ChatMessage) => {
        if (submitting.pending) return;
        setMessages(messages => [...messages, message]);
        generate({
            text: message.content,
            modelName: model(),
            agent: agent(),
            agentTools: tools()
        }).then(response => {
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
        <main class="flex h-full w-full flex-1 flex-col items-center justify-center">
            <section class="flex h-full w-full flex-1 flex-col items-start justify-between px-4">
                <NavTabs
                    class="mt-2 h-full w-full"
                    tabs={[
                        { value: "generation", label: "Generation" },
                        { value: "qa", label: "Q/A" },
                        { value: "summarization", label: "Summarization" },
                        { value: "conversational", label: "Conversational" }
                    ]}
                >
                    <div class="max-w-4xl p-4">
                        <h1 class="my-16 text-4xl font-thin uppercase sm:text-5xl">Generation</h1>
                    </div>
                    <div class="max-w-4xl p-4">
                        <h1 class="my-16 text-4xl font-thin uppercase sm:text-5xl">Q/A</h1>
                    </div>
                    <div class="max-w-4xl p-4">
                        <h1 class="my-16 text-4xl font-thin uppercase sm:text-5xl">
                            Summarization
                        </h1>
                    </div>
                    <div class="max-w-4xl p-4">
                        <h1 class="my-16 text-4xl font-thin uppercase sm:text-5xl">
                            Conversational
                        </h1>
                    </div>
                </NavTabs>
                <div class="grid h-full w-full flex-1 auto-cols-auto grid-cols-1 sm:grid-cols-3">
                    <div class="flex h-full w-full flex-col items-start justify-start p-2">
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
                        <SelectInput
                            class="mb-2 w-48"
                            options={Object.values(agentsValidator.Values).map(value => ({
                                value
                            }))}
                            label="Agent"
                            placeholder="Agent"
                            initialValue={agent()}
                            onValueChange={option => setAgent(option.value)}
                        />
                        <MultiSelectInput
                            class="mb-2 w-48"
                            options={Object.values(agentToolsValidator.Values).map(value => ({
                                value
                            }))}
                            label="Tools"
                            placeholder="Tools"
                            initialValues={tools()}
                            onValueChange={options => setTools(options.map(option => option.value))}
                        />
                        <Slider
                            value={temperature()}
                            min={0}
                            max={1}
                            step={0.01}
                            label="Temperature"
                            onValueChange={value => setTemperature(value)}
                        />
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
};

export default Home;
