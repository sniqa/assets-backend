import { WithId } from '@mongo/common.ts'

export interface DeviceBaseInfo {
	vendor: string
	device_model: string //设备型号
	device_category: string
	device_kind: string //设备类型
	manufacture_date: string //出厂日期
	shelf_life: string //保质期
}

export type DeviceBaseSchema = WithId & DeviceBaseInfo

export const deviceBaseInfoMap: DeviceBaseInfo = {
	vendor: '设备品牌',
	device_model: '设备型号',
	device_category: '设备分类',
	device_kind: '设备类型',
	manufacture_date: '出厂日期',
	shelf_life: '保质期',
}

export enum DeviceKind {
	All_in_one = '一体机',
	Laptop = '笔记本',
	Desktop = '台式机',
	Printer = '打印机',
	Duplicator = '复印机',
	Scanner = '扫描仪',
	Fax = '传真机',
	Landline = '座机',
	Switch = '交换机',
	Firewall = '防火墙',
	Bastionhost = '堡垒机',
	Cipher = '密码机',
	Server = '服务器',
	None = '',
}

export const DeviceKinds = [
	'',
	'一体机',
	'笔记本',
	'台式机',
	'打印机',
	'复印机',
	'扫描仪',
	'传真机',
	'座机',
	'交换机',
	'防火墙',
	'堡垒机',
	'密码机',
	'服务器',
]

export const DeviceCategorys = [
	'',
	'computer',
	'officeEquipment',
	'netDevice',
	'server',
]

export enum DeviceCategory {
	Computer = 'computer',
	OfficeEquipment = 'officeEquipment',
	NetDevice = 'netDevice',
	Server = 'server',
	None = '',
}

export const getDeviceCategoryFromDeviceKind = (
	target: DeviceKind | string
) => {
	switch (target) {
		case DeviceKind.All_in_one:
		case DeviceKind.Laptop:
		case DeviceKind.Desktop:
			return DeviceCategory.Computer
		case DeviceKind.Printer:
		case DeviceKind.Duplicator:
		case DeviceKind.Scanner:
		case DeviceKind.Fax:
		case DeviceKind.Landline:
			return DeviceCategory.OfficeEquipment
		case DeviceKind.Switch:
		case DeviceKind.Firewall:
		case DeviceKind.Bastionhost:
		case DeviceKind.Cipher:
			return DeviceCategory.NetDevice
		case DeviceKind.Server:
			return DeviceCategory.Server
		default:
			return ''
	}
}

export const getDeviceKindFromDeviceCategory = (target: DeviceCategory) => {
	switch (target) {
		case DeviceCategory.Computer:
			return [DeviceKind.All_in_one, DeviceKind.Laptop, DeviceKind.Desktop]
		case DeviceCategory.OfficeEquipment:
			return [
				DeviceKind.Printer,
				DeviceKind.Duplicator,
				DeviceKind.Scanner,
				DeviceKind.Fax,
				DeviceKind.Landline,
			]
		case DeviceCategory.NetDevice:
			return [
				DeviceKind.Switch,
				DeviceKind.Firewall,
				DeviceKind.Bastionhost,
				DeviceKind.Cipher,
			]
		case DeviceCategory.Server:
			return [DeviceKind.Server]
		default:
			return ''
	}
}
