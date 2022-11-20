import { WithId } from '@mongo/common.ts'


export interface DeviceInfo {
	serial_number: string
	device_name: string
	user: string
	location: string
	network_alias: string
	network_type: string //网络类型
	ip_address: string
	mac: string
	device_model: string //设备型号
	device_category: string //设备分类
	device_kind: string //设备种类
	system_version: string
	disk_sn: string
	remark: string
}

export type DeviceSchema = WithId & DeviceInfo

export const deviceInfoMap: DeviceInfo = {
	serial_number: '序列号',
	device_name: '设备名称',
	user: '使用人',
	location: '物理位置',
	network_alias: '所属网络',
	network_type: '网络类型',
	ip_address: 'IP地址',
	mac: 'MAC',
	device_model: '设备型号',
	device_category: '设备类别',
	device_kind: '设备种类',
	system_version: '系统版本',
	disk_sn: '磁盘SN',
	remark: '备注',
}
