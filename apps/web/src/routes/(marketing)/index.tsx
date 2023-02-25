import NavTabs from "~/components/navigation/Tabs";
import ConversationalTab from "~/components/templates/playground/ConversationalTab";
import GenerationTab from "~/components/templates/playground/GenerationTab";
import QATab from "~/components/templates/playground/QATab";
import SummarizationTab from "~/components/templates/playground/SummarizationTab";

const Home = () => {
    return (
        <main class="flex h-full w-full flex-1 flex-col items-center justify-center">
            <section class="flex h-full w-full flex-1 flex-col items-start justify-between px-4">
                <NavTabs
                    class="mt-2 h-full w-full flex-1"
                    tabs={[
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
                    ]}
                />
            </section>
        </main>
    );
};

export default Home;
