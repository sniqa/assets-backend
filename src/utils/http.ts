import { CORS } from '@cors'
import { Application, Router } from '@oak'

interface HttpServerConfig {
	port: number
}

export const httpServer = ({ port }: HttpServerConfig) => {
	const app = new Application()

	const router = new Router()

	router.get('/', () => 'hello world')

	app.use(
		CORS({
			origin: '*',
			credentials: true,
		})
	)

	// app.use(async (context) => {
	// 	await context.send({
	// 		root: `${Deno.cwd()}`,
	// 	})
	// })

	console.log(`${Deno.cwd()}/static`)

	app.use(router.routes())

	app.use(router.allowedMethods())

	app.listen({ port })

	console.log(`server run at localhost:${port}`)

	return router
}
