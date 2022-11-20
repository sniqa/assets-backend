import { ObjectId } from '@mongodb'

// deno-lint-ignore no-explicit-any
export const isObject = (data: any) => typeof data === 'object'

export const isArray = (data: any) => Array.isArray(data)

export const hasKeys = (data: any, ...keys: string[]) => {
	return (
		isObject(data) &&
		keys.every((key) => Reflect.has(data, key) && data[key] != '')
	)
}

// 获取当前时间
export const getCurrentTime = () => {
	const date = new Date()

	const current_time = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`

	const timestamp = date.getTime()

	return {
		timestamp,
		current_time,
	}
}

// 检测两个的对象哪里被更新了，并映射到log里
export const whereWasChanged = (
	newData: Record<string, any>,
	oldData: Record<string, any>,
	map: Record<string, any>
) => {
	const initialVal = ['', '']

	return Object.keys(newData).reduce((previousVal, currentKey) => {
		if (oldData[currentKey] != newData[currentKey]) {
			previousVal[0] += `${map[currentKey]} = ${geVal(oldData, currentKey)}; `
			previousVal[1] += `${map[currentKey]} = ${geVal(newData, currentKey)}; `
		}

		return previousVal
	}, initialVal)
}

const geVal = (target: Record<string, unknown>, key: string) => {
	const val = Reflect.get(target, key)

	if (typeof val === 'boolean') {
		return val ? '是' : '否'
	}

	return val ? val : ''
}

// 将mac地址转化为大写使用-分隔
export const macToFormatMac = (mac: string) => {
	if (mac.includes(':')) {
		return mac.trim().split(':').join('-').toUpperCase()
	}

	return mac.toUpperCase()
}

// 查询的时候more的页长
interface DefaultPageLength {
	page: number
	length: number
}

// 默认长度和页数
export const defaultPageLength: DefaultPageLength = {
	page: 0,
	length: 30,
}

// export const idToObjectId = (query: any) => {
// 	if (Reflect.has(query, '_id')) {
// 		const { _id } = query

// 		const id = isArray(_id)
// 			? _id.map((id: string) => new ObjectId(id))
// 			: new ObjectId(_id)

// 		return { ...query, _id: id }
// 	}

// 	return query
// }
