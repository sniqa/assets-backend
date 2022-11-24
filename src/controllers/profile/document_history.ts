import { DocumentHistoryModel, DocumentModel } from "@mongo/connect.ts";
import {
  DocumentHistoryInfo,
  DocumentInfo,
  DocumentSchema,
  ObjectId,
} from "@mongo/mod.ts";
import {
  ClientConfig,
  ErrCode,
  faildRes,
  getCurrentTime,
  hasKeys,
  successRes,
} from "@utils";

// 创建文档历史版本
export const create_document_history = async (
  client: ClientConfig,
  query: DocumentHistoryInfo,
) => {
  const { timestamp } = getCurrentTime();

  const res = await DocumentHistoryModel.insertOne({ ...query, timestamp });

  return successRes(res);
};

//查找历史版本
export const find_document_history_by_id = async (
  client: ClientConfig,
  id: string,
) => {
  const res = await DocumentHistoryModel.find({ document_id: id })
    .sort({
      timestamp: -1,
    })
    .toArray();

  return successRes(res);
};
