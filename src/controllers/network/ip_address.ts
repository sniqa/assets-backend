import { create_log } from '@ctrls/log/log.ts'
import { IpAddressModel } from '@mongo/connect.ts'
import {
	ipAddressInfoMap,
	IpAddressSchema,
	LogSchema,
	LOGS_EVENT,
} from '@mongo/mod.ts'

import {
	ClientConfig,
	ErrCode,
	faildRes,
	getCurrentTime,
	hasKeys,
	successRes,
	whereWasChanged,
} from '@utils'

// 查找ip
export const find_ips = async (client: ClientConfig, data: any) => {
	const res = await IpAddressModel.find(data).sort({ _id: -1 }).toArray()

	return successRes(res)
}

// 更新ip
export const modify_ip = async (
	client: ClientConfig,
	query: Partial<IpAddressSchema>
) => {
	if (!hasKeys(query, 'network_type', 'ip_address')) {
		return faildRes(ErrCode.MISSING_PARAMETER)
	}

	const { current_time } = getCurrentTime()

	const res = await IpAddressModel.findAndModify(
		{
			network_type: query.network_type,
			ip_address: query.ip_address,
		},
		{
			update: {
				$set: {
					is_used: query.is_used,
					user: query.user,
					enable_time: current_time,
				},
			},
		}
	)

	const [before_update, after_update] = whereWasChanged(
		query,
		res || {},
		ipAddressInfoMap
	)

	const log: Partial<LogSchema> = {
		who: client.addr.hostname,
		for_who: query.ip_address,
		event: LOGS_EVENT.UPDATE,
		before_update,
		after_update,
		message: `变更IP地址: ${query.ip_address}信息`,
	}

	return res
		? (create_log({ ...log, state: true }), successRes(true))
		: (create_log({ ...log, state: false }), faildRes(ErrCode.IP_UPDATE_ERROR))
}
