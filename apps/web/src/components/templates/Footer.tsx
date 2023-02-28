import { createMemo, For, Match, Switch, useContext } from "solid-js";
import NavLink from "~/components/navigation/NavLink";
import { footerRoutes } from "~/configs/routes";
import { env } from "~/lib/env/client";
import { ApiSettingsContext } from "~/routes/(marketing)";

const Footer = () => {
    const [settings] = useContext(ApiSettingsContext);
    const versions = createMemo(() => [
        { name: "python", version: settings?.versions.pythonVersion },
        { name: "fastapi", version: settings?.versions.fastapiVersion },
        { name: "torch", version: settings?.versions.torchVersion },
        { name: "transformers", version: settings?.versions.transformersVersion },
        { name: "langchain", version: settings?.versions.langchainVersion },
        {
            name: "commit",
            version: settings?.gitConfig.commitHash,
            href: `${env.VITE_GITHUB_REPO}/commit/${settings?.gitConfig.commitHash}`
        }
    ]);

    return (
        <div class="container flex w-full flex-col items-center justify-center">
            <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-base-content to-transparent opacity-10" />
            <div class="flex w-full flex-col items-center justify-between p-6 sm:flex-row">
                <div class="flex items-center justify-center">
                    <For each={footerRoutes}>
                        {route => (
                            <NavLink
                                href={route.path}
                                class="px-2 opacity-80 transition hover:underline hover:opacity-100"
                            >
                                {route.name}
                            </NavLink>
                        )}
                    </For>
                </div>
                <div class="flex flex-wrap items-center justify-center gap-x-2">
                    <For each={versions()}>
                        {version => (
                            <div class="text-xs">
                                <span>{version.name}: </span>
                                <Switch
                                    fallback={<span class="opacity-80">{version.version}</span>}
                                >
                                    <Match when={version.href}>
                                        <NavLink href={version.href!}>
                                            <span class="opacity-80 hover:opacity-100">
                                                {version.version}
                                            </span>
                                        </NavLink>
                                    </Match>
                                </Switch>
                            </div>
                        )}
                    </For>
                </div>
                <p class="items-center justify-center opacity-80">
                    © Copyright {new Date().getFullYear()}. All Rights Reserved.
                </p>
            </div>
        </div>
    );
};

export default Footer;
