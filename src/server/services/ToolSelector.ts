import { Service, OnStart, OnInit } from "@flamework/core";
import { Teams } from "@rbxts/services";
import { Events } from "server/events";
import Config from "shared/Config";
import { ToolService } from "./ToolService";

@Service({})
export class ToolSelector implements OnInit {
	PlayerAddedConnections = new Map<Team, RBXScriptConnection>();
	PlayerRemovedConnections = new Map<Team, RBXScriptConnection>();
	CharAddedConnections = new Map<Player, RBXScriptConnection>();
	CharRemovingConnections = new Map<Player, RBXScriptConnection>();
	ToolsReceived = new Map<Player, number>();
	CanReceive = new Map<Player, boolean>();
	ToolService: ToolService;

	constructor(ToolService: ToolService) {
		this.ToolService = ToolService;
	}

	onInit() {
		if (!Config.Elements.ToolSelector) {
			return;
		}

		Teams.GetTeams().forEach((team) => {
			this.initTeam(team);
		});
		Teams.ChildAdded.Connect((child) => {
			if (child.IsA("Team")) {
				this.initTeam(child);
			}
		});
		Teams.ChildRemoved.Connect((child) => {
			if (child.IsA("Team")) {
				this.destroyTeam(child);
			}
		});

		Events.GetTool.connect((player, tool) => {
			if (!this.CanReceive.get(player)) {
				return;
			}

			const ToolsReceived = this.ToolsReceived.get(player);
			if (ToolsReceived === undefined || ToolsReceived >= Config.Attributes.MaxGetTools) {
				return;
			}

			this.ToolsReceived.set(player, ToolsReceived + 1);

			const Team = player.Team;
			if (!Team) {
				return;
			}

			const toolModel = Team.FindFirstChild(tool);
			if (toolModel?.IsA("Model") && toolModel.GetChildren().size() === 0) {
				this.ToolService.addTool(tool as keyof typeof Config.Tools, player);
			}
		});
	}

	private initTeam(team: Team) {
		team.GetPlayers().forEach((player) => {
			this.initTeamPlayer(team, player);
		});
		this.PlayerAddedConnections.set(
			team,
			team.PlayerAdded.Connect((player) => this.initTeamPlayer(team, player)),
		);
		this.PlayerRemovedConnections.set(
			team,
			team.PlayerRemoved.Connect((player) => this.destroyTeamPlayer(team, player)),
		);
	}

	private destroyTeam(team: Team) {
		this.PlayerAddedConnections.get(team)?.Disconnect();
		this.PlayerRemovedConnections.get(team)?.Disconnect();

		this.PlayerAddedConnections.delete(team);
		this.PlayerRemovedConnections.delete(team);
	}

	private initTeamPlayer(team: Team, player: Player) {
		this.CanReceive.set(player, false);

		if (player.Character) {
			this.initTeamPlayerChar(team, player, player.Character);
		}
		this.CharAddedConnections.set(
			player,
			player.CharacterAdded.Connect((char) => this.initTeamPlayerChar(team, player, char)),
		);
		this.CharRemovingConnections.set(
			player,
			player.CharacterRemoving.Connect((char) => this.destroyTeamPlayerChar(team, player, char)),
		);
	}

	private destroyTeamPlayer(team: Team, player: Player) {
		this.CanReceive.set(player, false);

		this.CharAddedConnections.get(player)?.Disconnect();
		this.CharRemovingConnections.get(player)?.Disconnect();

		this.CharAddedConnections.delete(player);
		this.CharRemovingConnections.delete(player);
	}

	private initTeamPlayerChar(team: Team, player: Player, character: Model) {
		this.ToolsReceived.set(player, 0);
		this.CanReceive.set(player, true);
	}

	private destroyTeamPlayerChar(team: Team, player: Player, character: Model) {
		this.CanReceive.set(player, false);
	}
}
