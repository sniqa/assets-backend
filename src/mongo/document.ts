import { WithId } from "@mongo/common.ts";
import { ObjectId } from "@mongo/mod.ts";

export interface DocumentInfo {
  title: string;
  create_timestamp: number;
  last_modify_timestamp: number;
  autor: string;
  description: string;
}

export type DocumentSchema = WithId & DocumentInfo;

export interface DocumentHistoryInfo {
  document_id: string;
  content: string;
  timestamp: number;
}

export type DocumentHistorySchema = WithId & DocumentHistoryInfo;
