import { WithId } from '@mongo/common.ts'


export interface TopologyInfo {
  title: string;
  description: string;
  timestamp: number;
  history_id: string; //历史版本
}

export type TopologySchema = WithId & TopologyInfo


// topology history
export interface TopologyHistoryInfo {
  topology_id: string;
  timestamp: number;
  detail_ids: string[]; //指向详细数据的id
}

export type TopologyHistorySchema = WithId & TopologyHistoryInfo


// topology detail
export interface  TopologyDetailInfo {
  timestamp: number;
  title: string;
  image: string;
}

export type TopologyDetailSchema = WithId & TopologyDetailInfo