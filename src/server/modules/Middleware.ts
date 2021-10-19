type Middleware<P extends unknown[]> = (stop: (msg: string) => never, ...Params: P) => void;

/**
 * @returns a Middleware array and a function which adds middleware to that array.
 */
export function GenerateMiddleware<P extends unknown[]>() {
	const Middlewares = new Array<Middleware<P>>();
	const addToMiddlewares = (middleware: Middleware<P>) => {
		Middlewares.push(middleware);
	};

	return [Middlewares, addToMiddlewares] as [typeof Middlewares, typeof addToMiddlewares];
}

/**
 * Runs all middleware inside of the middleware array passed in. If any of the middleware call the stop() arg then no further middleware will be ran and the area where RunMiddleware was called will stop.
 */
export function RunMiddleware<P extends unknown[], T extends Middleware<P>>(Middleware: T[], ...Args: P) {
	for (const middleware of Middleware) {
		middleware((message: string) => {
			error(`EXIT MIDDLEWARE // ${message} `, 0);
		}, ...Args);
	}
}
