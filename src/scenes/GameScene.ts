import { BaseScene } from "@/scenes/BaseScene";
import { Board, GridPoint } from "@/components/Board";
import { Employee } from "@/components/Employee";
import { Customer } from "@/components/Customer";
import { CustomerId } from "@/components/CustomerData";
import { Station } from "@/components/Station";
import { UI } from "@/components/UI";
import { StationData, StationId, StationType } from "@/components/StationData";
import { Inventory } from "@/components/Inventory";
import { SimpleButton } from "@/components/elements/SimpleButton";
import { ToggleButton } from "@/components/elements/ToggleButton";
import { ItemButton } from "@/components/ItemButton";
import { ItemHandler } from "@/components/ItemHandler";
import { UpgradeOverlay } from "@/components/UpgradeOverlay";
import { SummaryOverlay } from "@/components/SummaryOverlay";
import { EmployeeData, EmployeeId } from "@/components/EmployeeData";
import { BlockType, LevelData, LevelId } from "@/components/Levels";
import { Effect } from "@/components/Effect";
import { TextEffect } from "@/components/TextEffect";
import { BasicEffect } from "@/components/BasicEffect";
import { Intermission, Mode } from "@/components/Intermission";
import { SnapType } from "@/components/Item";

import { NavMesh } from "navmesh";
import {
	centerOnSubdividedCoord,
	GenerateNavMesh,
} from "@/utils/NavMeshHelper";

enum GameState {
	Cutscene,
	Day,
	Shopping,
	Intermission,
}

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private board: Board;
	private stations: Station[];
	private employees: Employee[];
	private customers: Customer[];
	private ui: UI;
	private intermission: Intermission;
	private upgradeOverlay: UpgradeOverlay;
	private summaryOverlay: SummaryOverlay;
	private paused: boolean = false;
	private browsing: boolean = false;
	private inventory: Inventory;
	private invButton: ToggleButton;
	private iHandler: ItemHandler;
	public activeItem: ItemButton;

	public effects: Effect[];
	private navmesh: NavMesh;

	// Game stats
	public state: GameState = GameState.Cutscene;
	public level: LevelId = LevelId.Level1;
	public day: number = 0;
	public dayDuration: number = 60000; // 1 minute
	public timeOfDay: number = 0;
	public customerSpawnTimer: Phaser.Time.TimerEvent;
	public customerSpawnPool: CustomerId[] = [];
	public money: number = 500;
	public dailyStats: {
		money: number;
		happyCustomers: number;
		angryCustomers: number;
	};

	// Keeps track of made purchases when starting a level
	public savedPurchases: {
		stations: StationId[];
		employees: EmployeeId[];
	};

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		// Touch input settings
		this.input.addPointer(2);
		this.input.dragDistanceThreshold = 10;

		// Reset daily stats
		this.dailyStats = { money: 0, happyCustomers: 0, angryCustomers: 0 };
		this.savedPurchases = {
			stations: [
				StationId.WaitingSeatTier1,
				StationId.HornAndNailsTier1,
				StationId.ScalePolishTier1,
				StationId.CashRegister,
			],
			employees: [EmployeeId.RaccoonTier1],
		};

		// Background
		this.background = this.add.image(0, 0, "grid1");
		this.background.setOrigin(0);
		this.fitToScreen(this.background);

		this.board = new Board(this, this.CX, this.CY, 6, 4, 100);

		this.stations = [];
		this.employees = [];
		this.customers = [];

		this.ui = new UI(this);
		this.ui.setDepth(1000);
		this.ui.on("nextDay", () => {
			this.startDay();
		});
		this.ui.on("nextLevel", () => {
			const upgradeCost = LevelData[this.level].upgradeCost ?? 0;
			if (this.money >= upgradeCost) {
				this.money -= upgradeCost;
				this.ui.setMoney(this.money);
				this.intermission.fadeToIntermission(Mode.NextLevelCutscene);
			}
		});

		this.iHandler = new ItemHandler(this);

		this.intermission = new Intermission(this);
		this.intermission.setDepth(10000);
		this.intermission.on("close", () => {
			this.intermission.fadeToGame();
		});
		this.intermission.on("nextLevel", () => {
			const nextLevel = {
				[LevelId.Level1]: LevelId.Level2,
				[LevelId.Level2]: LevelId.Level3,
				[LevelId.Level3]: LevelId.Level1,
			}[this.level];
			this.loadLevel(nextLevel);

			this.intermission.fadeToGame();
		});

		this.effects = [];

		// Inventory
		this.inventory = new Inventory(
			this,
			-650,
			0,
			[10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
		);
		this.invButton = new ToggleButton(this, 64, 540, "invbutton");
		this.invButton.setAlpha(0.85);
		this.add.existing(this.invButton);
		this.invButton.on("click", () => {
			this.toggleInventory();
		});
		this.inventory.setDepth(10);
		this.invButton.setDepth(9);
		this.invButton.setAlpha(0.75);
		this.activeItem = new ItemButton(
			this,
			-500,
			-500,
			this.inventory,
			-1,
			-100,
			"blankspr",
			SnapType.STATION
		);

		this.upgradeOverlay = new UpgradeOverlay(this);
		this.upgradeOverlay.setDepth(1010);
		this.upgradeOverlay.on("upgradeStation", (station: Station) => {
			this.money -= station.upgradeCost;
			this.ui.setMoney(this.money);
			station.upgrade();
			this.upgradeOverlay.selectStation(station);
			this.upgradeOverlay.close();
			this.updateSavedPurchases();
		});
		this.upgradeOverlay.on("upgradeEmployee", (employee: Employee) => {
			this.money -= employee.upgradeCost;
			this.ui.setMoney(this.money);
			employee.upgrade();
			this.upgradeOverlay.selectEmployee(employee);
			this.upgradeOverlay.close();
			this.updateSavedPurchases();
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

		this.loadLevel(LevelId.Level1);
		this.setState(GameState.Shopping);
		// this.startDay();
		this.intermission.fadeToGame(); // Comment this out to see cutscenes
	}

	update(time: number, delta: number) {
		if (this.browsing || this.paused) {
			this.activeItem.update(time, delta);
			if (this.activeItem.state == 3) {
				this.snapItem();
			}
			return;
		}
		this.stations.forEach((s) => s.update(time, delta));
		this.employees.forEach((e) => e.update(time, delta));
		this.customers.forEach((x) => x.update(time, delta));
		this.updateEffects(time, delta);
		this.ui.update(time, delta);
		this.intermission.update(time, delta);
		this.summaryOverlay.update(time, delta);
		this.activeItem.update(time, delta);
		if (this.activeItem.state == 3) {
			this.snapItem();
		}
		this.upgradeOverlay.update(time, delta);

		// Depth sorting hack
		if (this.state === GameState.Day) {
			this.sortDepth();
		}
	}

	updateEffects(t: number, d: number) {
		for (let g = this.effects.length - 1; g >= 0; g--) {
			if (this.effects[g] == null) {
				console.log("NULL INSTANCE EFFECT");
				return;
			}
			this.effects[g].update(d, t);
			if (this.effects[g].deleteFlag) {
				this.effects[g].destroy();
				this.effects.splice(g, 1);
			}
		}
	}

	// Set game state
	setState(state: GameState) {
		this.state = state;

		const isShopping = state === GameState.Shopping;
		this.ui.setShoppingMode(isShopping);

		// Make unpurchased objects are visible only during shopping
		const unpurchasedAlpha = 0.2;
		this.stations.forEach((s) => {
			s.setClickable(isShopping);
			s.setAlpha(s.hasBeenPurchased ? 1 : isShopping ? unpurchasedAlpha : 0);
		});
		this.employees.forEach((e) => {
			e.setClickable(isShopping);
			e.setAlpha(e.hasBeenPurchased ? 1 : isShopping ? unpurchasedAlpha : 0);
		});

		if (isShopping && this.day > 0) {
			this.summaryOverlay.open(this.dailyStats);
		}
	}

	// Load level data
	loadLevel(id: LevelId) {
		this.level = id;
		const level = LevelData[id];

		this.background.setTexture(level.background);
		this.board.resize(level.width, level.height, level.cellSize);

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

		// Load saved purchases
		this.savedPurchases.stations.forEach((id) => {
			const station = this.stations.find(
				(s) => !s.hasBeenPurchased && s.stationType === StationData[id].type
			);
			if (station) {
				station.forceUpgrade(id);
			}
		});
		this.savedPurchases.employees.forEach((id) => {
			const employee = this.employees.find(
				(e) => !e.hasBeenPurchased && e.employeeType === EmployeeData[id].type
			);
			if (employee) {
				employee.forceUpgrade(id);
			}
		});

		// Generate navmesh
		this.navmesh = GenerateNavMesh(this.board, LevelData[id]);

		this.ui.setLevel(level);
		this.ui.setMoney(this.money);
		this.ui.setDay(this.day);

		this.setState(GameState.Shopping);
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

		// Reset customer spawning
		if (this.customerSpawnTimer) this.customerSpawnTimer.destroy();
		this.updateSpawnPool();

		// Setup daytime tween
		this.tweens.add({
			targets: this,
			duration: this.dayDuration,
			timeOfDay: { from: 0, to: 100 },

			onStart: () => {
				this.attemptSpawnCustomer();
			},
			onUpdate: (tween) => {
				this.ui.setTimeOfDay(1 - this.timeOfDay / 100);
			},
			onComplete: () => {
				// Shop closed. Play sound.
			},
		});
	}

	endDay() {
		this.customerSpawnTimer.destroy();

		//this.stations.forEach((s) => s.returnItems());
		this.sound.play("endday");
		// Fix this later
		// this.employees.forEach((e) => e.walkTo(e.startX, e.startY));
		this.setState(GameState.Shopping);
	}

	// Attempt to spawn customer
	canSpawnCustomer(id: CustomerId) {
		return (
			this.state == GameState.Day &&
			this.timeOfDay < 100 &&
			this.getAvailableWaitingSeat(id)
		);
	}

	// Attempt to spawn customer and reset timer
	attemptSpawnCustomer() {
		// Delay to next customer spawn
		let delay = 2000;

		// Randomly select customer type
		const id = Phaser.Math.RND.pick(this.customerSpawnPool);

		if (this.canSpawnCustomer(id)) {
			this.addCustomer(id);

			// TODO: Adjust to difficulty
			let delayMin = Math.max(1000, 4000 - 400 * this.day);
			let delayMax = delayMin + 5000 - 500 * this.day;
			delay = Phaser.Math.Between(delayMin, delayMax);

			console.log(`Customer spawned. Waiting ${delay} ms`);
		} else {
			console.log(`Customer failed to spawn. Waiting ${delay} ms`);
		}

		// Setup new event timer
		this.customerSpawnTimer = this.time.addEvent({
			delay,
			callback: this.attemptSpawnCustomer,
			callbackScope: this,
		});
	}

	// Update customer spawn pool based on available stations
	updateSpawnPool() {
		this.customerSpawnPool = [];

		this.stations.forEach((s) => {
			if (s.hasBeenPurchased) {
				if (s.stationTier >= 1) this.customerSpawnPool.push(CustomerId.Small);
				if (s.stationTier >= 2) this.customerSpawnPool.push(CustomerId.Medium);
				if (s.stationTier >= 3) this.customerSpawnPool.push(CustomerId.Large);
			}
		});

		console.log("Spawn pool:", this.customerSpawnPool);
	}

	updateSavedPurchases() {
		this.savedPurchases.stations = this.stations
			.filter((s) => s.hasBeenPurchased)
			.map((s) => s.stationId);
		this.savedPurchases.employees = this.employees
			.filter((e) => e.hasBeenPurchased)
			.map((e) => e.employeeId);
	}

	// Add new station
	addStation(gridX: number, gridY: number, id: StationId) {
		const coord = this.board.gridToCoord(gridX, gridY);
		const station = new Station(this, coord.x, coord.y, id, this.board.size);
		this.stations.push(station);

		// Station task completed
		station.on("taskend", () => {
			const customer = station.currentCustomer;
			const employee = customer?.currentEmployee;
			if (customer && employee) {
				customer.setAction(false);
				customer.setEmployee(null);
				customer.unlockTimer();
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
		this.tweens.pauseAll();
	}
	closeInventory() {
		this.browsing = false;
		this.tweens.resumeAll();
	}

	// Add new employee
	addEmployee(gridX: number, gridY: number, id: EmployeeId) {
		const coord = this.board.gridToCoord(gridX, gridY);
		const employee = new Employee(this, coord.x, coord.y, id, this.board.size);
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
	addCustomer(id: CustomerId) {
		const coord = this.board.gridToCoord(-8, 0);
		const customer = new Customer(this, coord.x, coord.y, id, this.board.size);
		this.customers.push(customer);

		// Place in available waiting seat
		const seat = this.getAvailableWaitingSeat(id);
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

		/*

		customer.on("over", () => {
			customer.toggleTimer();
			this.sound.play("meme_explosion_sound");
		});

		customer.on("out", () => {
			customer.untoggleTimer();
		});
		*/

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
			this.dailyStats.money += money;
			this.dailyStats.happyCustomers += 1;
			this.ui.setMoney(this.money);
		});

		customer.on("tip", (money: number) => {
			this.money += money;
			this.dailyStats.money += money;
			this.ui.setMoney(this.money);
		});

		// Customer leaving angry
		customer.on("angry", () => {
			this.dailyStats.angryCustomers += 1;
		});
	}

	// Get available seat for new customers to go to
	getAvailableWaitingSeat(id: CustomerId) {
		// TODO: Use id to ensure seat and stations are available for tier
		return this.stations.find(
			(s) =>
				s.stationType === StationType.WaitingSeat &&
				s.hasBeenPurchased &&
				!s.currentCustomer
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
				station.hasBeenPurchased &&
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

	// Find the closest employee to coord
	getClosestEmployee(x: number, y: number): Employee | null {
		let closestEmployee: Employee = null as unknown as Employee;
		let closestDistance = Infinity;

		// Offset to top-left corner, the employee working location
		x -= this.board.size / 4;
		y -= this.board.size / 2;

		this.employees.forEach((employee) => {
			const distance = Phaser.Math.Distance.Between(
				x,
				y,
				employee.x,
				employee.y
			);
			if (
				employee.hasBeenPurchased &&
				!employee.currentCustomer &&
				distance < closestDistance
			) {
				closestEmployee = employee;
				closestDistance = distance;
			}
		});

		return closestEmployee;
	}

	// Request an available employee to serve the customer
	callEmployee(customer: Customer) {
		// Abort if customer is not assigned to a station
		if (!customer.currentStation || customer.currentEmployee) {
			return;
		}

		const closestEmployee = this.getClosestEmployee(customer.x, customer.y);

		if (closestEmployee) {
			const station = customer.currentStation;
			customer.setRequest(null);
			customer.setEmployee(closestEmployee);
			closestEmployee.setCustomer(customer);

			const start = this.board.coordToNav(closestEmployee.x, closestEmployee.y);
			const goal = this.board.coordToNav(station.x, station.y);
			goal.x -= 2.6;
			goal.y -= 3.6;

			const gridPath = this.navmesh.findPath(start, goal);
			if (gridPath) {
				const points = gridPath.map((pos) =>
					this.board.navGridToCoord(pos.x, pos.y)
				);
				const path = new Phaser.Curves.Path();
				path.moveTo(closestEmployee.x, closestEmployee.y);
				points.forEach((point) => path.lineTo(point.x, point.y));
				// const path = new Phaser.Curves.Spline(points);

				closestEmployee.walk(path);
			} else {
				console.error("No path found");
				const debug = this.board.navGridToCoord(goal.x, goal.y);
				this.add.ellipse(debug.x, debug.y, 30, 30, 0xff0000);

				// Fallback to direct walk
				const path = new Phaser.Curves.Path();
				path.moveTo(closestEmployee.x, closestEmployee.y);
				path.lineTo(
					station.x - this.board.size / 3,
					station.y - this.board.size / 3
				);
				closestEmployee.walk(path);
			}
		}
	}

	// Generate a list of requests for the customer
	setCustomerItinerary(customer: Customer) {
		// Check availibility of stations
		const check = (type: StationType) => {
			return this.stations.some(
				(s) => s.stationType === type && s.hasBeenPurchased
			);
		};
		const hornNailsAvailable = check(StationType.HornAndNails);
		const scalePolishAvailable = check(StationType.ScalePolish);
		const goldBathAvailable = check(StationType.GoldBath);

		function getActivities() {
			let activities = [];
			if (hornNailsAvailable && Math.random() < 0.6) {
				activities.push(StationType.HornAndNails);
			}
			if (scalePolishAvailable && Math.random() < 0.6) {
				activities.push(StationType.ScalePolish);
			}
			if (goldBathAvailable && Math.random() < 0.6) {
				activities.push(StationType.GoldBath);
			}
			return activities;
		}

		let activities: StationType[] = [];
		while (activities.length < 1) {
			activities = getActivities();
		}

		customer.itinerary = activities;
		customer.requestedStation = activities[0];
		customer.nextActivity();
	}

	toggleInventory() {
		this.inventory.toggle();
		if (this.inventory.isOpen) {
			this.invButton.setPosition(714, 540);
			this.invButton.toggleForward();
			this.openInventory();
		} else {
			this.invButton.setPosition(64, 540);
			this.invButton.toggleBackward();
			this.closeInventory();
		}
	}

	setActiveItem(i: ItemButton) {
		this.activeItem.destroy();
		this.activeItem = i;
		this.activeItem.on("itemdrop", () => {
			this.cleanUpItem();
		});

		this.add.existing(this.activeItem);
		//new ItemButton(this,-500, -500, this.inventory, -1, -100, "blankspr");
	}

	addEffect(e: Effect) {
		this.effects.push(e);
	}

	parseItems(i: number, st: Station, c: Customer) {
		this.iHandler.process(this.inventory.itemList[i], st, c);
	}

	snapItem() {
		if (this.activeItem.snap == SnapType.STATION) {
			let s = this.getClosestStationToItem(this.activeItem);
			if (s) {
				this.activeItem.snapTo(s.x, s.y);
			}
		} else if (this.activeItem.snap == SnapType.CUSTOMER) {
			console.log("Snapping to Customer");
			let ct = this.getClosestCustomerToItem(this.activeItem);
			if (ct) {
				this.activeItem.snapTo(ct.x, ct.y - 30);
			}
		}
	}

	applyToStation() {
		let s = this.getClosestStationToItem(this.activeItem);
		if (s) {
			s.applyItem(this.activeItem.id, this.activeItem.sprname);
			this.sound.play("place");
		} else {
			this.returnItem(this.activeItem.id);
			this.sound.play("return");
		}
		this.activeItem.destroy();
		this.activeItem = new ItemButton(
			this,
			-500,
			-500,
			this.inventory,
			-1,
			-100,
			"blankspr",
			SnapType.STATION
		);
	}

	applyToCustomer() {
		let cs = this.getClosestCustomerToItem(this.activeItem);
		if (cs) {
			cs.applyItem(this.activeItem.id, this.activeItem.sprname);
			this.sound.play("place");
		} else {
			this.returnItem(this.activeItem.id);
			this.sound.play("return");
		}
		this.activeItem.destroy();
		this.activeItem = new ItemButton(
			this,
			-500,
			-500,
			this.inventory,
			-1,
			-100,
			"blankspr",
			SnapType.STATION
		);
	}

	cleanUpItem() {
		if (this.activeItem.snap == SnapType.CUSTOMER) {
			this.applyToCustomer();
		} else if (this.activeItem.snap == SnapType.STATION) {
			this.applyToStation();
		}
		this.inventory.unglassify();
		this.unveilInvButton();
	}

	returnItem(id: number) {
		this.inventory.returnItem(id);
	}

	parseCustomerItems(i: number, ct: Customer) {
		this.iHandler.processCustomerItem(this.inventory.itemList[i], ct);
		this.sound.play(this.inventory.itemList[i].sound);
	}

	getClosestCustomerToItem(item: ItemButton): Customer | null {
		let closestCustomer = null;
		let closestDistance = Infinity;
		const maxDistance = 70;
		this.customers.forEach((cs) => {
			const distance = Phaser.Math.Distance.Between(
				item.dragX,
				item.dragY,
				cs.x,
				cs.y - 30
			);
			if (
				cs.itemList.length < 3 &&
				distance < closestDistance &&
				distance < maxDistance &&
				!cs.actionsComplete
			) {
				closestCustomer = cs;
				closestDistance = distance;
			}
		});
		return closestCustomer;
	}

	getClosestStationToItem(item: ItemButton): Station | null {
		let closestStation = null;
		let closestDistance = Infinity;
		const maxDistance = 80;

		this.stations.forEach((station) => {
			const distance = Phaser.Math.Distance.Between(
				item.dragX,
				item.dragY,
				station.x,
				station.y
			);
			if (
				!(station.stationType == StationType.CashRegister) &&
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

	veilInvButton() {
		this.invButton.setAlpha(0.17);
	}

	unveilInvButton() {
		this.invButton.setAlpha(0.85);
	}

	sortDepth() {
		this.stations.forEach((s) => s.setDepth(s.y / 50 + 0));
		this.employees.forEach((e) => e.setDepth(e.y / 50 + 1));
		this.customers.forEach((c) => c.setDepth(c.y / 50 + (c.dragged ? 100 : 1)));
	}
}
