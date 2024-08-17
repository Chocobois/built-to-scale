import { BaseScene } from "@/scenes/BaseScene";
import { Board } from "@/components/Board";
import { Employee } from "@/components/Employee";
import { Customer } from "@/components/Customer";
import { Station } from "@/components/Station";
import { UI } from "@/components/UI";
import { StationId, StationType } from "@/components/StationData";
import { Inventory } from "@/components/Inventory";
import { SimpleButton } from "@/components/elements/SimpleButton";
import { ToggleButton } from "@/components/elements/ToggleButton";
import { ItemButton } from "@/components/ItemButton";
import { ItemHandler } from "@/components/ItemHandler";
import { UpgradeOverlay } from "@/components/UpgradeOverlay";
import { SummaryOverlay } from "@/components/SummaryOverlay";
import { EmployeeId } from "@/components/EmployeeData";
import { BlockType, LevelData, LevelId } from "@/components/Levels";

enum GameState {
	Cutscene,
	Day,
	Shopping,
}

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private board: Board;
	private stations: Station[];
	private employees: Employee[];
	private customers: Customer[];
	private ui: UI;
	private upgradeOverlay: UpgradeOverlay;
	private summaryOverlay: SummaryOverlay;
	private paused: boolean = false;
	private browsing: boolean = false;
	private inventory: Inventory;
	private invButton: ToggleButton;
	private iHandler: ItemHandler;
	public activeItem: ItemButton;

	// Game stats
	public state: GameState = GameState.Cutscene;
	public day: number = 0;
	public dayDuration: number = 60000; // 1 minute
	public timeOfDay: number = 0;
	public money: number = 0;
	public dailyStats: {
		money: number;
		happyCustomers: number;
		angryCustomers: number;
	};

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.input.addPointer(2);
		this.input.dragDistanceThreshold = 10;

		this.background = this.add.image(0, 0, "grid1");
		this.background.setOrigin(0);
		this.fitToScreen(this.background);

		this.board = new Board(this, this.CX, this.CY, 6, 4);

		this.stations = [];
		// this.addStation(0, 0, StationId.WaitingSeatTier1);
		// this.addStation(0, 1, StationId.WaitingSeatTier2);
		// this.addStation(0, 2, StationId.WaitingSeatTier3);
		// this.addStation(2, 2, StationId.HornAndNailsTier1);
		// this.addStation(3, 2, StationId.HornAndNailsTier2);
		// this.addStation(4, 2, StationId.HornAndNailsTier3);
		// this.addStation(2, 0, StationId.HornAndNailsTier1);
		// this.addStation(3, 0, StationId.HornAndNailsTier2);
		// this.addStation(4, 0, StationId.HornAndNailsTier3);
		// this.addStation(5, 1, StationId.ScalePolishTier1);
		// this.addStation(6, 1, StationId.ScalePolishTier2);
		// this.addStation(7, 1, StationId.ScalePolishTier3);
		// this.addStation(5, 3, StationId.GoldBathTier1);
		// this.addStation(6, 3, StationId.GoldBathTier2);
		// this.addStation(7, 3, StationId.GoldBathTier3);
		// this.addStation(5, 5, StationId.CashRegister);

		this.employees = [];
		// this.addEmployee(0, 5, EmployeeId.RaccoonTier1);
		// this.addEmployee(1, 5, EmployeeId.RaccoonTier1);
		// this.addEmployee(2, 5, EmployeeId.RaccoonTier1);
		// this.addEmployee(3, 5, EmployeeId.HumanTier1);

		this.customers = [];

		this.ui = new UI(this);
		this.ui.setDepth(1000);
		this.iHandler = new ItemHandler(this);

		this.inventory = new Inventory(this,-650,0,[4,5,2,6,3,0,0,0,0,0,0,0,0]);
		this.invButton = new ToggleButton(this,64,540,"invbutton");
		this.add.existing(this.invButton);
        this.invButton.on("click", ()=> {this.toggleInventory()});
		this.inventory.setDepth(10);
		this.invButton.setDepth(9);
		this.invButton.setAlpha(0.75);
		this.activeItem = new ItemButton(this,-500, -500, this.inventory, -1, -100, "blankspr");
		this.ui.setMoney(this.money);
		this.ui.setDay(this.day);
		this.ui.on("nextDay", () => {
			this.startDay();
		});

		this.upgradeOverlay = new UpgradeOverlay(this);
		this.upgradeOverlay.setDepth(1010);
		this.upgradeOverlay.on("upgradeStation", (station: Station) => {
			this.money -= station.upgradeCost;
			this.ui.setMoney(this.money);
			station.upgrade();
			this.upgradeOverlay.selectStation(station);
		});
		this.upgradeOverlay.on("upgradeEmployee", (employee: Employee) => {
			this.money -= employee.upgradeCost;
			this.ui.setMoney(this.money);
			employee.upgrade();
			this.upgradeOverlay.selectEmployee(employee);
		});
		this.upgradeOverlay.on("close", () => {
			this.sortDepth();
		});

		this.summaryOverlay = new SummaryOverlay(this);
		this.summaryOverlay.setDepth(1020);
		this.summaryOverlay.on("progress", () => {
			this.summaryOverlay.setVisible(false);
		});

		/* Init */

		// TEMPORARY: Spawn customers every 5 seconds, if allowed
		this.time.addEvent({
			delay: 5000,
			callback: () => {
				// Spawn new customer if shop is still open
				if (
					this.state == GameState.Day &&
					this.timeOfDay > 0 &&
					this.getAvailableWaitingSeat()
				) {
					this.addCustomer();
				}
			},
			loop: true,
		});

		// this.setState(GameState.Shopping);
		this.loadLevel(LevelId.Level1);
		this.startDay();
	}

	update(time: number, delta: number) {
		if (this.browsing || this.paused) {
			return;
		}
		this.stations.forEach((s) => s.update(time, delta));
		this.employees.forEach((e) => e.update(time, delta));
		this.customers.forEach((x) => x.update(time, delta));

		this.ui.update(time, delta);
		this.summaryOverlay.update(time, delta);
		this.activeItem.update(time,delta);
		if(this.activeItem.state == 3){
			this.snapItem();
		}
		this.upgradeOverlay.update(time, delta);

		// Depth sorting hack
		if (this.state === GameState.Day) {
			this.sortDepth();
		}
	}

	// Set game state
	setState(state: GameState) {
		this.state = state;

		const isShopping = state === GameState.Shopping;

		this.stations.forEach((s) => s.setClickable(isShopping));
		this.employees.forEach((e) => e.setClickable(isShopping));
		this.ui.setShoppingMode(isShopping);
		if (isShopping) this.summaryOverlay.open();
	}

	// Load level data
	loadLevel(id: LevelId) {
		const level = LevelData[id];

		this.background.setTexture(level.background);
		this.board.resize(level.width, level.height);

		// Clear all stations, employees, and customers
		this.stations.forEach((s) => s.destroy());
		this.employees.forEach((e) => e.destroy());
		this.customers.forEach((c) => c.destroy());
		this.stations = [];
		this.employees = [];
		this.customers = [];

		// Load level data items
		for (let y = 0; y < level.height; y++) {
			for (let x = 0; x < level.width; x++) {
				const gridX = x;
				const gridY = y;
				const block = level.grid[y][x];

				switch (block) {
					case BlockType.Empty:
						break;
					case BlockType.Wall:
						break;
					case BlockType.WaitingSeat:
						this.addStation(gridX, gridY, StationId.WaitingSeatTier1);
						break;
					case BlockType.HornAndNails:
						this.addStation(gridX, gridY, StationId.HornAndNailsTier1);
						break;
					case BlockType.ScalePolish:
						this.addStation(gridX, gridY, StationId.ScalePolishTier1);
						break;
					case BlockType.GoldBath:
						this.addStation(gridX, gridY, StationId.GoldBathTier1);
						break;
					case BlockType.CashRegister:
						this.addStation(gridX, gridY, StationId.CashRegister);
						break;
					case BlockType.Employee:
						this.addEmployee(gridX, gridY, EmployeeId.RaccoonTier1);
						break;
				}
			}
		}
	}

	// Start a new day
	startDay() {
		this.setState(GameState.Day);
		this.day += 1;
		this.ui.setDay(this.day);

		// Reset daily stats
		this.dailyStats = { money: 0, happyCustomers: 0, angryCustomers: 0 };

		// Reset depth
		this.stations.forEach((s) => s.setDepth(0));
		this.employees.forEach((e) => e.setDepth(0));

		// TEMP: Add first customer
		this.addCustomer();

		// Setup daytime tween
		this.tweens.add({
			targets: this,
			timeOfDay: { from: 1, to: 0 },
			duration: this.dayDuration,
			onUpdate: (tween) => {
				this.timeOfDay = tween.getValue();
				this.ui.setTimeOfDay(this.timeOfDay);
			},
		});
	}

	endDay() {
		this.employees.forEach((e) => e.walkTo(e.startX, e.startY));

		this.setState(GameState.Shopping);
	}

	// Add new station
	addStation(gridX: number, gridY: number, id: StationId) {
		const coord = this.board.gridToCoord(gridX, gridY);
		const station = new Station(this, coord.x, coord.y, id);
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

		// Station clicked during shopping
		station.on("click", () => {
			if (this.state === GameState.Shopping && !this.upgradeOverlay.visible) {
				this.upgradeOverlay.selectStation(station);

				this.sortDepth();
				station.setDepth(2000);
			}
		});
	}

	openInventory() {
		this.browsing = true;
	}

	// Add new employee
	addEmployee(gridX: number, gridY: number, id: EmployeeId) {
		const coord = this.board.gridToCoord(gridX, gridY);
		const employee = new Employee(this, coord.x, coord.y, id);
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

		// Employee clicked during shopping
		employee.on("click", () => {
			if (this.state === GameState.Shopping && !this.upgradeOverlay.visible) {
				this.upgradeOverlay.selectEmployee(employee);

				this.sortDepth();
				employee.setDepth(2000);
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

			// Open overlay if no more customers
			if (this.customers.length === 0) {
				this.endDay();
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

			customer.setRequest(null);
			customer.setEmployee(closestEmployee);

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

	toggleInventory(){
		this.inventory.toggle();
		if(this.inventory.isOpen) {
			this.invButton.setPosition(714,540);
			this.invButton.toggleForward();
		} else {
			this.invButton.setPosition(64,540);
			this.invButton.toggleBackward();
		}
	}

	setActiveItem(i: ItemButton){
		this.activeItem.destroy();
		this.activeItem = i;
		this.activeItem.on("itemdrop", () => {
			this.cleanUpItem();
		});

		this.add.existing(this.activeItem);
		//new ItemButton(this,-500, -500, this.inventory, -1, -100, "blankspr");
	}

	parseItems(i: number, st: Station, c: Customer){
		this.iHandler.process(this.inventory.itemList[i], st,c);
	}

	snapItem() {
		let s = this.getClosestStationToItem(this.activeItem);
		if(s) {
			this.activeItem.snapTo(s.x,s.y);
		}
	}

	cleanUpItem(){
		let s = this.getClosestStationToItem(this.activeItem);
		if(s) {
			s.applyItem(this.activeItem.id,this.activeItem.sprname);
			this.sound.play("place");
		} else {
			this.inventory.returnItem(this.activeItem.id);
			this.sound.play("return");
		}
		this.activeItem.destroy();
		this.activeItem = new ItemButton(this,-500, -500, this.inventory, -1, -100, "blankspr");
	}

	getClosestStationToItem(item: ItemButton): Station | null {
		let closestStation = null;
		let closestDistance = Infinity;
		const maxDistance = 75;

		this.stations.forEach((station) => {
			const distance = Phaser.Math.Distance.Between(
				item.dragX,
				item.dragY,
				station.x,
				station.y
			);
			if (
				!station.currentCustomer &&
				distance < closestDistance &&
				distance < maxDistance &&
				station.appliedItems.length < 3
			) {
				closestStation = station;
				closestDistance = distance;
			}
		});
		return closestStation;
	}

	sortDepth() {
		this.stations.forEach((s) => s.setDepth(s.y / 100 + 0));
		this.employees.forEach((e) => e.setDepth(e.y / 100 + 1));
		this.customers.forEach((c) =>
			c.setDepth(c.y / 100 + (c.dragged ? 100 : 1))
		);
	}
}
