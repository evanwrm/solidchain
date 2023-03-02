import {
    CellContext,
    ColumnDef,
    ColumnHelper,
    flexRender,
    IdentifiedColumnDef,
    Table
} from "@tanstack/solid-table";
import { For, JSX, Match, mergeProps, Show, Switch } from "solid-js";
import imageDataMissing from "~/assets/Semantic/data-missing.png";
import TablePagination from "~/components/data/TablePagination";
import Icon from "~/components/Icon";
import { cn } from "~/lib/utils/styles";

export type TableComponentType = "string" | "number" | "date";
export interface TableRowModel<T> extends IdentifiedColumnDef<T, unknown> {
    name: string;
    type: TableComponentType;
    props?: (
        defaultProps: Record<string, unknown>,
        context: CellContext<T, unknown>
    ) => Record<string, unknown>;
    optional?: boolean;
}

const componentMap: Record<
    TableComponentType,
    { component: (props: any) => JSX.Element; props: (props: CellContext<any, unknown>) => any }
> = {
    string: {
        component: (props: { text: string }) => <span>{props.text}</span>,
        props: props => ({ text: props.getValue() })
    },
    number: {
        component: (props: { number: number; precision: number }) => (
            <span>{props.number.toFixed(props.precision)}</span>
        ),
        props: props => ({
            number: props.getValue(),
            precision: 2
        })
    },
    date: {
        component: (props: { date: string }) => (
            <span>{new Date(props.date).toLocaleString()}</span>
        ),
        props: props => ({
            date: props.getValue()
        })
    }
};
export const inferColumns = <T = any,>(columnHelper: ColumnHelper<T>) => {
    return (key: string, rowModel: TableRowModel<T>): ColumnDef<T> => {
        const { name, type, props: propsFn, ...rest } = rowModel;
        const Component = componentMap[type].component;

        return columnHelper.accessor(key as any, {
            header: name,
            cell: props =>
                propsFn ? (
                    <Component {...propsFn(componentMap[rowModel.type].props(props), props)} />
                ) : (
                    <Component {...componentMap[rowModel.type].props(props)} />
                ),
            ...rest
        });
    };
};

export interface VisualTableOptions {
    header?: boolean;
    footer?: boolean;
    pagination?: boolean;
    compact?: boolean;
}
interface Props {
    table: Table<any>;
    tableOptions?: VisualTableOptions;
    hidden?: boolean;
    class?: string;
    children?: JSX.Element;
}

const defaultTableOptions: VisualTableOptions = {
    header: true,
    footer: false,
    pagination: true,
    compact: false
};

const TableContainer = (props: Props) => {
    props = mergeProps({ tableOptions: defaultTableOptions }, props);

    return (
        <div class={cn("flex h-full w-full flex-col items-center justify-center", props.class)}>
            <Show when={!props.hidden}>
                {props.children}
                <div class="scrollbar w-full overflow-x-auto">
                    <table class="table h-auto w-full">
                        <Show when={props.tableOptions?.header}>
                            <thead>
                                <For each={props.table.getHeaderGroups()}>
                                    {headerGroup => (
                                        <tr class="bg-base-200">
                                            <For each={headerGroup.headers}>
                                                {header => (
                                                    <th
                                                        colSpan={header.colSpan}
                                                        class="!relative !z-0 max-w-[8rem] overflow-x-auto"
                                                    >
                                                        <Show when={!header.isPlaceholder}>
                                                            <div
                                                                class={
                                                                    header.column.getCanSort()
                                                                        ? "cursor-pointer select-none"
                                                                        : ""
                                                                }
                                                                onClick={header.column.getToggleSortingHandler()}
                                                            >
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                                <Show
                                                                    when={header.column.getCanSort()}
                                                                >
                                                                    <Switch
                                                                        fallback={
                                                                            <Icon.TiArrowUnsorted class="inline h-3 w-3" />
                                                                        }
                                                                    >
                                                                        <Match
                                                                            when={
                                                                                header.column.getIsSorted() ===
                                                                                "asc"
                                                                            }
                                                                        >
                                                                            <Icon.TiArrowSortedUp class="inline h-3 w-3" />
                                                                        </Match>
                                                                        <Match
                                                                            when={
                                                                                header.column.getIsSorted() ===
                                                                                "desc"
                                                                            }
                                                                        >
                                                                            <Icon.TiArrowSortedDown class="inline h-3 w-3" />
                                                                        </Match>
                                                                    </Switch>
                                                                </Show>
                                                            </div>
                                                        </Show>
                                                    </th>
                                                )}
                                            </For>
                                        </tr>
                                    )}
                                </For>
                            </thead>
                        </Show>
                        <tbody>
                            <For each={props.table.getRowModel().rows}>
                                {row => (
                                    <tr class="hover:bg-base-200/10">
                                        <For each={row.getVisibleCells()}>
                                            {cell => (
                                                <td
                                                    class={cn(
                                                        "max-w-[16rem] overflow-hidden overflow-ellipsis bg-inherit px-2",
                                                        props.tableOptions?.compact
                                                            ? "py-1"
                                                            : "py-2"
                                                    )}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            )}
                                        </For>
                                    </tr>
                                )}
                            </For>
                        </tbody>
                        <Show when={props.tableOptions?.footer}>
                            <tfoot>
                                <For each={props.table.getFooterGroups()}>
                                    {footerGroup => (
                                        <tr class="bg-base-200">
                                            <For each={footerGroup.headers}>
                                                {header => (
                                                    <th
                                                        colSpan={header.colSpan}
                                                        class="!relative !z-0 max-w-[8rem] overflow-x-auto"
                                                    >
                                                        <Show when={!header.isPlaceholder}>
                                                            {flexRender(
                                                                header.column.columnDef.footer,
                                                                header.getContext()
                                                            )}
                                                        </Show>
                                                    </th>
                                                )}
                                            </For>
                                        </tr>
                                    )}
                                </For>
                            </tfoot>
                        </Show>
                    </table>
                </div>
                <Show when={props.tableOptions?.pagination}>
                    <div class="mt-2 w-full">
                        <TablePagination table={props.table} />
                    </div>
                </Show>
            </Show>
            <Show when={props.hidden}>
                <div class="flex h-72 flex-col items-center justify-center">
                    <img src={imageDataMissing} alt="No data to display!" class="h-24 w-24" />
                    <div class="flex flex-col items-center justify-center py-4">
                        <span class="pt-1 font-bold">No Data found!</span>
                        <span class="pt-1 opacity-60">Please try again later.</span>
                    </div>
                </div>
            </Show>
        </div>
    );
};

export default TableContainer;
