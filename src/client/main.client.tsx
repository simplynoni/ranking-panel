import { Scheme, Theme, ThemeState } from '@rbxts/material-ui';
import Roact from '@rbxts/roact';
import { GroupService, Players } from '@rbxts/services';
import { Events } from './network';
import MainUI from './ui';

const playerGui = Players.LocalPlayer.WaitForChild('PlayerGui') as PlayerGui;

Events.InitializePanel.connect((settings) => {
	const groupInfo = GroupService.GetGroupInfoAsync(settings.GroupId);
	const theme: ThemeState = {
		Color: settings.Color,
		Theme: settings.Theme,
		Scheme:
			settings.Theme === Theme.Dark ? Scheme.dark(settings.Color).Colors : Scheme.light(settings.Color).Colors,
	};

	Roact.mount(
		<screengui ResetOnSpawn={false} IgnoreGuiInset>
			<MainUI GroupName={groupInfo.Name} Theme={theme} RemoveCredit={settings.RemoveCredit} />
		</screengui>,
		playerGui,
		'RankingPanel',
	);
});
