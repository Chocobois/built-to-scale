import { BaseScene } from "@/scenes/BaseScene";
import { Board } from "@/components/Board";
import { Employee } from "@/components/Employee";
import { Customer } from "@/components/Customer";
import { Station, StationType } from "@/components/Station";
import { UI } from "@/components/UI";
import { custom } from "@neutralinojs/lib";

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private board: Board;
	private stations: Station[];
	private employees: Employee[];
	private customers: Customer[];
	private ui: UI;
	private paused: boolean = false;
	private browsing: boolean = false;

	// Game stats
	private day: number = 0;
	private dayDuration: number = 60000; // 1 minute
	private timeOfDay: number = 0;
	private money: number = 0;

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.input.addPointer(2);
		this.input.dragDistanceThreshold = 10;

		this.background = this.add.image(0, 0, "background");
		this.background.setOrigin(0);
		this.fitToScreen(this.background);

		this.board = new Board(this, 930, 550);

		this.stations = [];
		this.addStation(0, 0, StationType.WaitingSeat);
		this.addStation(0, 1, StationType.WaitingSeat);
		this.addStation(0, 2, StationType.WaitingSeat);
		this.addStation(2, 2, StationType.HornAndNails);
		this.addStation(4, 2, StationType.HornAndNails);
		this.addStation(6, 1, StationType.ScalePolish);
		this.addStation(6, 3, StationType.GoldBath);
		this.addStation(7, 5, StationType.CashRegister);

		this.employees = [];
		this.addEmployee(1, 5);
		this.addEmployee(3, 5);

		this.customers = [];
		this.addCustomer();
		this.addCustomer();
		this.addCustomer();

		this.ui = new UI(this);

		this.startDay();
	}

	update(time: number, delta: number) {
		if (this.browsing || this.paused) {
			return;
		}
		this.stations.forEach((s) => s.update(time, delta));
		this.employees.forEach((e) => e.update(time, delta));
		this.customers.forEach((c) => c.update(time, delta));
	}

	// Start a new day
	startDay() {
		this.day += 1;
		this.ui.setDay(this.day);

		this.tweens.add({
			targets: this,
			timeOfDay: { from: 1, to: 0 },
			duration: this.dayDuration,
			onUpdate: (tween) => {
				this.timeOfDay = tween.getValue();
				this.ui.setTimeOfDay(this.timeOfDay);
			},
			onComplete: () => {
				this.endDay();
			},
		});
	}

	endDay() {}

	// Add new station
	addStation(gridX: number, gridY: number, type: StationType) {
		const coord = this.board.gridToCoord(gridX, gridY);
		const station = new Station(this, coord.x, coord.y, type);
		this.stations.push(station);

		// Station task completed
		station.on("taskend", () => {
			const customer = station.currentCustomer;
			const employee = customer?.currentEmployee;
			if (customer && employee) {
				customer.setAction(false);
				customer.setEmployee(null);
				employee.setAction(false);
				employee.setCustomer(null);

				customer.tasksCompleted += 1;
				customer.moneySpent += station.admissionFee;
				customer.nextActivity();
			}
		});
	}

	openInventory() {
		this.browsing = true;
	}

	// Add new employee
	addEmployee(gridX: number, gridY: number) {
		const coord = this.board.gridToCoord(gridX, gridY);
		const employee = new Employee(this, coord.x, coord.y);
		this.employees.push(employee);

		// Employee reached the destination
		employee.on("walkend", () => {
			const customer = employee.currentCustomer;
			if (customer && customer.currentStation) {
				// Play appropriate animations
				customer.setAction(true);
				employee.setAction(true);

				// Wait for station.on("taskend")
				customer.currentStation.startTask();
			} else {
				employee.setCustomer(null);
			}
		});
	}

	// Add new customer
	addCustomer() {
		const coord = this.board.gridToCoord(-8, 0);
		const customer = new Customer(this, coord.x, coord.y);
		this.customers.push(customer);

		// Place in available waiting seat
		const seat = this.getAvailableWaitingSeat();
		if (seat) {
			seat.setCustomer(customer);
			customer.setStation(seat);
			customer.snapTo(seat.x, seat.y);
		} else {
			console.error("Whoops");
		}

		// Set list of activities for customer
		this.setCustomerItinerary(customer);

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
				// Let go of previous station
				if (customer.currentStation) {
					customer.currentStation.setCustomer(null);
					customer.setStation(null);
				}

				station.setCustomer(customer);
				customer.setStation(station);
			} else if (customer.currentStation) {
				customer.snapTo(customer.currentStation.x, customer.currentStation.y);
			} else {
				customer.snapTo(customer.lastX, customer.lastY);
			}
		});

		// Clicking a customer
		customer.on("click", () => {
			if (customer.currentStation?.stationType == customer.requestedStation) {
				this.callEmployee(customer);
			}
		});

		// Customer leaving the game
		customer.on("offscreen", () => {
			this.customers = this.customers.filter((c) => c !== customer);
			customer.destroy();

			// Spawn new customer if shop is still open
			if (this.timeOfDay > 0 && this.getAvailableWaitingSeat()) {
				this.addCustomer();
			}
		});

		// Customer completing their itinerary and paying
		customer.on("pay", (money: number) => {
			this.money += money;
			this.ui.setMoney(this.money);
		});
	}

	// Get available seat for new customers to go to
	getAvailableWaitingSeat() {
		return this.stations.find(
			(s) => s.stationType === StationType.WaitingSeat && !s.currentCustomer
		);
	}

	// Find the closest station to the customer that is not occupied
	getClosestStation(customer: Customer): Station | null {
		let closestStation = null;
		let closestDistance = Infinity;
		const maxDistance = 150;

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
				distance < maxDistance &&
				station.stationType === customer.requestedStation
			) {
				closestStation = station;
				closestDistance = distance;
			}
		});
		return closestStation;
	}

	// Request an available employee to serve the customer
	callEmployee(customer: Customer) {
		// Abort if customer is not assigned to a station
		if (!customer.currentStation || customer.currentEmployee) {
			return;
		}

		let closestEmployee: any = null;
		let closestDistance = Infinity;

		this.employees.forEach((employee) => {
			const distance = Phaser.Math.Distance.Between(
				customer.x,
				customer.y,
				employee.x,
				employee.y
			);
			if (!employee.currentCustomer && distance < closestDistance) {
				closestEmployee = employee;
				closestDistance = distance;
			}
		});

		if (closestEmployee) {
			const station = customer.currentStation;
			const { gridX, gridY } = this.board.coordToGrid(station.x, station.y);
			const { x, y } = this.board.gridToCoord(gridX, gridY - 1);

			customer.setEmployee(closestEmployee);
			customer.setRequest(null);

			closestEmployee.setCustomer(customer);
			closestEmployee.walkTo(x, y);
			// Wait for employee.on("walkend")
		}
	}

	// Generate a list of requests for the customer
	setCustomerItinerary(customer: Customer) {
		function getActivities() {
			let activities = [];
			if (Math.random() < 0.5) {
				activities.push(StationType.HornAndNails);
			}
			if (Math.random() < 0.5) {
				activities.push(StationType.ScalePolish);
			}
			if (Math.random() < 0.5) {
				activities.push(StationType.GoldBath);
			}
			activities.push(StationType.CashRegister);
			return activities;
		}

		let activities: StationType[] = [];
		while (activities.length < 2) {
			activities = getActivities();
		}

		customer.itinerary = activities;
		customer.requestedStation = activities[0];
		customer.nextActivity();
	}
}
