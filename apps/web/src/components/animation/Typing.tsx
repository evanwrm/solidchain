import { cn } from "~/lib/utils/styles";

interface Props {
    class?: string;
}

const Typing = (props: Props) => {
    return (
        <div class={cn("flex gap-x-1", props.class)}>
            <div class="h-1 w-1 animate-[bounce_1s_infinite_0ms,pulse_1s_infinite_0ms] rounded-full bg-base-content/80" />
            <div class="h-1 w-1 animate-[bounce_1s_infinite_75ms,pulse_1s_infinite_75ms] rounded-full bg-base-content/80" />
            <div class="h-1 w-1 animate-[bounce_1s_infinite_150ms,pulse_1s_infinite_150ms] rounded-full bg-base-content/80" />
        </div>
    );
};

export default Typing;
