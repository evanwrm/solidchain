import { createSignal, mergeProps, Show } from "solid-js";

interface Props {
    value: number;
    min: number;
    max: number;
    step?: number;
    label?: string;
    class?: string;
    onValueChange?: (value: number) => void;
}

const Slider = (props: Props) => {
    props = mergeProps({ step: 1 }, props);
    const [value, setValue] = createSignal(props.value);

    const handleValueChange = (value: number) => {
        props.onValueChange?.(value);
        setValue(value);
    };

    return (
        <div class="flex flex-col">
            <Show when={props.label}>
                <span class="mb-1 text-sm opacity-80">{props.label}</span>
            </Show>
            <input
                type="range"
                min={props.min}
                max={props.max}
                step={props.step}
                value={value()}
                onInput={e => handleValueChange(e.currentTarget.valueAsNumber)}
                class={props.class}
            />
            <span>{value()}</span>
        </div>
    );
};

export default Slider;
