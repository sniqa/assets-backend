import { DocumentHistoryModel, DocumentModel } from '@mongo/connect.ts'
import {
	DocumentHistoryInfo,
	DocumentInfo,
	DocumentSchema,
	ObjectId,
} from '@mongo/mod.ts'
import {
	ClientConfig,
	ErrCode,
	faildRes,
	getCurrentTime,
	hasKeys,
	successRes,
} from '@utils'

// 创建文档历史版本
const create_document_history = async (
	client: ClientConfig,
	query: DocumentHistoryInfo
) => {
	return await DocumentHistoryModel.insertOne(query)
}

// 创建
type CreateDocumentQuery = DocumentInfo & {
	content: string
}

export const create_document = async (
	client: ClientConfig,
	query: CreateDocumentQuery
) => {
	if (!hasKeys(query, 'title')) {
		return faildRes(ErrCode.MISSING_PARAMETER)
	}

	const { timestamp } = getCurrentTime()

	query.create_timestamp = timestamp
	query.last_modify_timestamp = timestamp

	const { content, ...documentInfo } = query

	const document_id = await DocumentModel.insertOne(documentInfo)

	const document_history_id = await create_document_history(client, {
		content,
		timestamp,
		document_id: document_id,
	})

	return successRes(document_id)
}

//查找历史版本
export const find_document_history_by_id = async (
	client: ClientConfig,
	id: string
) => {
	const res = await DocumentHistoryModel.find({ document_id: new ObjectId(id) })
		.sort({
			timestamp: -1,
		})
		.toArray()

	return successRes(res)
}

// 查找
export const find_document = async (
	client: ClientConfig,
	query: DocumentSchema
) => {
	const res = await DocumentModel.find(query).toArray()

	return successRes(res)
}

//使用ID查找
export const find_document_by_id = async (client: ClientConfig, id: string) => {
	const objectId = new ObjectId(id)

	const res = await DocumentModel.findOne({ _id: objectId })

	return res ? successRes(res) : faildRes(ErrCode.DOCUMENT_NOT_FOUND)
}

// 使用ID删除
export const delete_document_by_id = async (
	client: ClientConfig,
	id: string
) => {
	const objectId = new ObjectId(id)

	const res = await DocumentModel.deleteOne({ _id: objectId })

	return res ? successRes(res) : faildRes(ErrCode.DOCUMENT_DELETE_ERROR)
}
