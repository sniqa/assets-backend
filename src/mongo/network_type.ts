import { WithId } from '@mongo/common.ts'


export interface NetworkTypeInfo {
  network_type: string;
  network_name: string;
  ip_address_start: string;
  ip_address_end: string;
  netmask: string;
  gateway: string;
  dns: string;
  used_number: number;
  unused_number: number;
  total_number: number;
  remark: string;
}

export type NetworkTypeSchema = WithId & NetworkTypeInfo