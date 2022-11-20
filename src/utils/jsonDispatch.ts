// deno-lint-ignore-file no-explicit-any
type Controller = <T = any>(...args: any[]) => Promise<any>;

export const jsonDispatch = (controllers: Record<string, Controller>) => {
  const map = new Map<string, Controller>();

  Object.entries(controllers).forEach(([name, controller]) =>
    map.set(name, controller)
  );

  const handler = async <T extends Record<string, unknown>>(
    query: T,
    ctx: any[],
  ) => {
    const controllers = Object.entries(query);

    const result = {};

    await Promise.all(
      controllers.map(async ([name, params]) => {
        if (!map.has(name)) {
          return Reflect.set(
            result,
            name,
            `This controller "${name}" not exist!`,
          );
        }

        const controller = map.get(name) as Controller;

        if (Array.isArray(params)) {
          return Reflect.set(
            result,
            name,
            await controller(...[...ctx, ...params]),
          );
        }

        return Reflect.set(
          result,
          name,
          await controller(...[...ctx, params]),
        );
      }),
    );
    return result;
  };

  const dispatch = async <T extends Record<string, unknown>>(
    query: T,
    ...ctx: any
  ) => {
    // 如果请求是数组的话，将会进行按数组下标顺序进行的依次接口调用
    if (Array.isArray(query)) {
      const result: Array<any> = [];

      for (const arg of query) {
        result.push(await handler(arg, ctx));
      }

      return result;
    }

    return await handler(query, ctx);
  };

  return dispatch;
};
