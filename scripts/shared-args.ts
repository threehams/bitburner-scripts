type Config<TValue extends string | number | boolean> = {
  key: string;
  longKey?: string;
  defaultValue: TValue;
};

export const findArg = <TValue extends string | number | boolean>(
  args: string[],
  { key, defaultValue, longKey }: Config<TValue>
): TValue => {
  const value = args
    .find((arg) => arg.startsWith(`-${key}`))
    ?.replace(`-${key}`, "");
  if (value == null) {
    return defaultValue;
  }
  switch (typeof defaultValue) {
    case "number":
      return Number(value) as TValue;
    case "boolean":
      return true as TValue;
    default:
      return value as TValue;
  }
};
