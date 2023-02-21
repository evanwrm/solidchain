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
import { createEffect } from "solid-js";
import { unified } from "unified";
import "~/styles/prism.css";

interface Props {
    text: string;
    class?: string;
}

const Markdown = (props: Props) => {
    let ref: HTMLElement | undefined = undefined;

    createEffect(() => {
        unified()
            .use(remarkParse) // parse
            .use(remarkGfm)
            .use(remarkMath)
            .use(remarkRehype) // convert
            .use(rehypeSlug)
            .use(rehypeAutolinkHeadings)
            .use(rehypeKatex)
            .use(rehypeCodeTitles)
            .use(rehypePrism)
            // .use(rehypeSanitize)
            .use(rehypeStringify) // compile
            .process(props.text, (err, file) => {
                if (err) console.error(err);
                setTimeout(() => {
                    if (ref) {
                        ref.innerHTML = String(file?.value);
                    }
                });
            });
    });

    return <div class={props.class} ref={ref} />;
};

export default Markdown;
