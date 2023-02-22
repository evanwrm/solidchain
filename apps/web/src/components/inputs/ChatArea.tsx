import { Button, TextField } from "@kobalte/core";
import { formatDistance } from "date-fns";
import { createMemo, createSignal, For, Match, mergeProps, Show, Switch } from "solid-js";
import Markdown from "~/components/mdx/Markdown";
import { cn } from "~/lib/utils/styles";
import { ChatMessage } from "~/lib/validators/ChatMessage";
import Icon from "../Icon";

export type ChatDisplayType = "raw" | "markdown";
interface Props {
    class?: string;
    chatContainerClass?: string;
    messages: ChatMessage[];
    displayType?: ChatDisplayType;
    refreshInterval?: number;
    disabled?: boolean;
    onMessage?: (message: ChatMessage) => void;
}

const ChatArea = (props: Props) => {
    props = mergeProps(
        { displayType: "raw" as ChatDisplayType, refreshInterval: 30 * 1000, disabled: false },
        props
    );
    const [value, setValue] = createSignal("");
    const [lastUpdated, setLastUpdated] = createSignal(new Date());
    const formattedTimestamps = createMemo(() =>
        props.messages.map(message => formatDistance(new Date(message.createdAt), lastUpdated()))
    );

    // rerender every 30 seconds
    setInterval(() => {
        setLastUpdated(new Date());
    }, props.refreshInterval);

    const handleEnter = () => {
        const content = value().trim();
        if (!content) return;
        setValue("");

        const now = new Date().toISOString();
        const message: ChatMessage = {
            userId: "user",
            content,
            createdAt: now,
            updatedAt: now
        };
        props.onMessage?.(message);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleEnter();
        }
    };

    return (
        <div class={cn(props.class)}>
            <div
                class={cn(
                    "scrollbar flex flex-col-reverse items-center overflow-clip overflow-y-auto px-2",
                    !props.messages.length && "justify-center",
                    props.chatContainerClass
                )}
            >
                <Show when={!props.messages.length}>
                    <p class="my-auto text-center font-semibold opacity-80">No messages yet</p>
                </Show>
                <For each={props.messages.slice().reverse()}>
                    {(message, i) => {
                        const isUser = message.userId === "user";
                        const messageClass = cn(
                            "[&>*]:scrollbar prose w-full rounded-lg p-2 px-3 text-base-content transition",
                            isUser ? "ml-auto bg-secondary/20" : "mr-auto bg-base-300/20"
                        );

                        return (
                            <div
                                class={cn(
                                    "group my-2 flex w-full items-center first:mb-8",
                                    isUser ? "justify-end" : "justify-start"
                                )}
                            >
                                <div class="flex w-full flex-col">
                                    <span class="mb-1 select-none text-xs opacity-0 transition-all group-hover:opacity-40">
                                        {formattedTimestamps()[props.messages.length - i() - 1]}
                                    </span>
                                    <Switch>
                                        <Match when={props.displayType === "raw"}>
                                            <p class={cn(messageClass, "whitespace-pre-wrap")}>
                                                {message.content}
                                            </p>
                                        </Match>
                                        <Match when={props.displayType === "markdown"}>
                                            <Markdown class={messageClass} text={message.content} />
                                        </Match>
                                    </Switch>
                                </div>
                            </div>
                        );
                    }}
                </For>
            </div>
            <TextField.Root class="relative" value={value()} onValueChange={setValue}>
                <TextField.TextArea
                    class={cn(
                        "flex h-full w-full resize-none text-base-content transition placeholder:text-base-content/80",
                        "rounded-md bg-base-200 p-2 pr-10 outline-none ring-base-300 ring-offset-1 ring-offset-base-100 focus:ring-2 focus:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    onKeyDown={handleKeyDown}
                    placeholder="Chat..."
                    disabled={props.disabled}
                    rows={1}
                    autoResize
                />
                <Button.Root
                    class="absolute inset-y-0 right-2 my-auto text-base-content opacity-80 transition hover:opacity-100"
                    onClick={handleEnter}
                >
                    <Icon.HiSolidPaperAirplane class="h-6 w-6 rotate-90" />
                </Button.Root>
            </TextField.Root>
        </div>
    );
};

export default ChatArea;
