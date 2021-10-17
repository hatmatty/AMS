export function playAnim(
	character: Model | Player | undefined,
	animation: string | number,
	info?: {
		Looped?: boolean;
		Fade?: number;
	},
) {
	if (!character) {
		error();
	}

	if (character.IsA("Player")) {
		character = character.Character;
		if (!character) {
			error();
		}
	}

	if (typeIs(animation, "number")) {
		animation = tostring(animation);
	}
	if (string.sub(animation, 0, 12) !== "rbxassetid://") {
		animation = "rbxassetid://" + animation;
	}

	const humanoid = character.FindFirstChildWhichIsA("Humanoid");
	if (!humanoid) {
		error();
	}

	const animator = humanoid.FindFirstChildWhichIsA("Animator");
	if (!animator) {
		error();
	}

	const newAnimation = new Instance("Animation");
	newAnimation.AnimationId = animation;

	const AnimationTrack = animator.LoadAnimation(newAnimation);
	if (info && info.Looped) {
		AnimationTrack.Looped = true;
	} else {
		AnimationTrack.Looped = false;
	}

	AnimationTrack.Looped = true;
	AnimationTrack.Play(info && info.Fade);

	return AnimationTrack;
}
