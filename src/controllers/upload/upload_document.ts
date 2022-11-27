import { RouterContext } from '@oak'
import { ErrCode, faildRes, successRes } from '@utils'

const base_url = 'http://192.168.0.100:8083/'

export const upload_document = async <T extends string>(
	ctx: RouterContext<T>
) => {
	const body = ctx.request.body()

	if (body.type != 'form-data') {
		return faildRes(ErrCode.UPLOAD_HEADER_ERROR)
	}

	const ts = await body.value.read({
		outPath: './static',
	})

	if (!ts.files) {
		return faildRes(ErrCode.CSV_CONTENT_ERROR)
	}

	const files = ts.files

	const urls = files.map((file) => base_url + file.filename?.split('./').pop())

	return successRes(urls)
}
