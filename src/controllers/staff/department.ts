import { create_log } from "@ctrls/log/log.ts";
import {
  DepartmentInfo,
  departmentMap,
  DepartmentSchema,
  LOGS_EVENT,
  LogSchema,
  ObjectId,
} from "@mongo/mod.ts";
import { UpdateFilter } from "@mongodb";
import {
  ClientConfig,
  ErrCode,
  faildRes,
  hasKeys,
  successRes,
  whereWasChanged,
} from "@utils";

import { DepartmentModel } from "@mongo/connect.ts";

// 创建
export const create_department = async (
  client: ClientConfig,
  data: DepartmentInfo,
) => {
  if (!hasKeys(data, "department_name")) {
    return faildRes(ErrCode.MISSING_PARAMETER);
  }

  if (
    await DepartmentModel.findOne({ department_name: data.department_name })
  ) {
    return faildRes(ErrCode.REPEAT_DEPARTMENT);
  }

  const res = await DepartmentModel.insertOne(data);

  const log: Partial<LogSchema> = {
    who: client.addr.hostname,
    for_who: data.department_name,
    event: LOGS_EVENT.CREATE,
    message: `创建部门: ${data.department_name}`,
  };

  console.log(res);

  return res
    ? (create_log({ ...log, state: true }), successRes({ _id: res }))
    : (create_log({ ...log, state: false }),
      faildRes(ErrCode.DEPARTMENT_CREATE_ERROR));
};

// 查询
export const find_departments = async (
  client: ClientConfig,
  data: Partial<DepartmentSchema>,
) => {
  const res = await DepartmentModel.find(data).sort({ _id: -1 }).toArray();

  return successRes(res);
};

// 删除
export const delete_department = async (
  client: ClientConfig,
  data: Partial<DepartmentSchema>,
) => {
  if (!hasKeys(data, "_id")) {
    return faildRes(ErrCode.MISSING_PARAMETER);
  }

  const res = await DepartmentModel.deleteOne({ _id: new ObjectId(data._id) });

  const log: Partial<LogSchema> = {
    who: client.addr.hostname,
    for_who: data.department_name || "",
    event: LOGS_EVENT.DELETE,
    message: `删除部门: ${data.department_name || ""}`,
  };

  return res > 0
    ? (create_log({ ...log, state: true }), successRes(true))
    : (create_log({ ...log, state: false }),
      faildRes(ErrCode.DEPARTMENT_DELETE_ERROR));
};

//删除所有
export const delete_many_departments_by_id = async (
  client: ClientConfig,
  ids: string[],
) => {
  const objectIds = ids.map((id) => new ObjectId(id));

  const res = await DepartmentModel.deleteMany({
    _id: {
      $in: objectIds,
    },
  });

  return successRes(res);
};

// 变更
export const modify_department = async (
  client: ClientConfig,
  data: Partial<DepartmentSchema>,
) => {
  if (!hasKeys(data, "_id")) {
    return faildRes(ErrCode.MISSING_PARAMETER);
  }

  const { _id, ...res } = data;

  const oldData = await DepartmentModel.findAndModify(
    {
      _id: new ObjectId(data._id),
    },
    {
      update: { $set: res } as UpdateFilter<DepartmentSchema>,
    },
  );

  const log: Partial<LogSchema> = {
    who: client.addr.hostname,
    for_who: data.department_name || "",
    event: LOGS_EVENT.UPDATE,
    message: `更新部门: ${data.department_name || ""}`,
  };

  if (oldData) {
    const [before_update, after_update] = whereWasChanged(
      res,
      oldData,
      departmentMap,
    );

    create_log({ ...log, state: true, before_update, after_update });

    return successRes(data);
  }

  create_log({ ...log, state: false });

  return faildRes(ErrCode.DEPARTMENT_UPDATE_ERROR);
};
