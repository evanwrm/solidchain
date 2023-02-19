import { Motion, Presence } from "@motionone/solid";
import { createScrollPosition } from "@solid-primitives/scroll";
import { createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { Portal, Show } from "solid-js/web";
import Icon from "~/components/Icon";
import { fadePopVariants } from "~/lib/animation/variants";

const BackToTop = () => {
    const [hidden, setHidden] = createSignal(true);
    onMount(() => {
        const scroll = createScrollPosition();
        const [prevScroll, setPrevScroll] = createStore({ x: 0, y: 0 });
        const [velocity, setVelocity] = createSignal(0);
        createEffect(() => {
            setVelocity(scroll.y - prevScroll.y);
            setPrevScroll(scroll);
        });
        createEffect(() => {
            if (scroll.y < 100) setHidden(true);
            else {
                if (velocity() < 0) setHidden(false);
                else if (velocity() > 0) setHidden(true);
            }
        });
    });

    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Portal>
            <Presence>
                <Show when={!hidden()}>
                    <Motion.button
                        class="btn-ghost btn-circle fixed bottom-6 right-8 z-40 flex select-none items-center justify-center bg-clip-padding shadow shadow-base-content/10"
                        initial={fadePopVariants.hidden}
                        animate={fadePopVariants.visible}
                        exit={fadePopVariants.hidden}
                        transition={{ duration: 0.2 }}
                        onClick={handleClick}
                    >
                        <div class="inline-flex items-center justify-center rounded-full bg-base-content/10 p-3 text-center">
                            <Icon.HiSolidChevronUp class="h-6 w-6" />
                        </div>
                    </Motion.button>
                </Show>
            </Presence>
        </Portal>
    );
};

export default BackToTop;
