/**
 * A utility function which plays an animation on a player's character.
 *
 * @param animation - either a string or number which is converted into an aniamtion instance
 * @param character - either a player, a player's character, or undefined. if it's a player it will conver it to the player's character. if it's undefined it will error.
 * @param info - info that will modify how the animation will be played
 */

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
