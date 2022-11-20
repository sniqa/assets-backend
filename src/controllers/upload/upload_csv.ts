import * as csv from '@csv'
import { RouterContext } from '@oak'
import { ClientConfig, ErrCode, faildRes, FaildRes, SuccessRes } from '@utils'

const validationCsvHeader = (csvHeader: string[], args: string[]) =>
	args.every((arg, index) => {
		return arg === csvHeader[index].trim()
	})

// 上传
export const upload_csv = async <T extends string>(
	ctx: RouterContext<T>,
	validation: string[],
	uploadCallback: (
		client: ClientConfig,
		content: string[][]
	) => Promise<FaildRes | SuccessRes>
) => {
	const body = ctx.request.body()

	if (body.type != 'form-data') {
		console.log(2)
		return faildRes(ErrCode.CSV_HEADER_ERROR)
	}

	const ts = await body.value.read({
		outPath: './uploads',
	})

	if (!ts.files) {
		return faildRes(ErrCode.CSV_CONTENT_ERROR)
	}

	const file = ts.files[0]

	const content = csv.parse(Deno.readTextFileSync(file.filename || ''))

	const header = content.shift()

	if (content.length <= 0) {
		return faildRes(ErrCode.CSV_CONTENT_ERROR)
	}

	if (!validationCsvHeader(header || [], validation)) {
		return faildRes(ErrCode.CSV_HEADER_ERROR)
	}

	const client = {
		addr: {
			hostname: ctx.request.ip,
		},
	} as ClientConfig

	const res = await uploadCallback(client, content)

	Deno.remove(file.filename || '')

	return res
}
