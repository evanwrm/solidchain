import { Tabs } from "@kobalte/core";
import { children, For, JSX } from "solid-js";
import { cn } from "~/lib/utils/styles";

interface TabItem {
    value: string;
    label?: string;
}

interface Props {
    class?: string;
    tabs: TabItem[];
    children: JSX.Element;
}

const NavTabs = (props: Props) => {
    const resolvedChildren = children(() => props.children);

    return (
        <Tabs.Root class={cn(props.class)}>
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
            <For each={resolvedChildren.toArray()}>
                {(child, i) => (
                    <Tabs.Content class="h-full w-full" value={props.tabs[i()].value}>
                        {child}
                    </Tabs.Content>
                )}
            </For>
        </Tabs.Root>
    );
};

export default NavTabs;
