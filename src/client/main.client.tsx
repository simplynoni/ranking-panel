import { Scheme, Theme, ThemeState } from '@rbxts/material-ui';
import Roact from '@rbxts/roact';
import { StoreProvider } from '@rbxts/roact-rodux';
import { ContextActionService, GroupService, Players } from '@rbxts/services';
import { Events } from './network';
import { clientStore } from './state';
import Panel from './ui';

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild('PlayerGui') as PlayerGui;

Events.InitializePanel.connect((settings, actions) => {
	const groupInfo = GroupService.GetGroupInfoAsync(settings.GroupId);
	const theme: ThemeState = {
		Color: settings.Color,
		Theme: settings.Theme,
		Scheme:
			settings.Theme === Theme.Dark ? Scheme.dark(settings.Color).Colors : Scheme.light(settings.Color).Colors,
	};

	Roact.mount(
		<screengui ResetOnSpawn={false} ZIndexBehavior={'Sibling'} IgnoreGuiInset>
			<StoreProvider store={clientStore}>
				<Panel
					GroupInfo={groupInfo}
					BotRank={settings.BotRank}
					Actions={actions}
					Theme={theme}
					RemoveCredit={settings.RemoveCredit}
				/>
			</StoreProvider>
		</screengui>,
		playerGui,
		'RankingPanel',
	);

	ContextActionService.BindAction(
		'OpenPanel',
		(_, state) => {
			if (state === Enum.UserInputState.Begin) {
				clientStore.dispatch({ type: 'SetPanelVisible', panelVisible: true });
			}
		},
		false,
		settings.Keybind,
	);

	Events.ShowPanel.connect(() => {
		clientStore.dispatch({ type: 'SetPanelVisible', panelVisible: true });
	});
});
