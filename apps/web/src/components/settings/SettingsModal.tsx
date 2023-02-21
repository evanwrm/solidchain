import { Dialog } from "@kobalte/core";
import { Motion, Presence } from "@motionone/solid";
import { createSignal, Show } from "solid-js";
import Icon from "~/components/Icon";
import { fadePopVariants } from "~/lib/animation/variants";
import { cn } from "~/lib/utils/styles";

interface Props {
    class?: string;
}

const SettingsModal = (props: Props) => {
    const [open, setOpen] = createSignal(false);

    return (
        <Dialog.Root isOpen={open()} onOpenChange={setOpen} forceMount>
            <Dialog.Trigger class={cn("transition", props.class)}>
                <Icon.RiCommunicationChatSettingsLine class="h-6 w-6" />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Presence>
                    <Show when={open()}>
                        <Motion.div
                            class="fixed inset-0 z-50 flex items-center justify-center"
                            initial={fadePopVariants.hidden}
                            animate={fadePopVariants.visible}
                            exit={fadePopVariants.hidden}
                            transition={{ duration: 0.2 }}
                        >
                            <Dialog.Overlay class="fixed inset-0 z-0 flex items-center justify-center bg-base-100/40" />
                            <Dialog.Content class="z-10 max-w-full rounded-md border border-base-100 bg-base-200 p-4 shadow sm:max-w-lg">
                                <div class="mb-4 flex w-full items-center justify-between">
                                    <Dialog.Title class="text-xl font-bold">Settings</Dialog.Title>
                                    <Dialog.CloseButton
                                        class={
                                            "flex items-center justify-end opacity-80 transition hover:opacity-100"
                                        }
                                    >
                                        <Icon.HiSolidX class="h-6 w-6" />
                                    </Dialog.CloseButton>
                                </div>
                                <Dialog.Description class="prose">
                                    This is a web-based browser interface for searching with Large
                                    Language Models (LLMs). Built with{" "}
                                    <a href="https://www.solidjs.com/">SolidJS</a> and{" "}
                                    <a href="https://langchain.readthedocs.io/en/latest/">
                                        LangChain
                                    </a>
                                    , it allows you to index a collection of documents (such as
                                    markdown files, PDFs, webpages, chat logs, etc.) and search
                                    using a dialogue based Q/A using natural language. Methods such
                                    as chain of thought (CoT) reasoning, and agent based reasoning
                                    (e.g. MRKL & ReAct) can be used depending on the use case.
                                </Dialog.Description>
                            </Dialog.Content>
                        </Motion.div>
                    </Show>
                </Presence>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default SettingsModal;
