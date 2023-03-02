import { MultiSelect } from "@kobalte/core";
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
    initialValues?: string[];
    onValueChange?: (value: SelectOption<T>[]) => void;
}

const MultiSelectInput = <T extends string = any>(props: Props<T>) => {
    const [value, setValue] = createSignal(props.initialValues ?? [props.options[0]?.value]);
    const optionsGroups = createMemo(() => {
        const groups: Record<string, SelectOption<T>[]> = {};
        for (const option of props.options) {
            const group = option.group ?? "default";
            if (!(group in groups)) groups[group] = [];
            groups[group].push(option);
        }
        return groups;
    });

    const handleValueChange = (values: Set<string>) => {
        const options = props.options.filter(option => values.has(option.value));
        if (options) props.onValueChange?.(options);
        setValue(Array.from(values) as any);
    };

    return (
        <MultiSelect.Root value={value()} onValueChange={handleValueChange}>
            <Show when={props.label}>
                <MultiSelect.Label class="mb-1 mr-1 text-sm opacity-80">
                    {props.label}
                </MultiSelect.Label>
            </Show>
            <MultiSelect.Trigger
                class={cn(
                    props.class,
                    "flex rounded-md border border-base-300 bg-base-200 p-2 text-base-content transition"
                )}
            >
                <MultiSelect.Value
                    class="mr-auto overflow-hidden overflow-ellipsis whitespace-nowrap px-2"
                    placeholder={props.placeholder}
                />
                <MultiSelect.Icon class="ml-1">
                    <Icon.HiOutlineSelector class="h-6 w-6" />
                </MultiSelect.Icon>
            </MultiSelect.Trigger>
            <MultiSelect.Portal>
                <MultiSelect.Content class="rounded-md border border-base-300 bg-base-200 p-1">
                    <MultiSelect.Listbox class="scrollbar max-h-72 overflow-y-auto">
                        <For each={Object.entries(optionsGroups())}>
                            {(group, i) => {
                                const numGroups = Object.keys(optionsGroups()).length;
                                return (
                                    <MultiSelect.Group>
                                        <Show when={numGroups > 1}>
                                            <MultiSelect.GroupLabel class="ml-8 text-sm font-semibold opacity-40">
                                                {group[0]}
                                            </MultiSelect.GroupLabel>
                                        </Show>
                                        <For each={group[1]}>
                                            {option => (
                                                <MultiSelect.Item
                                                    class="flex cursor-pointer rounded-md px-2 py-1 hover:bg-base-100/40"
                                                    value={option.value}
                                                >
                                                    <div class="flex w-6 items-center justify-start">
                                                        <MultiSelect.ItemIndicator>
                                                            <Icon.HiSolidCheck class="h-4 w-4" />
                                                        </MultiSelect.ItemIndicator>
                                                    </div>
                                                    <MultiSelect.ItemLabel class="flex-1">
                                                        {option.label ?? option.value}
                                                    </MultiSelect.ItemLabel>
                                                </MultiSelect.Item>
                                            )}
                                        </For>
                                        <Show when={numGroups > 1 && i() < numGroups - 1}>
                                            <MultiSelect.Separator class="m-2 border-base-content/10" />
                                        </Show>
                                    </MultiSelect.Group>
                                );
                            }}
                        </For>
                    </MultiSelect.Listbox>
                </MultiSelect.Content>
            </MultiSelect.Portal>
        </MultiSelect.Root>
    );
};

export default MultiSelectInput;
