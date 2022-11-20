import { WithId } from '@mongo/common.ts'


export interface LogInfo {
	timestamp: number
	current_time: string
	who: string
	for_who: string
	event: string
	state: boolean
	reason?: string
	before_update?: string
	after_update?: string
	message?: string
}

export  type LogSchema = WithId & LogInfo

export const initialLogInfo = {
	who: '',
	for_who: '',
	event: '',
	state: false,
	reason: '',
	before_update: '',
	after_update: '',
	message: '',
}

export enum LOGS_TYPE {
	USER = '用户',
	NETWORK_TYPE = '网络类型',
	DEVICE = '设备',
}

export enum LOGS_EVENT {
	LOGIN = '登录',
	LOGOUT = '注销',

	CREATE = '创建',
	UPDATE = '更新',
	FIND = '查找',
	DELETE = '删除',
}
