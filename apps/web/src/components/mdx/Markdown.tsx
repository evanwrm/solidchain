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
import { createResource, Suspense } from "solid-js";
import { unified } from "unified";
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
        .use(rehypePrism)
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
    const [html] = createResource(props.text, renderMarkdown);

    return (
        <Suspense>
            <div class={props.class} innerHTML={html()} />
        </Suspense>
    );
};

export default Markdown;
