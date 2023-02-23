import { createEffect, createSignal, Signal } from "solid-js";
import { isServer } from "solid-js/web";
import { ZodType } from "zod";

const resolveStorageValue = <T>(key: string, initialValue: T, validator?: ZodType<T>) => {
    let loadedInitial = initialValue;
    try {
        const localValue = !isServer ? localStorage.getItem(key) : null;
        if (localValue === null) throw new Error("No local value");

        const parsedValue = JSON.parse(localValue);
        const validLocal = validator ? validator.safeParse(JSON.parse(localValue)).success : true;
        if (!validLocal) throw new Error("Invalid local value");

        loadedInitial = validator ? validator.parse(parsedValue) : parsedValue;
    } catch {
        // pass
    }
    return loadedInitial;
};

export const createStorageSignal = <T>(
    key: string,
    initialValue: T,
    validator?: ZodType<T>
): Signal<T> => {
    const loadedInitial = resolveStorageValue(key, initialValue, validator);
    const [value, setValue] = createSignal<T>(loadedInitial);
    createEffect(() => {
        if (!isServer && (validator ? validator.safeParse(value()).success : true))
            localStorage.setItem(key, JSON.stringify(value()));
    });

    return [value, setValue];
};
