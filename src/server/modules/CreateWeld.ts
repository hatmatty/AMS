export function CreateWeld(p1: BasePart, p0: BasePart) {
	// const a1 = p1.Anchored;
	// const a2 = p0.Anchored;
	const WeldedCFrame = p1.CFrame.ToObjectSpace(p0.CFrame);
	// p1.Anchored = true;
	// p0.Anchored = true;
	const joint = new Instance("Weld");
	joint.Part0 = p1;
	joint.Part1 = p0;
	joint.C0 = WeldedCFrame;
	joint.C1 = new CFrame();
	joint.Parent = p1;
	joint.Name = p0.Name;
	// p1.Anchored = a1;
	// p0.Anchored = a2;

	return joint;
}
