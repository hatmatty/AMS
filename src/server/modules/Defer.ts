export function Defer(func: Callback) {
	Promise.defer<void>((resolve, reject) => resolve()).then(() => func());
}
