import { Instant, Linear, SingleMotor } from '@rbxts/flipper';
import Roact from '@rbxts/roact';
import { Trove } from '@rbxts/trove';

interface RouteState {
	PageVisible: boolean;
}

export default class RouteBase<Props = {}> extends Roact.Component<
	{ Visible: boolean; Instant: boolean } & Props,
	RouteState
> {
	positionMotor: SingleMotor;
	positionBinding: Roact.Binding<number>;
	fadeMotor: SingleMotor;
	fadeBinding: Roact.Binding<number>;

	constructor(props: { Visible: boolean; Instant: boolean } & Props) {
		super(props);

		this.positionMotor = new SingleMotor(!!this.props.Visible ? 0.5 : 1);

		const [positionBinding, setPositionBinding] = Roact.createBinding(this.positionMotor.getValue());
		this.positionBinding = positionBinding;

		this.positionMotor.onStep(setPositionBinding);

		this.fadeMotor = new SingleMotor(!!this.props.Visible ? 0 : 0.25);

		const [fadeBinding, setFadeBinding] = Roact.createBinding(this.fadeMotor.getValue());
		this.fadeBinding = fadeBinding;

		this.fadeMotor.onStep(setFadeBinding);

		this.setState({
			PageVisible: !!this.props.Visible,
		});
	}

	public render(): Roact.Element | undefined {
		return;
	}

	private setClosed(closed: boolean) {
		const trove = new Trove();

		if (closed === false) {
			// OPEN
			this.setState({
				PageVisible: true,
			});

			if (!this.props.Instant) {
				this.positionMotor.setGoal(new Linear(0.5, { velocity: 2.5 }));
				this.fadeMotor.setGoal(new Instant(0));
			} else {
				this.positionMotor.setGoal(new Instant(0.5));
				this.fadeMotor.setGoal(new Instant(0));
			}
		} else {
			// CLOSED
			if (!this.props.Instant) {
				this.positionMotor.setGoal(new Linear(-0.25, { velocity: 3.5 }));
				this.fadeMotor.setGoal(new Linear(0.75, { velocity: 5 }));
			} else {
				this.positionMotor.setGoal(new Instant(-0.25));
				this.fadeMotor.setGoal(new Instant(0.75));
			}

			const onComplete = this.positionMotor.onComplete(() => {
				if (!this.props.Visible) {
					this.setState({
						PageVisible: false,
					});
					this.positionMotor.setGoal(new Instant(1));
				}

				trove.clean();
			});

			trove.add(() => onComplete.disconnect());
		}
	}

	protected didUpdate(previousProps: { Visible: boolean }): void {
		if (this.props.Visible !== previousProps.Visible) {
			this.setClosed(!this.props.Visible);
		}
	}
}
