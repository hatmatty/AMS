import Signal from "@rbxts/signal";
import { Janitor } from "@rbxts/janitor";
import { Tool, ToolAttributes, ToolInstance } from "../components/Tool";

/**
 *
 * Groups a start and end function into an action which is utilized through the .Started and .Ended connections to track the state of the action.
 *
 * @typeParm T - The tool that this action will be used on.
 *
 */
export abstract class Action<T extends Tool<ToolAttributes, ToolInstance>> {
	/** use this to find whether the action has began / ended */
	public Status: "STARTED" | "ENDED" | undefined;
	/** use this to connect to when the tool starts */
	public Started = new Signal();
	/** use this to connect to when the tool ends */
	public Ended = new Signal();
	/** many actions use a janitor so one is added by default */
	protected janitor = new Janitor();

	/** a non-unique identifer to find out what type of action this action is */
	protected abstract Name: string;
	protected abstract state?: {
		[index: string]: string | number;
	};

	protected Tool: T;

	public constructor(Tool: T) {
		this.Tool = Tool;
	}

	protected abstract _start(): void;
	protected abstract _end(): void;

	/**
	 * calls the _start() function, sets the status to "STARTED" and fires the Started signal
	 */
	public Start() {
		this.Status = "STARTED";
		this.Started.Fire();
		this._start();
	}

	/**
	 * calls the _end() function, sets the status to "ENDED" and fires the Ended signal
	 */
	public End() {
		this.Status = "ENDED";
		this.Ended.Fire();
		this._end();
	}
}
