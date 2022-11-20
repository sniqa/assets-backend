interface Res {
  success: boolean;
}

export interface ErrorRes {
  errmsg: string;
  errcode: number;
}

export type FaildRes = Res & ErrorRes;

// deno-lint-ignore no-explicit-any
export type SuccessRes<T = any> = Res & {
  data: T;
};

// deno-lint-ignore no-explicit-any
export const successRes = <T = any>(data: T): SuccessRes<T> => {
  return {
    success: true,
    data,
  };
};

export const faildRes = (error: ErrorRes): FaildRes => {
  return {
    success: false,
    ...error,
  };
};
