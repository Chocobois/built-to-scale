import { BaseScene } from "@/scenes/BaseScene";
import { Board } from "@/components/Board";
import { Employee } from "@/components/Employee";
import { Customer } from "@/components/Customer";
import { Station } from "@/components/Station";
import { UI } from "@/components/UI";
import { custom } from "@neutralinojs/lib";

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private board: Board;
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

		this.board = new Board(this, 1300, 500);

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

		// Customer interaction logic
		this.customers.forEach((customer) => {
			// Picking up a customer
			customer.on("pickup", () => {
				if (customer.currentStation) {
					customer.currentStation.currentCustomer = null;
					customer.currentStation = null;
				}
			});

			// Dragging a customer
			customer.on("drag", () => {
				let station = this.getClosestStation(customer);
				if (station) {
					customer.snapTo(station.x, station.y);
				}
			});

			// Dropping a customer
			customer.on("drop", () => {
				let station = this.getClosestStation(customer);
				if (station) {
					station.currentCustomer = customer;
					customer.currentStation = station;
				} else if (customer.currentStation) {
					customer.snapTo(customer.currentStation.x, customer.currentStation.y);
				}
			});
		});
	}

	update(time: number, delta: number) {
		this.stations.forEach((s) => s.update(time, delta));
		this.employees.forEach((e) => e.update(time, delta));
		this.customers.forEach((c) => c.update(time, delta));
	}

	// Find the closest station to the customer that is not occupied
	getClosestStation(customer: Customer): Station | null {
		let closestStation = null;
		let closestDistance = Infinity;
		const maxDistance = 100;

		this.stations.forEach((station) => {
			const distance = Phaser.Math.Distance.Between(
				customer.dragX,
				customer.dragY,
				station.x,
				station.y
			);
			if (
				!station.currentCustomer &&
				distance < closestDistance &&
				distance < maxDistance
			) {
				closestStation = station;
				closestDistance = distance;
			}
		});
		return closestStation;
	}
}
