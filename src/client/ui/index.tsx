import { Linear, SingleMotor } from '@rbxts/flipper';
import Llama from '@rbxts/llama';
import { ThemeState, Topbar, UIBase } from '@rbxts/material-ui';
import { Gotham } from '@rbxts/material-ui/out/Fonts';
import Roact from '@rbxts/roact';
import { connect } from '@rbxts/roact-rodux';
import { PanelState, panelStore } from 'client/state';
import { PromptState } from 'client/state/reducers/promptReducer';
import { $package } from 'rbxts-transform-debug';
import { PromptArg, PromptType } from 'shared/types';
import ActionTile from './actionTile';
import Prompt from './prompt';

interface MainProps {
	GroupName: string;
	GroupId: number;
	Theme: ThemeState;
	RemoveCredit?: boolean;
}

class PanelBase extends Roact.Component<MainProps & PromptState> {
	scrimMotor: SingleMotor;
	scrimBinding: Roact.Binding<number>;

	constructor(props: MainProps & PromptState) {
		super(props);

		this.scrimMotor = new SingleMotor(!!this.props.promptVisible ? 0.4 : 0);

		const [scrimBinding, setScrimBinding] = Roact.createBinding(this.scrimMotor.getValue());
		this.scrimBinding = scrimBinding;

		this.scrimMotor.onStep(setScrimBinding);
	}

	public render(): Roact.Element | undefined {
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
					BackgroundTransparency={this.scrimBinding.map((opacity) => {
						return 1 - opacity;
					})}
				>
					<uicorner CornerRadius={new UDim(0, 16)} />
					<Prompt
						GroupId={this.props.GroupId}
						Visible={this.props.promptVisible}
						Name={this.props.promptName}
						Args={this.props.promptArgs}
						Theme={theme}
					/>
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
						ScrollingEnabled={!this.props.promptVisible}
					>
						<uilistlayout SortOrder='LayoutOrder' />
						{/* todo */}
						<ActionTile
							Title='Rank'
							Description='Moves the user to a specified rank in the group.'
							Theme={theme}
							PressedEvent={() => {
								const arg1: PromptArg = {
									Name: 'test',
									Type: PromptType.Rank,
									Value: 0,
									OnChanged: (value) => {
										const args = Llama.Dictionary.copyDeep(
											panelStore.getState().promptState.promptArgs,
										);
										const arg = args[0];
										if (arg) {
											arg.Value = value;
										}
										args[0] = arg;
										panelStore.dispatch({ type: 'SetPromptArgs', promptArgs: args });
									},
								};
								const arg2: PromptArg = {
									Name: 'test2',
									Type: PromptType.User,
									Value: 0,
									OnChanged: (value) => {
										const args = Llama.Dictionary.copyDeep(
											panelStore.getState().promptState.promptArgs,
										);
										const arg = args[1];
										if (arg) {
											arg.Value = value;
										}
										args[1] = arg;
										panelStore.dispatch({ type: 'SetPromptArgs', promptArgs: args });
									},
								};
								panelStore.dispatch({ type: 'SetPromptArgs', promptArgs: [arg1, arg2] });
								panelStore.dispatch({ type: 'SetPromptName', promptName: 'Rank' });
								panelStore.dispatch({ type: 'SetPromptVisible', promptVisible: true });
							}}
							Disabled={this.props.promptVisible}
						/>
						<ActionTile
							Title='Promote'
							Description='Moves the user one rank up in the group.'
							Theme={theme}
							Disabled={this.props.promptVisible}
						/>
						<ActionTile
							Title='Demote'
							Description='Moves the user one rank down in the group.'
							Theme={theme}
							Disabled={this.props.promptVisible}
						/>
						<ActionTile
							Title='Fire'
							Description='Moves the user to the first rank in the group.'
							Theme={theme}
							Disabled={this.props.promptVisible}
						/>
						<ActionTile
							Title='Shout'
							Description='Posts a shout on the group.'
							Theme={theme}
							Disabled={this.props.promptVisible}
						/>
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

	protected didUpdate(previousProps: MainProps & PromptState, previousState: {}): void {
		if (previousProps.promptVisible !== this.props.promptVisible) {
			this.scrimMotor.setGoal(new Linear(this.props.promptVisible ? 0.4 : 0, { velocity: 3.5 }));
		}
	}
}

export default connect<PromptState, {}, MainProps, PanelState>((state, props) => {
	return { ...state.promptState };
})(PanelBase);
