type unPick<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export { unPick };
