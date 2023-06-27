import { Linear, SingleMotor } from '@rbxts/flipper';
import Roact from '@rbxts/roact';

import { ThemeProps } from '@rbxts/material-ui';
import { Gotham, GothamBold } from '@rbxts/material-ui/out/Fonts';

interface ColorTileProps extends ThemeProps {
	Title: string;
	Description?: string;
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;
	LayoutOrder?: number;
	PressedEvent?: () => void;
}

export default class CommandTile extends Roact.PureComponent<ColorTileProps> {
	stateMotor: SingleMotor;
	stateBinding: Roact.Binding<number>;

	constructor(props: ColorTileProps) {
		super(props);

		this.stateMotor = new SingleMotor(0);

		const [stateBinding, setStateBinding] = Roact.createBinding(this.stateMotor.getValue());

		this.stateBinding = stateBinding;

		this.stateMotor.onStep(setStateBinding);
	}

	render() {
		const theme = this.props.Theme;

		return (
			<textbutton
				Key='CommandTle'
				AnchorPoint={this.props.AnchorPoint}
				Position={this.props.Position}
				Size={this.props.Size ?? new UDim2(1, 0, 0, 72)}
				LayoutOrder={this.props.LayoutOrder}
				Text=''
				BorderSizePixel={0}
				BackgroundTransparency={this.stateBinding.map((opacity) => {
					return 1 - opacity;
				})}
				BackgroundColor3={theme.Scheme.onBackground}
				AutoButtonColor={false}
				Event={{
					MouseButton1Click: async () => {
						if (this.props.PressedEvent) {
							this.props.PressedEvent();
						}
					},
					MouseButton1Up: async () => {
						this.stateMotor.setGoal(new Linear(0.08, { velocity: 0.5 }));
					},
					MouseEnter: () => {
						this.stateMotor.setGoal(new Linear(0.08, { velocity: 0.5 }));
					},
					MouseButton1Down: () => {
						this.stateMotor.setGoal(new Linear(0.12, { velocity: 0.5 }));
					},
					MouseLeave: () => {
						this.stateMotor.setGoal(new Linear(0, { velocity: 0.5 }));
					},
				}}
			>
				<frame
					Key='Divider'
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 1, 1)}
					Size={new UDim2(1, -32, 0, 1)}
					BackgroundColor3={theme.Scheme.outline}
					BorderSizePixel={0}
				/>
				<frame
					Key='LeftAlign'
					AnchorPoint={new Vector2(0, 0.5)}
					Position={UDim2.fromScale(0, 0.5)}
					Size={UDim2.fromScale(0.65, 1)}
					BackgroundTransparency={1}
				>
					<uipadding
						PaddingBottom={new UDim(0, 12)}
						PaddingLeft={new UDim(0, 16)}
						PaddingRight={new UDim(0, 16)}
						PaddingTop={new UDim(0, 12)}
					/>
					<uilistlayout
						Padding={new UDim(0, 16)}
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>
					<frame Key='TextHolder' Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1} LayoutOrder={2}>
						<uilistlayout
							Padding={new UDim(0, 5)}
							FillDirection={Enum.FillDirection.Vertical}
							HorizontalAlignment={Enum.HorizontalAlignment.Left}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							SortOrder={Enum.SortOrder.LayoutOrder}
						/>
						<textlabel
							Key='Title'
							LayoutOrder={1}
							Size={UDim2.fromScale(1, 0.45)}
							BackgroundTransparency={1}
							FontFace={GothamBold}
							Text={this.props.Title}
							TextColor3={theme.Scheme.onBackground}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextScaled
						>
							<uitextsizeconstraint MaxTextSize={18} />
						</textlabel>
						{this.props.Description ? (
							<textlabel
								Key='Description'
								LayoutOrder={2}
								Size={UDim2.fromScale(1, 0.35)}
								BackgroundTransparency={1}
								FontFace={Gotham}
								Text={this.props.Description}
								TextColor3={theme.Scheme.onBackground}
								TextXAlignment={Enum.TextXAlignment.Left}
								TextScaled
							>
								<uitextsizeconstraint MaxTextSize={14} />
							</textlabel>
						) : undefined}
					</frame>
				</frame>
			</textbutton>
		);
	}
}
