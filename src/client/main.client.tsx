import { Scheme, Theme, ThemeState } from '@rbxts/material-ui';
import Roact from '@rbxts/roact';
import { StoreProvider } from '@rbxts/roact-rodux';
import { GroupService, Players } from '@rbxts/services';
import { Events } from './network';
import { panelStore } from './state';
import Panel from './ui';

const playerGui = Players.LocalPlayer.WaitForChild('PlayerGui') as PlayerGui;

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
			<StoreProvider store={panelStore}>
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
});
