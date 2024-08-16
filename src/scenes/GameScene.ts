import { BaseScene } from "@/scenes/BaseScene";
import { Employee } from "@/components/Employee";
import { Customer } from "@/components/Customer";
import { Station } from "@/components/Station";
import { UI } from "@/components/UI";

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private stations: Station[];
	private employees: Employee[];
	private customers: Customer[];
	private ui: UI;

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.input.addPointer(2);

		this.background = this.add.image(0, 0, "background");
		this.background.setOrigin(0);
		this.fitToScreen(this.background);

		this.stations = [
			new Station(this, 200, 800),
			new Station(this, 400, 800),
			new Station(this, 600, 800),
		];

		this.employees = [
			new Employee(this, 200, 200),
			new Employee(this, 400, 200),
		];

		this.customers = [
			new Customer(this, 200, 500),
			new Customer(this, 400, 500),
			new Customer(this, 600, 500),
		];

		this.ui = new UI(this);
		this.ui.setVisible(false);
	}

	update(time: number, delta: number) {
		this.stations.forEach((s) => s.update(time, delta));
		this.employees.forEach((e) => e.update(time, delta));
		this.customers.forEach((c) => c.update(time, delta));
	}
}
