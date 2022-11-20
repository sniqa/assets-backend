import { ClientConfig, getCurrentTime, successRes } from '@utils'

import type { LogSchema } from '@mongo/mod.ts'
import { initialLogInfo, ObjectId } from '@mongo/mod.ts'

import { LogsModel } from '@mongo/connect.ts'

const getFilterOfRequest = (request: Partial<FindLogsQuery>) => {
	if (!request) return {}
	return Object.keys(request).length != 0
		? {
				timestamp: {
					$gte: request.startTimestamp,
					$lte: request.endTimestamp,
				},
				// type: request.type,
		  }
		: {}
}

interface FindLogsQuery extends LogSchema {
	startTimestamp?: number
	endTimestamp?: number
}

// 查询日志
export const find_logs = async (
	client: ClientConfig,
	request: Partial<FindLogsQuery>
) => {
	const { page, length } = { page: 0, length: 30 }

	const filter = getFilterOfRequest(request)

	const res = await LogsModel.find(filter, {
		skip: page * length,
		limit: length,
	})
		.sort({ timestamp: -1 })
		.toArray()

	return successRes(res)
}

// 删除日志
export const delete_logs = async (client: ClientConfig, request: string[]) => {
	const ids = request.map((id) => new ObjectId(id))

	const res = await LogsModel.deleteMany({
		_id: {
			$in: ids,
		},
	})

	return successRes({ deleteNum: res })
}

// 创建变更日志
export const create_log = async (
	request: Partial<Omit<LogSchema, '_id' & 'current_time' & 'timestamp'>>
) => {
	const {
		who = '',
		for_who = '',
		event = '',
		before_update = '',
		state = true,
		after_update = '',
		message = '',
	} = request

	const res = await LogsModel.insertOne({
		...getCurrentTime(),
		who,
		for_who,
		event,
		state,
		before_update,
		after_update,
		message,
	})

	return !!res
}

export const create_logs = async (
	requests: Partial<Omit<LogSchema, '_id' & 'current_time' & 'timestamp'>>[]
) => {
	const { timestamp, current_time } = getCurrentTime()

	const newReq = requests.map((request) => ({
		...initialLogInfo,
		timestamp,
		current_time,
		...request,
	}))

	const res = await LogsModel.insertMany(newReq)

	return !!res
}
