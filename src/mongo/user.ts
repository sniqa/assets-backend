import { WithId } from '@mongo/common.ts'

export interface UserInfo {
	// account: string
	username: string
	// password: string
	department: string
	location: string
	// role: string
	number: string
	remark: string
}

export type UserSchema = WithId & UserInfo

export const userInfoMap: UserInfo = {
	username: '用户名称',
	department: '部门',
	location: '办公室',
	number: '编号',
	remark: '备注',
}
