import { UsersModel } from "@mongo/connect.ts";
import {
  LOGS_EVENT,
  LogSchema,
  ObjectId,
  userInfoMap,
  UserSchema,
} from "@mongo/mod.ts";

import {
  ClientConfig,
  defaultPageLength,
  ErrCode,
  FaildRes,
  faildRes,
  hasKeys,
  SuccessRes,
  successRes,
  whereWasChanged,
} from "@utils";

import { create_log } from "@ctrls/log/log.ts";

// 创建用户
export const create_user = async (
  client: ClientConfig,
  user: Partial<UserSchema>,
): Promise<SuccessRes | FaildRes> => {
  // 是否缺失参数
  if (!hasKeys(user, "username")) {
    return faildRes(ErrCode.MISSING_PARAMETER);
  }

  // 是否重复用户
  const repeatUser = await UsersModel.findOne({ username: user.username });

  if (repeatUser) {
    return faildRes(ErrCode.USER_ALREADY_EXISTS);
  }

  const insertId = await UsersModel.insertOne(user as UserSchema);

  const log: Partial<LogSchema> = {
    who: client.addr.hostname,
    for_who: user.username || "",
    event: LOGS_EVENT.CREATE,
    message: `创建用户: ${user.username}`,
  };

  if (insertId) {
    create_log({ ...log, state: true });
    return successRes({ _id: insertId });
  }

  create_log({ ...log, state: false });
  return faildRes(ErrCode.USER_CREATE_ERROR);
};

// 删除用户
export const delete_user = async (
  client: ClientConfig,
  query: Partial<UserSchema>,
  options: any,
) => {
  const id = new ObjectId(query._id);

  const res = await UsersModel.deleteOne({ _id: id });

  const log: Partial<LogSchema> = {
    who: client.addr.hostname,
    for_who: query?.username || "",
    event: LOGS_EVENT.DELETE,
    message: `删除用户: ${query?.username || ""}`,
  };

  if (res <= 0) {
    create_log({ ...log, state: false });
    return faildRes(ErrCode.USER_DELETE_ERROR);
  }

  create_log({ ...log, state: true });
  return successRes(true);
};

// 查找用户
export const find_users = async (
  client: ClientConfig,
  filter: Partial<UserSchema>,
  defaultPage = defaultPageLength,
) => {
  // const { page, length } = defaultPage;

  const res = await UsersModel.find(filter, {
    // skip: page * length,
    // limit: length,
  }).toArray();

  return successRes(res);
};

// 更新用户
export const modify_user = async (
  client: ClientConfig,
  data: Partial<UserSchema>,
) => {
  if (!hasKeys(data, "_id")) {
    return faildRes(ErrCode.MISSING_PARAMETER);
  }

  const { _id, ...resInfo } = data;

  const oldUserInfo = await UsersModel.findAndModify(
    { _id: new ObjectId(_id) },
    {
      update: { $set: resInfo },
    },
  );

  const log: Partial<LogSchema> = {
    who: client.addr.hostname,
    for_who: data.username || "",
    event: LOGS_EVENT.UPDATE,
    message: `更新用户: ${data.username || ""}`,
  };

  if (oldUserInfo) {
    const [before_update, after_update] = whereWasChanged(
      data,
      oldUserInfo,
      userInfoMap,
    );

    create_log({ ...log, state: true, before_update, after_update });

    return successRes(oldUserInfo);
  }

  create_log({ ...log, state: false });

  return faildRes(ErrCode.USER_UPDATE_ERROR);
};

//删除多个用户
export const delete_many_users_by_ids = async (
  client: ClientConfig,
  ids: string[],
) => {
  console.log(ids);

  const objectId = ids.map((id) => new ObjectId(id));

  const res = await UsersModel.deleteMany({
    _id: {
      $in: objectId,
    },
  });

  return successRes(res);
};

// 上传
export const upload_users = async (
  client: ClientConfig,
  contents: string[][],
) => {
  console.log(contents);

  const query = contents.map((content) => ({
    username: content[0].trim() || "",
    department: content[1].trim() || "",
    location: content[2].trim() || "",
    number: content[3].trim() || "",
    remark: content[4].trim() || "",
  }));

  const res = await UsersModel.insertMany(query);

  const users = await UsersModel.find({}).toArray();

  return successRes({
    total: query.length,
    insert: res.insertedCount,
    data: users,
  });
};
