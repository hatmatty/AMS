import FastCast, { FastCastBehavior, Caster } from "@rbxts/fastcast";
import { Players, RunService } from "@rbxts/services";
import { Component, Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { Shield } from "server/components/Shield";
import { Bow } from "server/components/Bow";
import { Spear } from "server/components/Spear";
import { GenerateMiddleware, RunMiddleware } from "./Middleware";
import { Janitor } from "@rbxts/janitor";
import { Events } from "server/events";
import { PartCache } from "@rbxts/partcache/out/class";
import { playAnim } from "./AnimPlayer";
import Config from "shared/Config";

export const [RangedHitMiddleWare, AddRangedHitMiddleware] =
	GenerateMiddleware<[Ranged, Instance, Instance?, BasePart?]>();
export const [RangedDrawMiddleWare, AddRangedDrawMiddleware] = GenerateMiddleware<[Ranged]>();
export const [RangedReleasedMiddleWare, AddRangedReleasedMiddleware] = GenerateMiddleware<[Ranged]>();

const components = Dependency<Components>();

export interface Ranged {
	className: string;
	janitor: Janitor;
	GetCharPlayer(): [Player, Model];
	Ray: Ray;
	CastParams: RaycastParams;
	Behavior: FastCastBehavior;
	Caster: Caster;
	Player?: Player;
	MainPart: BasePart;
	ActiveAnimation?: AnimationTrack;
	MinWaitTime: number;
	Velocity: number;
	AnimationShootPosition: number;
	Gravity: Vector3;
	instance: Model;
	WalkEffect: boolean;

	Damage: number;
	MAX_DIST: number;
	MaxTime: number;
	Time: number;
	NotMoving: number;
	RangedHit(result: RaycastResult, instance: Instance | undefined): void;
}

export function GetMousePos(Tool: Ranged): Vector3 {
	const [ori, dir] = [Tool.Ray.Origin, Tool.Ray.Direction.mul(Tool.MAX_DIST)];
	const result = game.Workspace.Raycast(ori, dir, Tool.CastParams);
	return (result && result.Position) || ori.add(dir);
}

export function CalculateAccuracy(Tool: Ranged): number {
	return (Tool.NotMoving + math.clamp((tick() - Tool.Time) / Tool.MaxTime, 0, 1)) / 2;
}

export function SetupRanged(Tool: Ranged) {
	Tool.Behavior.CanPierceFunction = (cast, result) => {
		const hit = result.Instance;
		if (hit.Parent && hit.Parent.IsA("Accessory") && Players.GetPlayerFromCharacter(hit.Parent.Parent)) {
			return true;
		} else if (
			hit.Parent &&
			hit.Parent.IsA("Model") &&
			(hit.Name === "Blocker" || hit.Parent?.FindFirstChild("Blocker"))
		) {
			const Shield = components.getComponent<Shield>(hit.Parent);
			if (!Shield) {
				return false;
			}
			if (Shield.state !== "Blocking") {
				return true;
			} else {
				return false;
			}
		} else if (
			hit.Parent?.IsA("Model") &&
			hit.Parent.Parent?.IsA("Model") &&
			Players.GetPlayerFromCharacter(hit.Parent.Parent)
		) {
			return true;
		} else {
			return false;
		}
	};

	Tool.Caster.RayHit.Connect((caster, result, segmentVelocity, instance) => {
		const hit = result.Instance;

		const Player = Players.GetPlayerFromCharacter(hit.Parent);

		if (Player !== undefined) {
			if (Player === Tool.Player) {
				return;
			}

			Tool.Damage = Tool.MaxDamage * CalculateAccuracy(Tool);
			RunMiddleware(RangedHitMiddleWare, Tool, Player, instance, hit);

			const Character = hit.Parent;
			if (!Character) {
				error();
			}
			const Humanoid = Character.FindFirstChildWhichIsA("Humanoid");
			if (!Humanoid) {
				error();
			}

			Humanoid.TakeDamage(Tool.Damage);
		} else {
			RunMiddleware(RangedHitMiddleWare, Tool, hit, instance);
		}

		Tool.RangedHit(result, instance);
	});
}

export function Fire(Tool: Ranged) {
	const pos = GetMousePos(Tool);
	const direction = pos.sub(Tool.MainPart.Position).Unit;
	const Accuracy = CalculateAccuracy(Tool);

	const directionCF = new CFrame(new Vector3(), direction);
	const spreadDirection = CFrame.fromOrientation(0, 0, math.random(0, math.pi * 2));
	const spreadAngle = CFrame.fromOrientation(math.rad(math.random(-8, 8)) * (1 - Accuracy), 0, 0);
	const finalDirection = directionCF.mul(spreadDirection).mul(spreadAngle).LookVector;
	Tool.Caster.Fire(Tool.MainPart.Position, finalDirection, Tool.Velocity, Tool.Behavior);
}

export function DrawShoot(Tool: Ranged, janitor: Janitor, animHoldEventName: string, anim: number) {
	const [Player, Char] = Tool.GetCharPlayer();
	Tool.Time = tick();
	Tool.ActiveAnimation = playAnim(Char, anim, { Fade: 0.4 });
	Tool.ActiveAnimation.Priority = Enum.AnimationPriority.Action;
	Tool.NotMoving = 0;

	Events.ToggleRangedGUI(Player, true);

	janitor.Add(
		Tool.ActiveAnimation.GetMarkerReachedSignal(animHoldEventName).Connect(() => {
			Tool.ActiveAnimation?.AdjustSpeed(0);
		}),
	);

	const Humanoid = Char.FindFirstChildWhichIsA("Humanoid");
	if (!Humanoid) {
		error("");
	}

	const PrevWalkSpeed = Humanoid.WalkSpeed;
	Humanoid.WalkSpeed = PrevWalkSpeed / 1.5;
	janitor.Add(() => {
		Humanoid.WalkSpeed = PrevWalkSpeed;
	});

	let WillNotMove = false;
	janitor.Add(
		RunService.Heartbeat.Connect(() => {
			if (Humanoid.MoveDirection !== new Vector3(0, 0, 0)) {
				WillNotMove = false;
				Tool.NotMoving = 0;
			} else {
				if (!WillNotMove) {
					Tool.NotMoving = 0.25;
					WillNotMove = true;
					task.wait(0.5);
					if (WillNotMove) {
						Tool.NotMoving = 1;
					}
				}
			}
		}),
	);

	let run = true;
	janitor.Add(() => {
		run = false;
		Events.ToggleRangedGUI(Player, false);
	});
	task.spawn(() => {
		while (run) {
			Events.UpdateRangedGUI(Player, CalculateAccuracy(Tool));
			task.wait(0.2);
		}
	});

	task.spawn(() => {
		task.wait(0.5);
		if (run) {
			RunMiddleware(RangedDrawMiddleWare, Tool);
		}
	});
}

export function CreateBehaviorParams(Tool: Ranged, BulletProvider?: PartCache) {
	const CastParams = new RaycastParams();
	CastParams.FilterType = Enum.RaycastFilterType.Blacklist;

	const Behavior = FastCast.newBehavior();
	Behavior.RaycastParams = CastParams;
	if (BulletProvider) {
		Behavior.CosmeticBulletProvider = BulletProvider;
	}
	Behavior.AutoIgnoreContainer = true;
	Behavior.Acceleration = Tool.Gravity;

	return [Behavior, CastParams] as [FastCastBehavior, RaycastParams];
}

export function ReleaseShot(Tool: Ranged, End: Callback) {
	if (Tool.ActiveAnimation === undefined || Tool.Time === undefined) {
		error("");
	}
	if (tick() - Tool.Time < Tool.MinWaitTime) {
		Tool.ActiveAnimation.Stop(0.3);
		End();
		return false;
	}

	RunMiddleware(RangedReleasedMiddleWare, Tool);

	Tool.ActiveAnimation.TimePosition = Tool.AnimationShootPosition;
	Tool.ActiveAnimation.AdjustSpeed(1);

	Fire(Tool);
	task.spawn(() => {
		if (!Tool.ActiveAnimation) {
			return;
		}
		task.wait(Tool.ActiveAnimation.Length - Tool.ActiveAnimation.TimePosition);
		Tool.ActiveAnimation.Stop(0.4);
		End();
	});
	return true;
}

export function ManageRay(Tool: Ranged) {
	const [Player, Char] = Tool.GetCharPlayer();

	Tool.janitor.Add(
		Events.MouseRay.connect((player, ray) => {
			if (player === Tool.Player) {
				Tool.Ray = ray;
			}
		}),
	);

	Tool.CastParams.FilterDescendantsInstances = [Char, Tool.instance];
}
