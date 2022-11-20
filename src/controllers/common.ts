export interface PageInfo {
	pageIndex: number
	pageSize: number
}

export const defaultPageLength: PageInfo = {
	pageIndex: 0,
	pageSize: 30,
}
