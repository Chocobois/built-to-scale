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

		this.board = new Board(this, 900, 500);

		this.stations = [];
		this.addStation(2, 3);
		this.addStation(4, 3);

		this.employees = [];
		this.addEmployee(5, 5);
		this.addEmployee(4, 5);

		this.customers = [];
		this.addCustomer(0, 0);
		this.addCustomer(1, 0);
		this.addCustomer(2, 0);

		this.ui = new UI(this);
		this.ui.setVisible(false);
	}

	update(time: number, delta: number) {
		this.stations.forEach((s) => s.update(time, delta));
		this.employees.forEach((e) => e.update(time, delta));
		this.customers.forEach((c) => c.update(time, delta));
	}

	// Add new station
	addStation(gridX: number, gridY: number) {
		const coord = this.board.getGridCell(gridX, gridY);
		const station = new Station(this, coord.x, coord.y);
		this.stations.push(station);
	}

	// Add new employee
	addEmployee(gridX: number, gridY: number) {
		const coord = this.board.getGridCell(gridX, gridY);
		const employee = new Employee(this, coord.x, coord.y);
		this.employees.push(employee);
	}

	// Add new customer
	addCustomer(gridX: number, gridY: number) {
		const coord = this.board.getGridCell(gridX, gridY);
		const customer = new Customer(this, coord.x, coord.y);
		this.customers.push(customer);

		// Picking up a customer
		customer.on("pickup", () => {
			if (customer.currentStation) {
				// customer.currentStation.setCustomer(null);
				// customer.setStation(null);
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
				if (customer.currentStation) {
					customer.currentStation.setCustomer(null);
					customer.setStation(null);
				}

				station.setCustomer(customer);
				customer.setStation(station);
				customer.lastX = station.x;
				customer.lastY = station.y;
			} else if (customer.currentStation) {
				customer.snapTo(customer.currentStation.x, customer.currentStation.y);
			} else {
				customer.snapTo(customer.lastX, customer.lastY);
			}
		});
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
