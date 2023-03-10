import { Select } from "@kobalte/core";
import { createMemo, createSignal, For, Show } from "solid-js";
import Icon from "~/components/Icon";
import { cn } from "~/lib/utils/styles";

interface SelectOption<T extends string> {
    value: T;
    label?: string;
    group?: string;
}

interface Props<T extends string> {
    class?: string;
    options: SelectOption<T>[];
    label?: string;
    placeholder?: string;
    initialValue?: string;
    onValueChange?: (value: SelectOption<T>) => void;
}

const SelectInput = <T extends string = any>(props: Props<T>) => {
    const [value, setValue] = createSignal(props.initialValue ?? props.options[0]?.value);
    const optionsGroups = createMemo(() => {
        const groups: Record<string, SelectOption<T>[]> = {};
        for (const option of props.options) {
            const group = option.group ?? "default";
            if (!(group in groups)) groups[group] = [];
            groups[group].push(option);
        }
        return groups;
    });

    const handleValueChange = (value: string) => {
        const option = props.options.find(option => option.value === value);
        if (option) props.onValueChange?.(option);
        setValue(value as any);
    };

    return (
        <Select.Root value={value()} onValueChange={handleValueChange}>
            <Show when={props.label}>
                <Select.Label class="mb-1 mr-1 text-sm opacity-80">{props.label}</Select.Label>
            </Show>
            <Select.Trigger
                class={cn(
                    props.class,
                    "flex rounded-md border border-base-300 bg-base-200 p-2 text-base-content transition"
                )}
            >
                <Select.Value
                    class="mr-auto overflow-hidden overflow-ellipsis whitespace-nowrap px-2"
                    placeholder={props.placeholder}
                />
                <Select.Icon class="ml-1">
                    <Icon.HiOutlineSelector class="h-6 w-6" />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content class="rounded-md border border-base-300 bg-base-200 p-1">
                    <Select.Listbox class="scrollbar max-h-72 overflow-y-auto">
                        <For each={Object.entries(optionsGroups())}>
                            {(group, i) => {
                                const numGroups = Object.keys(optionsGroups()).length;
                                return (
                                    <Select.Group>
                                        <Show when={Object.keys(optionsGroups()).length > 1}>
                                            <Select.GroupLabel class="ml-8 text-sm font-semibold opacity-40">
                                                {group[0]}
                                            </Select.GroupLabel>
                                        </Show>
                                        <For each={group[1]}>
                                            {option => (
                                                <Select.Item
                                                    class="flex cursor-pointer rounded-md px-2 py-1 hover:bg-base-100/40"
                                                    value={option.value}
                                                >
                                                    <div class="flex w-6 items-center justify-start">
                                                        <Select.ItemIndicator>
                                                            <Icon.HiSolidCheck class="h-4 w-4" />
                                                        </Select.ItemIndicator>
                                                    </div>
                                                    <Select.ItemLabel class="flex-1">
                                                        {option.label ?? option.value}
                                                    </Select.ItemLabel>
                                                </Select.Item>
                                            )}
                                        </For>
                                        <Show when={numGroups > 1 && i() < numGroups - 1}>
                                            <Select.Separator class="m-2 border-base-content/10" />
                                        </Show>
                                    </Select.Group>
                                );
                            }}
                        </For>
                    </Select.Listbox>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
};

export default SelectInput;
