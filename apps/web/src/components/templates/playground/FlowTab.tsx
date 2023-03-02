import { Edge, Node, SolidFlow } from "solid-flow";
import { createSignal, Show } from "solid-js";
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

const initialNodes = [
    {
        id: "node-1",
        position: { x: 50, y: 100 },
        data: {
            content: <p>This is a simple node</p>
        },
        inputs: 0,
        outputs: 1
    },
    {
        id: "node-2",
        position: { x: 350, y: 100 },
        data: {
            label: "Node with label",
            content: <p>This is a node with a label</p>
        },
        inputs: 1,
        outputs: 1
    },
    {
        id: "node-3",
        position: { x: 350, y: 300 },
        data: {
            content: (
                <p style={{ width: "200px" }}>This is a node with two inputs and two outputs</p>
            )
        },
        inputs: 2,
        outputs: 2
    },

    {
        id: "node-4",
        position: { x: 700, y: 100 },
        data: {
            label: "Only inputs",
            content: <p>This is a node with only inputs</p>
        },
        inputs: 2,
        outputs: 0
    }
];
const initialEdges = [
    {
        id: "edge_0:0_1:0",
        sourceNode: "node-1",
        sourceOutput: 0,
        targetNode: "node-2",
        targetInput: 0
    },
    {
        id: "edge_0:0_2:0",
        sourceNode: "node-1",
        sourceOutput: 0,
        targetNode: "node-3",
        targetInput: 0
    },
    {
        id: "edge_1:0_3:0",
        sourceNode: "node-2",
        sourceOutput: 0,
        targetNode: "node-4",
        targetInput: 0
    },
    {
        id: "edge_2:0_3:1",
        sourceNode: "node-3",
        sourceOutput: 0,
        targetNode: "node-4",
        targetInput: 1
    }
];

const [messages, setMessages] = createStore<ChatMessage[]>([]);
const Flow = () => {
    const [nodes, setNodes] = createSignal<Node[]>(initialNodes);
    const [edges, setEdges] = createSignal<Edge[]>(initialEdges);

    const [displayType, setDisplayType] = createStorageSignal<ChatDisplayType>(
        "solidchain.flow.displayType",
        "raw"
    );
    const [model, setModel] = createStorageSignal<CausalModel | undefined>(
        "solidchain.flow.modelName",
        undefined
    );
    const [temperature, setTemperature] = createStorageSignal<number>(
        "solidchain.flow.temperature",
        0.7
    );
    const [maxTokens, setMaxTokens] = createStorageSignal<number>(
        "solidchain.flow.maxTokens",
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
                    <h1 class="my-8 text-4xl font-thin uppercase sm:text-5xl">Flow</h1>
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
                    <SolidFlow
                        nodes={nodes()}
                        edges={edges()}
                        onNodesChange={(newNodes: Node[]) => {
                            setNodes(newNodes);
                        }}
                        onEdgesChange={(newEdges: Edge[]) => {
                            setEdges(newEdges);
                        }}
                    />
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

export default Flow;
