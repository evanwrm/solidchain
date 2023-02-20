import { Button } from "@kobalte/core";
import { Motion, Presence } from "@motionone/solid";
import { Show, useContext } from "solid-js";
import Icon from "~/components/Icon";
import { ThemeContext } from "~/components/providers/ThemeProvider";
import { slideInTopBottomVariants } from "~/lib/animation/variants";
import { cn } from "~/lib/utils/styles";

interface Props {
    class?: string;
}

const ThemeToggle = (props: Props) => {
    const [theme, { toggleDarkMode }] = useContext(ThemeContext);

    return (
        <Button.Root
            aria-label="Toggle Dark Mode"
            class={cn("flex items-center justify-center", props.class)}
            onClick={toggleDarkMode}
        >
            <Presence>
                <Show when={theme.isDark}>
                    <Motion.div
                        class="absolute"
                        initial={slideInTopBottomVariants.initial}
                        animate={slideInTopBottomVariants.visible}
                        exit={slideInTopBottomVariants.exit}
                        transition={{ duration: 0.2 }}
                    >
                        <Icon.HiSolidSun class="h-6 w-6" />
                    </Motion.div>
                </Show>
            </Presence>
            <Presence>
                <Show when={!theme.isDark}>
                    <Motion.div
                        class="absolute"
                        initial={slideInTopBottomVariants.initial}
                        animate={slideInTopBottomVariants.visible}
                        exit={slideInTopBottomVariants.exit}
                        transition={{ duration: 0.2 }}
                    >
                        <Icon.HiSolidMoon class="h-6 w-6" />
                    </Motion.div>
                </Show>
            </Presence>
        </Button.Root>
    );
};

export default ThemeToggle;
