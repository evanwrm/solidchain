import { A as BaseA } from "@solidjs/router";
import { ComponentProps, JSX } from "solid-js";
import { A } from "solid-start";
import { cn } from "~/lib/utils/styles";
import { isExternal } from "~/lib/utils/uri";

interface Props extends Pick<ComponentProps<typeof BaseA>, "href"> {
    class?: string;
    children?: JSX.Element;
}

const NavLink = (props: Props) => {
    if (isExternal(props.href))
        return (
            <a class={cn(props.class)} target="_blank" rel="noopener noreferrer" {...props}>
                {props.children}
            </a>
        );
    return (
        <A class={cn(props.class)} {...props}>
            {props.children}
        </A>
    );
};

export default NavLink;
