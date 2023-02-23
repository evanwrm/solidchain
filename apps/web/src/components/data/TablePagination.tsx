import { Button } from "@kobalte/core";
import { Table } from "@tanstack/solid-table";
import { createMemo } from "solid-js";
import Icon from "~/components/Icon";
import SelectInput from "~/components/inputs/Select";
import { calculateRowBounds } from "~/lib/utils/table";

interface Props {
    table: Table<any>;
}

const TablePagination = (props: Props) => {
    const rowBounds = createMemo(() =>
        calculateRowBounds(
            props.table.getState().pagination.pageIndex,
            props.table.getState().pagination.pageSize,
            props.table.getCoreRowModel().rows.length
        )
    );

    return (
        <div class="mr-2 flex w-full flex-col-reverse items-end justify-center gap-1 py-1 sm:flex-row sm:items-center sm:justify-end">
            <div class="flex items-center justify-end">
                <SelectInput
                    options={["5", "10", "25", "50", "100"].map(value => ({ value }))}
                    label="Rows per page"
                    placeholder="Rows per page"
                    initialValue={props.table.getState().pagination.pageSize.toString()}
                    onValueChange={e => props.table.setPageSize(Number(e.value))}
                />
            </div>
            <div class="flex items-center justify-end">
                <span class="whitespace-nowrap px-4">{`${rowBounds().start}-${rowBounds().end} of ${
                    rowBounds().total
                }`}</span>
                <Button.Root
                    onClick={() => props.table.setPageIndex(0)}
                    disabled={!props.table.getCanPreviousPage()}
                    class="inline-flex cursor-pointer select-none items-center justify-center rounded-full p-2 font-medium text-base-content transition ease-linear hover:-translate-x-0.5 hover:bg-base-200/80 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-opacity-60 disabled:hover:translate-x-0"
                >
                    <Icon.HiSolidChevronDoubleLeft class="h-4 w-4" />
                </Button.Root>
                <Button.Root
                    onClick={() => props.table.previousPage()}
                    disabled={!props.table.getCanPreviousPage()}
                    class="inline-flex cursor-pointer select-none items-center justify-center rounded-full p-2 font-medium text-base-content transition ease-linear hover:-translate-x-0.5 hover:bg-base-200/80 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-opacity-60 disabled:hover:translate-x-0"
                >
                    <Icon.HiSolidChevronLeft class="h-4 w-4" />
                </Button.Root>
                <Button.Root
                    onClick={() => props.table.nextPage()}
                    disabled={!props.table.getCanNextPage()}
                    class="inline-flex cursor-pointer select-none items-center justify-center rounded-full p-2 font-medium text-base-content transition ease-linear hover:translate-x-0.5 hover:bg-base-200/80 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-opacity-60 disabled:hover:translate-x-0"
                >
                    <Icon.HiSolidChevronRight class="h-4 w-4" />
                </Button.Root>
                <Button.Root
                    onClick={() => props.table.setPageIndex(props.table.getPageCount() - 1)}
                    disabled={!props.table.getCanNextPage()}
                    class="inline-flex cursor-pointer select-none items-center justify-center rounded-full p-2 font-medium text-base-content transition ease-linear hover:translate-x-0.5 hover:bg-base-200/80 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-opacity-60 disabled:hover:translate-x-0"
                >
                    <Icon.HiSolidChevronDoubleRight class="h-4 w-4" />
                </Button.Root>
            </div>
        </div>
    );
};

export default TablePagination;
