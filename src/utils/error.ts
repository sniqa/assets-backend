interface ErrorRes {
	errmsg: string
	errcode: number
}

interface ErrCodeType {
	[x: string]: ErrorRes
}

export const ErrCode: ErrCodeType = {
	REQUIRED_JSON: {
		errcode: 402,
		errmsg: '要求为json格式',
	},
	MISSING_PARAMETER: {
		errcode: 403,
		errmsg: '缺失必要的参数',
	},
	ERROR_PARAMETER: {
		errcode: 408,
		errmsg: '错误的参数',
	},
	USER_ALREADY_EXISTS: {
		errcode: 501,
		errmsg: '用户已存在',
	},
	USER_INFO_UPDATE_ERROR: {
		errcode: 501,
		errmsg: '修改用户信息失败',
	},
	USER_CREATE_ERROR: {
		errcode: 503,
		errmsg: `创建用户失败`,
	},
	USER_UPDATE_ERROR: {
		errcode: 504,
		errmsg: `更新用户失败`,
	},
	USER_DELETE_ERROR: {
		errcode: 502,
		errmsg: '删除用户失败',
	},
	NETWORK_TYPE_EXISTS: {
		errcode: 601,
		errmsg: '网络类型已存在',
	},
	INSERT_NETWORK_TYPE_ERROR: {
		errcode: 601,
		errmsg: '插入网络类型失败',
	},
	DELETE_NETWORK_TYPE_ERROR: {
		errcode: 602,
		errmsg: ' 删除网络类型失败',
	},
	ILLEGAL_IP_FORMAT: {
		errcode: 701,
		errmsg: 'IP格式不正确',
	},
	INSERT_IP_RANGE_ERROR: {
		errcode: 702,
		errmsg: '插入ip地址段失败',
	},
	ILLEGAL_MAC_FORMAT: {
		errcode: 703,
		errmsg: 'mac格式不正确',
	},
	MAC_REPEAT: {
		errcode: 704,
		errmsg: 'mac地址重复!',
	},
	IP_REPEAT: {
		errcode: 705,
		errmsg: 'IP地址重复!',
	},
	IP_UPDATE_ERROR: {
		errcode: 706,
		errmsg: '更新IP地址信息失败',
	},
	IP_RANGE_ERROR: {
		errcode: 707,
		errmsg: `IP地址段格式错误,结束地址不能小于开始地址`,
	},
	REPEAT_DEPARTMENT: {
		errcode: 801,
		errmsg: `部门名称已经存在`,
	},
	DEPARTMENT_CREATE_ERROR: {
		errcode: 803,
		errmsg: `部门创建失败`,
	},
	DEPARTMENT_DELETE_ERROR: {
		errcode: 804,
		errmsg: `部门删除失败`,
	},
	DEPARTMENT_UPDATE_ERROR: {
		errcode: 805,
		errmsg: `部门更新失败`,
	},
	REPEAT: {
		errcode: 801,
		errmsg: `已经存在,不能重复创建`,
	},
	UPDATE_ERROR: {
		errcode: 802,
		errmsg: `更新失败,请重试!`,
	},
	USB_KEY_REPEAT: {
		errcode: 901,
		errmsg: `数字证书重复`,
	},
	USB_KEY_CREATE_ERROR: {
		errcode: 902,
		errmsg: `数字证书创建失败`,
	},
	USB_KEY_DELETE_ERROR: {
		errcode: 903,
		errmsg: `数字证书删除失败`,
	},
	USB_KEY_UPDATE_ERROR: {
		errcode: 904,
		errmsg: `数字证书更新失败`,
	},
	DEVICE_DELETE_ERROR: {
		errcode: 1201,
		errmsg: `删除设备失败`,
	},
	DELETE_DEVICE_BASE_ERROR: {
		errcode: 1303,
		errmsg: `删除设备基础资料失败`,
	},
	REPEAT_DEVICE_BASE: {
		errcode: 1304,
		errmsg: `重复的设备基础资料`,
	},
	CSV_HEADER_ERROR: {
		errcode: 1501,
		errmsg: `上传模板格式错误`,
	},
	CSV_CONTENT_ERROR: {
		errcode: 1502,
		errmsg: `上传模板数据错误`,
	},
	CSV_CONTENT_EMPTY: {
		errcode: 1502,
		errmsg: `上传模板数据不能为空`,
	},
	UPLOAD_HEADER_ERROR: {
		errcode: 1503,
		errmsg: `上传文件请求头错误`,
	},
	DOCUMENT_CREATE_ERROR: {
		errcode: 1601,
		errmsg: '文档创建失败',
	},
	DOCUMENT_DELETE_ERROR: {
		errcode: 1602,
		errmsg: '文档删除失败',
	},
	DOCUMENT_MODIFY_ERROR: {
		errcode: 1603,
		errmsg: '文档修改失败',
	},
	DOCUMENT_NOT_FOUND: {
		errcode: 1604,
		errmsg: '文档未找到',
	},
}
// 缺失参数
// export const MISSING_PARAMETER: ErrorRes = {
// 	errcode: 403,
// 	errmsg: '缺失必要的参数',
// }
