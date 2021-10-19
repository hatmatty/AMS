import Signal from "@rbxts/signal";
import { Janitor } from "@rbxts/janitor";
import { Tool, ToolAttributes, ToolInstance } from "../components/Tool";

/**
 *
 * An Aciton groups a reusable set of 2 functions, a start and end function. It tracks the state of these functions.
 *
 */
export class Action {
	/** use this to find whether the action has began / ended */
	public Status: "STARTED" | "ENDED" | undefined;
	/** use this to connect to when the tool starts */
	public Started = new Signal();
	/** use this to connect to when the tool ends */
	public Ended = new Signal();
	/** many actions use a janitor so one is added by default */
	protected janitor = new Janitor();

	protected state?: {
		[index: string]: string | number;
	};

	public _start: (End: Callback, janitor: Janitor) => void;
	public _end?: () => void;

	public constructor(Start: (End: Callback, janitor: Janitor) => void, End?: () => void) {
		this._start = Start;
		this._end = End;
	}
	/**
	 * calls the _start() function, sets the status to "STARTED" and fires the Started signal
	 */
	public Start() {
		if (this.Status === "STARTED") {
			error("attempted to start an action that has already been started");
		}
		this.Status = "STARTED";
		this._start(() => this.End(), this.janitor);
		this.Started.Fire();
	}

	/**
	 * calls the _end() function, sets the status to "ENDED" and fires the Ended signal
	 */
	public End() {
		if (this.Status === "ENDED" || this.Status === undefined) {
			error("attempted to end an action which hasn't been started or has already ended");
		}
		this.Status = "ENDED";
		if (this._end) {
			this._end();
		}
		this.janitor.Cleanup();
		this.Ended.Fire();
	}
}
