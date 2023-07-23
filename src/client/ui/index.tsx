import { Linear, SingleMotor } from '@rbxts/flipper';
import { ThemeState, Topbar, UIBase } from '@rbxts/material-ui';
import { Gotham } from '@rbxts/material-ui/out/Fonts';
import Roact from '@rbxts/roact';
import { connect } from '@rbxts/roact-rodux';
import { ClientState, clientStore } from 'client/state';
import { PanelState } from 'client/state/reducers/panelReducer';
import { PromptState } from 'client/state/reducers/promptReducer';
import { $package } from 'rbxts-transform-debug';
import { ClientAction } from 'shared/types';
import ActionTile from './actionTile';

interface MainProps {
	GroupInfo: GroupInfo;
	Actions: ClientAction[];
	Theme: ThemeState;
}

class PanelBase extends Roact.Component<MainProps & PromptState & PanelState> {
	scrimMotor: SingleMotor;
	scrimBinding: Roact.Binding<number>;

	constructor(props: MainProps & PromptState & PanelState) {
		super(props);

		this.scrimMotor = new SingleMotor(!!this.props.promptVisible ? 0.4 : 0);

		const [scrimBinding, setScrimBinding] = Roact.createBinding(this.scrimMotor.getValue());
		this.scrimBinding = scrimBinding;

		this.scrimMotor.onStep(setScrimBinding);
	}

	public render(): Roact.Element | undefined {
		const theme = this.props.Theme;

		const actionTiles = this.GetActionTiles();

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
				Closed={!this.props.panelVisible}
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
				</frame>
				<frame Key='Holder' Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
					<uilistlayout SortOrder='LayoutOrder' />
					<Topbar
						Title={`${
							this.props.GroupInfo.Name
						}<font color="#${theme.Scheme.onSurfaceVariant.ToHex()}" face="GothamMedium"> | Ranking Panel</font>`}
						RichText
						Theme={theme}
						CloseFunction={() => {
							clientStore.dispatch({ type: 'SetPanelVisible', panelVisible: false });
							clientStore.dispatch({ type: 'SetPromptArgs', promptArgs: [] });
							clientStore.dispatch({ type: 'SetPromptName', promptName: '' });
							clientStore.dispatch({ type: 'SetPromptVisible', promptVisible: false });
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
						{...actionTiles}
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
							Text={'v' + $package.version}
							TextColor3={theme.Scheme.onSurfaceVariant}
							TextScaled
						/>
					</frame>
				</frame>
			</UIBase>
		);
	}

	GetActionTiles() {
		const theme = this.props.Theme;

		const actionTiles: Roact.Element[] = [];
		for (const [_, action] of pairs(this.props.Actions)) {
			actionTiles.push(
				<ActionTile
					Title={action.Name}
					Description={action.Description}
					Theme={theme}
					PressedEvent={() => {
						clientStore.dispatch({ type: 'SetPromptArgs', promptArgs: action.Args });
						clientStore.dispatch({ type: 'SetPromptName', promptName: action.Name });
						clientStore.dispatch({ type: 'SetPromptVisible', promptVisible: true });
					}}
					Disabled={this.props.promptVisible || !this.props.panelVisible}
				/>,
			);
		}
		return actionTiles;
	}

	protected didUpdate(previousProps: MainProps & PromptState, previousState: {}): void {
		if (previousProps.promptVisible !== this.props.promptVisible) {
			this.scrimMotor.setGoal(new Linear(this.props.promptVisible ? 0.4 : 0, { velocity: 3.5 }));
		}
	}
}

export default connect<PromptState & PanelState, {}, MainProps, ClientState>((state, props) => {
	return { ...state.promptState, ...state.panelState };
})(PanelBase);
