import { Tabs } from "@kobalte/core";
import { For, JSX } from "solid-js";
import { cn } from "~/lib/utils/styles";

interface TabItem {
    value: string;
    label?: string;
    content: () => JSX.Element;
}

interface Props {
    class?: string;
    tabs: TabItem[];
}

const NavTabs = (props: Props) => {
    return (
        <Tabs.Root class={cn(props.class)}>
            <div>
                <Tabs.List class="relative inline-flex items-center justify-start border-b border-base-300">
                    <For each={props.tabs}>
                        {tab => (
                            <Tabs.Trigger
                                class="px-4 py-2 transition hover:bg-base-200"
                                value={tab.value}
                            >
                                {tab.label ?? tab.value}
                            </Tabs.Trigger>
                        )}
                    </For>
                    <Tabs.Indicator class="absolute -bottom-px h-px bg-secondary transition" />
                </Tabs.List>
            </div>
            <For each={props.tabs}>
                {tab => (
                    <Tabs.Content
                        class="grid h-full w-full flex-1 overflow-hidden"
                        value={tab.value}
                    >
                        <tab.content />
                    </Tabs.Content>
                )}
            </For>
        </Tabs.Root>
    );
};

export default NavTabs;
