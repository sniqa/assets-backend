import { WithId } from '@mongo/common.ts'

export interface UsbKeyInfo {
	number: string
	user: string
	enable_time: string
	collection_time: string
	remark: string
}

export type UsbKeySchema = WithId & UsbKeyInfo

export const usbKeyInfoMap: UsbKeyInfo = {
	number: '证书编号',
	user: '使用人',
	enable_time: '启用时间',
	collection_time: '领用时间',
	remark: '备注',
}
