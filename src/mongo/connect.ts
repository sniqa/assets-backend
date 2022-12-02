import {
  DepartmentSchema,
  DeviceBaseSchema,
  DeviceSchema,
  DocumentHistorySchema,
  DocumentSchema,
  IpAddressSchema,
  LogSchema,
  NetworkTypeSchema,
  TopologyDetailSchema,
  TopologyHistorySchema,
  TopologySchema,
  UsbKeySchema,
  UserSchema,
} from "@mongo/mod.ts";
import { MongoClient } from "@mongodb";

const MONGO_PORT = 27017;

const MONGO_CONNECT_URL = `mongodb://localhost:${MONGO_PORT}`;

const MONGO_DB_NAME = "assets";

enum CollectionName {
  User = "users",
  Department = "departments",

  Log = "logs",

  Device = "devices",
  Device_base = "device_bases",
  Usb_key = "usb_keys",

  Network_type = "network_types",
  Ip_address = "ip_address",

  Document = "documents",
  Document_history = "document_history",
  Topology = "topologys",
  Topology_detail = "topology_details",
  Topology_history = "topology_historys",

  Job = "jobs",
}

const client = new MongoClient();

// connect to local db
await client.connect(MONGO_CONNECT_URL);

const db = client.database(MONGO_DB_NAME);

// 用户集合
export const UsersModel = db.collection<UserSchema>(CollectionName.User);

// 日志集合
export const LogsModel = db.collection<LogSchema>(CollectionName.Log);

// 网络类型集合
export const NetworkTypesModel = db.collection<NetworkTypeSchema>(
  CollectionName.Network_type,
);

// 硬件设备集合
export const DevicesModel = db.collection<DeviceSchema>(CollectionName.Device);

// 设备基础资料集合
export const DeviceBaseModel = db.collection<DeviceBaseSchema>(
  CollectionName.Device_base,
);

// ip地址集合
export const IpAddressModel = db.collection<IpAddressSchema>(
  CollectionName.Ip_address,
);

//部门集合
export const DepartmentModel = db.collection<DepartmentSchema>(
  CollectionName.Department,
);

// 数字证书集合
export const UsbKeyModel = db.collection<UsbKeySchema>(CollectionName.Usb_key);

// 拓扑图集合
export const TopologyModel = db.collection<TopologySchema>(
  CollectionName.Topology,
);

//
export const TopologyDetailModel = db.collection<TopologyDetailSchema>(
  CollectionName.Topology_detail,
);

//
export const TopologyHistoryModel = db.collection<TopologyHistorySchema>(
  CollectionName.Topology_history,
);

// 文档集合
export const DocumentModel = db.collection<DocumentSchema>(
  CollectionName.Document,
);

export const DocumentHistoryModel = db.collection<DocumentHistorySchema>(
  CollectionName.Document_history,
);

// 任务集合
// export const JobAssignmentModel = db.collection<JobAssignmentSchema>(
// 	CollectionName.Job
// )
