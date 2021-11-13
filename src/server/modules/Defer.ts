/**
 * Defers a callback.
 * @parm Callback - a function that is called after being deffered
 */

export function Defer(func: Callback) {
	Promise.defer<void>((resolve, reject) => resolve()).then(() => func());
}
