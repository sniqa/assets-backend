import { create_log } from "@ctrls/log/log.ts";
import {
  IpAddressSchema,
  LOGS_EVENT,
  LogSchema,
  NetworkTypeSchema,
  ObjectId,
} from "@mongo/mod.ts";

import {
  DevicesModel,
  IpAddressModel,
  NetworkTypesModel,
} from "@mongo/connect.ts";
import {
  ClientConfig,
  ErrCode,
  faildRes,
  getCurrentTime,
  hasKeys,
  ipFromLong,
  ipIsV4Format,
  ipToLong,
  successRes,
} from "@utils";

// 从网络类型中获取IP段和网络类型属性
const generateNetworkTypeInfo = (
  data: Partial<NetworkTypeSchema>,
): [Partial<NetworkTypeSchema>, Partial<IpAddressSchema>[]] => {
  if (!data.ip_address_start && !data.ip_address_end) {
    return [
      {
        total_number: 0,
        unused_number: 0,
        used_number: 0,
        ...data,
      },
      [],
    ];
  }

  const ipAddressStartLong = ipToLong(data.ip_address_start as string);
  const ipAddressEnd = ipToLong(data.ip_address_end as string);
  const ipNumber = ipAddressEnd - ipAddressStartLong + 1; //网络类型ip个数

  const { current_time } = getCurrentTime();

  const ipRange: Partial<IpAddressSchema>[] = Array.from(
    { length: ipNumber },
    (_, i) => ({
      ip_address: ipFromLong(ipAddressStartLong + i),
      network_type: data.network_type || "",
      is_used: false,
      user: "",
      device_model: "",
      enable_time: current_time,
    }),
  );

  return [
    {
      total_number: ipNumber,
      unused_number: ipNumber,
      used_number: 0,
      ...data,
    },
    ipRange,
  ];
};

// 创建ip段
const createIpAddressRange = async (data: IpAddressSchema[]) => {
  const res = await IpAddressModel.insertMany(data);

  return res.insertedCount > 0
    ? successRes(res)
    : faildRes(ErrCode.INSERT_IP_RANGE_ERROR);
};

// 创建网络类型
export const create_network_type = async (
  client: ClientConfig,
  data: Partial<NetworkTypeSchema>,
) => {
  if (!hasKeys(data, "network_type")) {
    return faildRes(ErrCode.MISSING_PARAMETER);
  }

  // 验证ip格式
  if (data.ip_address_start || data.ip_address_end) {
    if (
      ![data.ip_address_start, data.ip_address_end].every((ip) =>
        ipIsV4Format(ip as string)
      )
    ) {
      return faildRes(ErrCode.ILLEGAL_IP_FORMAT);
    } else if (
      ipToLong(data.ip_address_end || "") -
          ipToLong(data.ip_address_start || "") <
        0
    ) {
      return faildRes(ErrCode.IP_RANGE_ERROR);
    }
  }

  //

  // 是否重复的网络类型
  const reaptNetType = await NetworkTypesModel.findOne({
    network_type: data.network_type,
  });

  if (reaptNetType) {
    return faildRes(ErrCode.NETWORK_TYPE_EXISTS);
  }

  // 计算该网络类型的属性
  const [networkTypeInfo, ipRange] = generateNetworkTypeInfo(data);

  if (ipRange.length > 0) {
    const ips = await createIpAddressRange(ipRange as IpAddressSchema[]);

    if (!ips.success) {
      return faildRes(ErrCode.INSERT_IP_RANGE_ERROR);
    }
  }

  const res = await NetworkTypesModel.insertOne(
    networkTypeInfo as NetworkTypeSchema,
  );

  const log: Partial<LogSchema> = {
    who: client.addr.hostname,
    for_who: data.network_type,
    event: LOGS_EVENT.CREATE,
    message: `创建网络类型: ${data.network_type}`,
  };

  return res
    ? (create_log({
      ...log,
      state: true,
    }),
      successRes({ _id: res, ...networkTypeInfo }))
    : (create_log({
      ...log,
      state: false,
    }),
      faildRes(ErrCode.INSERT_NETWORK_TYPE_ERROR));
};

// 查询网络类型
export const find_network_types = async (
  client: ClientConfig,
  filter: Partial<NetworkTypeSchema>,
  //   defaultPage = defaultPageLength,
) => {
  //   const { page, length } = defaultPage;

  const res = await NetworkTypesModel.find(filter).sort({ _id: -1 }).toArray();

  return successRes(res);
};

// 删除网络类型
export const delete_network_type = async (
  client: ClientConfig,
  query: Partial<NetworkTypeSchema>,
) => {
  if (!hasKeys(query, "_id")) {
    return faildRes(ErrCode.MISSING_PARAMETER);
  }

  const _id = new ObjectId(query._id);

  // 删除ip
  const result = await IpAddressModel.deleteMany({
    network_type: query.network_type,
  });

  // 将已分配的ip进行清空
  const r = await DevicesModel.updateMany(
    { network_type: query.network_type },
    {
      $set: { network_alias: "", network_type: "", ip_address: "" },
    },
  );

  // 删除网络类型
  const res = await NetworkTypesModel.deleteOne({
    _id,
  });

  const log: Partial<LogSchema> = {
    who: client.addr.hostname,
    for_who: query.network_type || "",
    event: LOGS_EVENT.DELETE,
    message: `删除网络类型: ${query.network_type || ""}`,
  };

  return res > 0
    ? (create_log({ ...log, state: true }), successRes(res))
    : (create_log({ ...log, state: false }),
      faildRes(ErrCode.DELETE_NETWORK_TYPE_ERROR));
};

// 更新网络类型信息
// export const modify_network_type = async () => {}
