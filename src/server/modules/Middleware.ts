type Middleware<P extends unknown[]> = (stop: Callback, ...Params: P) => void;

export function GenerateMiddleware<P extends unknown[]>() {
	const Middlewares = new Array<Middleware<P>>();
	const addToMiddlewares = (middleware: Middleware<P>) => {
		Middlewares.push(middleware);
	};

	return [Middlewares, addToMiddlewares] as [typeof Middlewares, typeof addToMiddlewares];
}

export function RunMiddleware<P extends unknown[], T extends Middleware<P>>(Middleware: T[], ...Args: P) {
	let stop = false;
	for (const middleware of Middleware) {
		middleware(() => {
			stop = true;
		}, ...Args);
		if (stop) {
			return;
		}
	}
}
