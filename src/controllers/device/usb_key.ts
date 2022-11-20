import { create_log } from '@ctrls/log/log.ts'
import { UsbKeyModel } from '@mongo/connect.ts'
import {
	LogSchema,
	LOGS_EVENT,
	ObjectId,
	UsbKeyInfo,
	usbKeyInfoMap,
	UsbKeySchema,
} from '@mongo/mod.ts'

import {
	ClientConfig,
	ErrCode,
	faildRes,
	hasKeys,
	successRes,
	whereWasChanged,
} from '@utils'

// 查找数字证书
export const find_usb_key = async (
	client: ClientConfig,
	query: Partial<UsbKeySchema>
) => {
	const res = await UsbKeyModel.find(query).toArray()

	return successRes(res)
}

// 创建数字证书
export const create_usb_key = async (
	client: ClientConfig,
	query: UsbKeyInfo
) => {
	if (!hasKeys(query, 'number')) {
		return faildRes(ErrCode.MISSING_PARAMETER)
	}

	const isReapt = await UsbKeyModel.findOne({
		number: query.number,
	})

	if (isReapt) {
		return faildRes(ErrCode.USB_KEY_REPEAT)
	}

	const log: Partial<LogSchema> = {
		who: client.addr.hostname,
		for_who: query.number,
		event: LOGS_EVENT.CREATE,
		message: `创建数字证书: ${query.number}`,
	}

	const res = await UsbKeyModel.insertOne(query)

	return res
		? (create_log({ ...log, state: true }), successRes(res))
		: (create_log({ ...log, state: false }),
		  faildRes(ErrCode.USB_KEY_CREATE_ERROR))
}

// 更新数字证书
export const modify_usb_key = async (
	client: ClientConfig,
	query: Partial<UsbKeySchema>
) => {
	if (!hasKeys(query, '_id')) {
		return faildRes(ErrCode.MISSING_PARAMETER)
	}

	const { _id, ...resInfo } = query

	const origin = await UsbKeyModel.findAndModify(
		{
			_id: new ObjectId(query._id),
		},
		{
			update: {
				$set: resInfo,
			},
		}
	)

	const log: Partial<LogSchema> = {
		who: client.addr.hostname,
		for_who: query.number || '',
		event: LOGS_EVENT.UPDATE,
		message: `更新数字证书: ${query.number || ''}`,
	}

	if (origin) {
		const [before_update, after_update] = whereWasChanged(
			query,
			origin || {},
			usbKeyInfoMap
		)

		create_log({ ...log, state: true, before_update, after_update })

		return successRes(true)
	}

	create_log({ ...log, state: false })

	return faildRes(ErrCode.USB_KEY_UPDATE_ERROR)
}

// 删除数字证书
export const delete_usb_key = async (
	client: ClientConfig,
	query: Partial<UsbKeySchema>
) => {
	if (!hasKeys(query, '_id')) {
		return faildRes(ErrCode.MISSING_PARAMETER)
	}

	const res = await UsbKeyModel.deleteOne({ _id: new ObjectId(query._id) })

	const log: Partial<LogSchema> = {
		who: client.addr.hostname,
		for_who: query.number || '',
		event: LOGS_EVENT.DELETE,
		message: `删除数字证书: ${query.number}`,
	}

	return res > 0
		? (create_log({ ...log, state: true }), successRes(res))
		: (create_log({ ...log, state: false }),
		  faildRes(ErrCode.USB_KEY_DELETE_ERROR))
}

//删除多个数字证书
export const delete_many_usb_keys = async (
	client: ClientConfig,
	querys: Partial<UsbKeySchema>[]
) => {
	const objectIds = querys.map((query) => new ObjectId(query._id))

	const res = await UsbKeyModel.deleteMany({
		_id: {
			$in: objectIds,
		},
	})

	return res > 0 ? successRes(res) : faildRes(ErrCode.USB_KEY_DELETE_ERROR)
}
