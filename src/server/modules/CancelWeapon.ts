import { Weapon } from "server/components/Weapon";
import { Events } from "server/events";

export function CancelAttack(weapon: Weapon): void {
	weapon.TryDestroyActiveAnimation();

	if (weapon.state === "Drawing") {
		if (weapon.Actions.Draw.Status !== "STARTED") {
			error(`${weapon} state is drawing but status for draw is not started.`);
		}
		if (weapon.ShouldEnableArrows && weapon.Player) {
			Events.ToggleDirectionalArrows(weapon.Player, true);
		}
		weapon.Actions.Draw.End();
	} else if (weapon.state === "Releasing") {
		if (weapon.Actions.Release.Status !== "STARTED") {
			error(`${weapon} state is releasing but status for release is not started.`);
		}
		weapon.Actions.Release.End();
	} else {
		error("If weapon is attacking then state should be releasing or drawing");
	}

	weapon.setState("Enabled");
}

export function IsAttacking(weapon: Weapon): boolean {
	if (weapon.state === "Drawing" || weapon.state === "Releasing") {
		return true;
	} else {
		return false;
	}
}

/** returns true if it cancelled a weapon */
export function TryCancelWeapon(weapon: Weapon): boolean {
	if (IsAttacking(weapon)) {
		CancelAttack(weapon);
		return true;
	} else {
		return false;
	}
}

/** returns true if it stops a weapon */
export function TryStopSwing(weapon: Weapon) {
	if (IsAttacking(weapon) && weapon.TimeDrawStarted !== undefined && tick() - weapon.TimeDrawStarted <= 0.6) {
		return TryCancelWeapon(weapon);
	} else {
		return false;
	}

	// if (weapon.TimeSwingEnded !== undefined && tick() - weapon.TimeSwingEnded <= weapon.HitStopLength + 0.1) {
	// 	return true;
	// }
}
