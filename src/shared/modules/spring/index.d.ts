interface Spring<T extends Vector3 | number> {
	Damper: number;
	Speed: number;

	Target: T;

	readonly Position: T;
	readonly Velocity: T;
}

declare const Spring: new <T extends Vector3 | number>(position: T) => Spring<T>;

export = Spring;
