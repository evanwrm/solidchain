import { createSignal, onMount, useContext } from "solid-js";
import NavTabs from "~/components/navigation/Tabs";
import ConversationalTab from "~/components/templates/playground/ConversationalTab";
import GenerationTab from "~/components/templates/playground/GenerationTab";
import QATab from "~/components/templates/playground/QATab";
import SummarizationTab from "~/components/templates/playground/SummarizationTab";
import { SettingsContext } from "~/routes/(marketing)";

const tabs = [
    { value: "generation", label: "Generation", content: GenerationTab },
    { value: "qa", label: "Q/A", content: QATab },
    {
        value: "summarization",
        label: "Summarization",
        content: SummarizationTab
    },
    {
        value: "conversational",
        label: "Conversational",
        content: ConversationalTab
    }
    // {
    //     value: "flow",
    //     label: "Flow",
    //     content: FlowTab
    // }
];

const [selectedTab, setSelectedTab] = createSignal(tabs[0].value);
const Home = () => {
    const [, { setLayout }] = useContext(SettingsContext);
    onMount(() => setLayout("workspace"));

    return (
        <main class="flex h-full w-full flex-1 flex-col items-center justify-center overflow-hidden">
            <section class="flex h-full w-full flex-1 flex-col items-start justify-between overflow-hidden px-4">
                <NavTabs
                    class="mt-2 flex h-full w-full flex-1 flex-col overflow-hidden"
                    tabs={tabs}
                    selectedTab={selectedTab()}
                    onTabChange={setSelectedTab}
                />
            </section>
        </main>
    );
};

export default Home;
