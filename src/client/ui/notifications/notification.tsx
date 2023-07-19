import { Linear, SingleMotor } from '@rbxts/flipper';
import { ContainerScheme, CustomColorGroup, Fonts, LowerCaseContainerScheme, ThemeProps } from '@rbxts/material-ui';
import Roact from '@rbxts/roact';
import { Trove } from '@rbxts/trove';
import { LowerCaseFirstLetter } from 'shared/modules/utils';

interface NotificationProps {
	Content: string;
	Duration: number;
	OnClose: () => void;
	OnPressed?: () => void;
	Title?: string;
	TitleColor?: Color3;
	ColorScheme?: ContainerScheme | 'Surface';
	CustomColorGroup?: CustomColorGroup['Colors'];
}

interface NotificationState {
	Pressed: boolean;
	Visible: boolean;
}

export default class NotificationBase extends Roact.Component<NotificationProps & ThemeProps, NotificationState> {
	FadeMotor: SingleMotor;
	FadeBinding: Roact.Binding<number>;
	StateMotor: SingleMotor;
	StateBinding: Roact.Binding<number>;
	Lifetime: number;
	Dismissed: boolean = false;
	Timeout?: thread;

	constructor(props: NotificationProps & ThemeProps) {
		super(props);

		this.Lifetime = this.props.Duration;

		this.FadeMotor = new SingleMotor(0);
		const [fadeBinding, setFadeBinding] = Roact.createBinding(this.FadeMotor.getValue());
		this.FadeBinding = fadeBinding;
		this.FadeMotor.onStep(setFadeBinding);

		this.StateMotor = new SingleMotor(0);
		const [stateBinding, setStateBinding] = Roact.createBinding(this.StateMotor.getValue());
		this.StateBinding = stateBinding;
		this.StateMotor.onStep(setStateBinding);

		this.setState({
			Pressed: false,
			Visible: true,
		});
	}

	public render(): Roact.Element | undefined {
		const theme = this.props.Theme;
		const colorScheme = this.props.ColorScheme || 'Surface';
		const lowerCaseColorScheme = LowerCaseFirstLetter(colorScheme) as LowerCaseContainerScheme | 'surface';

		const color = this.props.CustomColorGroup
			? this.props.CustomColorGroup.colorContainer
			: theme.Scheme[lowerCaseColorScheme];
		const onColor = this.props.CustomColorGroup
			? this.props.CustomColorGroup.onColorContainer
			: theme.Scheme[`on${colorScheme}`];

		let formattedContent = this.props.Content;

		if (this.props.Title) {
			const title = this.props.Title;
			const titleColor = this.props.TitleColor ? this.props.TitleColor.ToHex() : onColor.ToHex();

			formattedContent = `<font color="#${titleColor}" weight="heavy">${title}</font>: ${formattedContent}`;
		}

		return (
			<canvasgroup
				AutomaticSize={Enum.AutomaticSize.XY}
				BorderSizePixel={0}
				BackgroundColor3={color}
				GroupTransparency={this.FadeBinding.map((opacity) => {
					return 1 - opacity;
				})}
				Visible={this.state.Visible}
			>
				<uicorner CornerRadius={new UDim(0, 12)} />
				<textbutton
					AutoButtonColor={false}
					AutomaticSize={Enum.AutomaticSize.XY}
					BorderSizePixel={0}
					BackgroundColor3={onColor}
					BackgroundTransparency={this.StateBinding.map((opacity) => {
						return 1 - opacity;
					})}
					Text={''}
					Event={{
						MouseButton1Click: () => this.MouseClick(),
						MouseButton1Up: () => this.MouseUp(),
						MouseButton1Down: () => this.MouseDown(),
						MouseEnter: () => this.MouseEnter(),
						MouseLeave: () => this.MouseLeave(),
					}}
				>
					<uipadding
						PaddingBottom={new UDim(0, 10)}
						PaddingLeft={new UDim(0, 10)}
						PaddingRight={new UDim(0, 10)}
						PaddingTop={new UDim(0, 10)}
					/>
					<textlabel
						AutomaticSize={Enum.AutomaticSize.XY}
						BackgroundTransparency={1}
						Text={formattedContent}
						TextColor3={onColor}
						FontFace={Fonts.GothamMedium}
						TextSize={14}
						TextXAlignment={Enum.TextXAlignment.Left}
						RichText={!!this.props.Title}
						TextWrapped
					/>
				</textbutton>
			</canvasgroup>
		);
	}

	MouseClick() {
		if (this.state.Pressed) return;

		this.setState({
			Pressed: true,
		});

		if (this.props.OnPressed) {
			task.spawn(this.props.OnPressed);
		}
		this.Dismiss();
	}

	MouseUp() {
		this.StateMotor.setGoal(new Linear(0.08, { velocity: 0.5 }));
	}

	MouseDown() {
		this.StateMotor.setGoal(new Linear(0.12, { velocity: 0.5 }));
	}

	MouseEnter() {
		this.StateMotor.setGoal(new Linear(0.08, { velocity: 0.5 }));
	}

	MouseLeave() {
		this.StateMotor.setGoal(new Linear(0, { velocity: 0.5 }));
	}

	Dismiss() {
		if (!this.Dismissed) {
			this.Dismissed = true;

			this.FadeMotor.setGoal(new Linear(0, { velocity: 7 }));

			const trove = new Trove();
			const connection = this.FadeMotor.onComplete(() => {
				task.spawn(this.props.OnClose);

				this.setState({
					Visible: false,
				});

				trove.clean();
			});
			trove.add(connection, 'disconnect');
		}
	}

	protected didMount(): void {
		this.FadeMotor.setGoal(new Linear(1, { velocity: 7 }));

		this.Timeout = task.spawn(() => {
			let clock = os.clock();

			while (task.wait(1 / 10)) {
				const now = os.clock();
				const dt = now - clock;
				clock = now;

				this.Lifetime -= dt;
				if (this.Lifetime <= 0) {
					this.Dismiss();
				}
			}
		});
	}

	protected willUnmount(): void {
		if (this.Timeout) {
			task.cancel(this.Timeout);
		}
	}
}
