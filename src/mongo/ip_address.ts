import { WithId } from '@mongo/common.ts'


export interface IpAddressInfo {
  network_type: string;
  user: string;
  enable_time: string;
  device_model: string;
  ip_address: string;
  is_used: boolean;
}

export type IpAddressSchema = WithId & IpAddressInfo

export const ipAddressInfoMap = {
  network_type: `网络类型`,
  user: `使用人`,
  device_model: "设备类型",
  ip_address: `ip地址`,
  is_used: `是否使用`,
};
