import { ThemeState, Topbar, UIBase } from '@rbxts/material-ui';
import { Gotham } from '@rbxts/material-ui/out/Fonts';
import Roact from '@rbxts/roact';
import { connect } from '@rbxts/roact-rodux';
import { Router } from '@rbxts/roact-router';
import { PanelState, panelStore } from 'client/state';
import { PromptState } from 'client/state/reducers/promptReducer';
import { $package } from 'rbxts-transform-debug';
import { PromptArg, PromptType } from 'shared/types';
import CommandTile from './actionTile';
import Prompt from './prompt';

interface MainProps {
	GroupName: string;
	GroupId: number;
	Theme: ThemeState;
	RemoveCredit?: boolean;
}

class PanelBase extends Roact.Component<MainProps & PromptState> {
	public render(): Roact.Element | undefined {
		print(this.props);
		const theme = this.props.Theme;
		return (
			<UIBase
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.425, 0.5)}
				AspectRatio={1.869}
				AspectType={Enum.AspectType.ScaleWithParentSize}
				MaxSize={new Vector2(1000)}
				MinSize={new Vector2(500)}
				Theme={theme}
			>
				<frame
					Key='Scrim'
					Size={UDim2.fromScale(1, 1)}
					BackgroundColor3={Color3.fromRGB(0, 0, 0)}
					BackgroundTransparency={0.6} // todo
				>
					<uicorner CornerRadius={new UDim(0, 16)} />
					<Router>
						<Prompt GroupId={this.props.GroupId} Visible={this.props.promptVisible} Theme={theme} />
					</Router>
				</frame>
				<frame Key='Holder' Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
					<uilistlayout SortOrder='LayoutOrder' />
					<Topbar
						Title={`${
							this.props.GroupName
						}<font color="#${theme.Scheme.onSurfaceVariant.ToHex()}" face="GothamMedium"> | Ranking Panel</font>`}
						RichText
						Theme={theme}
						CloseFunction={() => {
							// todo
							print('close');
						}}
					/>
					<scrollingframe
						Key='Main'
						Size={new UDim2(1, -2, 0.775, 0)}
						CanvasSize={new UDim2()}
						AutomaticCanvasSize='Y'
						ScrollBarImageColor3={theme.Scheme.outline}
						ScrollBarThickness={3}
						BorderSizePixel={0}
						BackgroundTransparency={1}
					>
						<uilistlayout SortOrder='LayoutOrder' />
						{/* todo */}
						<CommandTile
							Title='Rank'
							Description='Moves the user to a specified rank in the group.'
							Theme={theme}
							PressedEvent={() => {
								panelStore.dispatch({ type: 'SetPromptVisible', promptVisible: true });
							}}
						/>
						<CommandTile
							Title='Promote'
							Description='Moves the user one rank up in the group.'
							Theme={theme}
						/>
						<CommandTile
							Title='Demote'
							Description='Moves the user one rank down in the group.'
							Theme={theme}
						/>
						<CommandTile
							Title='Fire'
							Description='Moves the user to the first rank in the group.'
							Theme={theme}
						/>
						<CommandTile Title='Shout' Description='Posts a shout on the group.' Theme={theme} />
					</scrollingframe>
					<frame Key='Footer' Size={UDim2.fromScale(1, 0.075)} BackgroundTransparency={1}>
						<frame
							Key='Divider'
							Size={new UDim2(1, 0, 0, 1)}
							BorderSizePixel={0}
							BackgroundColor3={theme.Scheme.outline}
						/>
						<textlabel
							Key='FooterText'
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.5, 0.5)}
							BackgroundTransparency={1}
							FontFace={Gotham}
							Text={`${this.props.RemoveCredit ? '' : 'Made with ♥ by simplynoni | '}v${
								$package.version
							}`}
							TextColor3={theme.Scheme.onSurfaceVariant}
							TextScaled
						/>
					</frame>
				</frame>
			</UIBase>
		);
	}

	protected didMount(): void {
		const arg1 = identity<PromptArg>({
			Name: 'test',
			Type: PromptType.Rank,
			OnChanged: (value) => {
				print(value);
			},
		});
		panelStore.dispatch({ type: 'SetPromptArgs', promptArgs: [arg1] });
	}
}

export default connect<PromptState, {}, MainProps, PanelState>((state, props) => {
	return { ...state.promptState };
})(PanelBase);
