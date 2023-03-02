import "katex/dist/katex.min.css";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeKatex from "rehype-katex";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse/lib";
import remarkRehype from "remark-rehype";
import { createEffect, createResource, Suspense } from "solid-js";
import { unified } from "unified";
import vegaEmbed from "vega-embed";
import rehypeVega from "~/components/mdx/rehypeVega";
import "~/styles/prism.css";

const renderMarkdown = async (text: string) => {
    const vfile = await unified()
        .use(remarkParse) // parse
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype) // convert
        .use(rehypeSlug)
        .use(rehypeAutolinkHeadings)
        .use(rehypeKatex)
        .use(rehypeCodeTitles)
        .use(rehypeVega)
        .use(rehypePrism, { ignoreMissing: true })
        // .use(rehypeSanitize)
        .use(rehypeStringify) // compile
        .process(text);
    return String(vfile?.value);
};
interface Props {
    text: string;
    class?: string;
}

const Markdown = (props: Props) => {
    let ref: HTMLDivElement | undefined;
    const [html] = createResource(props.text, renderMarkdown);

    createEffect(() => {
        setTimeout(() => {
            if (ref) {
                const containers = ref.querySelectorAll("[data-vega]");
                containers.forEach(container => {
                    const node = container as HTMLElement;
                    const spec = JSON.parse(node.dataset.vega ?? "");
                    const resolvedSpec = {
                        width: "container",
                        background: "transparent",
                        ...spec
                    };

                    vegaEmbed(node, resolvedSpec, { padding: 0, theme: "dark" });
                });
            }
        });
    });

    return (
        <Suspense>
            <div class={props.class} innerHTML={html()} ref={ref} />
        </Suspense>
    );
};

export default Markdown;
