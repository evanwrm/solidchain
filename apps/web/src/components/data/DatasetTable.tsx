import {
    createColumnHelper,
    createSolidTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState
} from "@tanstack/solid-table";
import { createSignal, JSX } from "solid-js";
import TableContainer, { inferColumns, VisualTableOptions } from "~/components/data/TableContainer";
import { VectorStore } from "~/lib/validators/VectorStore";

interface Props {
    data?: VectorStore[];
    tableOptions?: VisualTableOptions;
    class?: string;
    children?: JSX.Element;
}

const DatasetTable = (props: Props) => {
    const [sorting, setSorting] = createSignal<SortingState>([]);

    const columnHelper = createColumnHelper<VectorStore>();
    const columnMapper = inferColumns<VectorStore>(columnHelper);
    const specification = [
        columnMapper("vectorstoreId", {
            name: "Vectortore Id",
            type: "number",
            props: (props, _context) => ({
                ...props,
                precision: 0
            }),
            optional: false
        }),
        columnMapper("name", {
            name: "Name",
            type: "string",
            optional: false
        }),
        columnMapper("description", {
            name: "Description",
            type: "string",
            optional: false
        }),
        columnMapper("vectorDb", {
            name: "Vector DB",
            type: "string",
            optional: false
        }),
        columnMapper("embeddingsType", {
            name: "Embeddings",
            type: "string",
            optional: false
        }),
        columnMapper("files", {
            name: "Files",
            type: "string",
            props: (_props, context) => ({
                text: context.row.original.files.length
            }),
            optional: false
        }),
        columnMapper("index", {
            name: "Index",
            type: "string",
            props: (_props, context) => ({
                text: context.row.original.index?.filename
            }),
            optional: false
        }),
        columnMapper("createdAt", {
            name: "Created At",
            type: "date",
            optional: false
        }),
        columnMapper("updatedAt", {
            name: "Updated At",
            type: "date",
            optional: false
        })
    ];
    const columns = [...specification];

    const table = createSolidTable({
        get data() {
            return props.data ?? [];
        },
        columns,
        state: {
            get sorting() {
                return sorting();
            }
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getRowId: row => String(row.vectorstoreId)
    });

    return (
        <TableContainer
            class={props.class}
            hidden={!props.data?.length}
            table={table}
            tableOptions={props.tableOptions}
        >
            {props.children}
        </TableContainer>
    );
};

export default DatasetTable;
