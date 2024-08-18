import { BaseScene } from "@/scenes/BaseScene";
import { Board, GridPoint } from "@/components/Board";
import { Employee } from "@/components/Employee";
import { Customer } from "@/components/Customer";
import { CustomerId } from "@/components/CustomerData";
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
import { Effect } from "@/components/Effect";
import { TextEffect } from "@/components/TextEffect";
import { BasicEffect } from "@/components/BasicEffect";
import { Intermission, Mode } from "@/components/Intermission";

import { NavMesh } from "navmesh";
import { centerOnSubdividedCoord, GenerateNavMesh } from "@/utils/NavMeshHelper";

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
	public money: number = 100000;
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
			"blankspr"
		);

		//UI
		this.ui.setMoney(this.money);
		this.ui.setDay(this.day);
		this.ui.on("nextDay", () => {
			this.startDay();
		});
		this.ui.on("nextLevel", () => {
			this.intermission.fadeToIntermission(Mode.NextLevelCutscene);
		});

		this.upgradeOverlay = new UpgradeOverlay(this);
		this.upgradeOverlay.setDepth(1010);
		this.upgradeOverlay.on("upgradeStation", (station: Station) => {
			this.money -= station.upgradeCost;
			this.ui.setMoney(this.money);
			station.upgrade();
			this.upgradeOverlay.close();
			// this.upgradeOverlay.selectStation(station);
		});
		this.upgradeOverlay.on("upgradeEmployee", (employee: Employee) => {
			this.money -= employee.upgradeCost;
			this.ui.setMoney(this.money);
			employee.upgrade();
			// this.upgradeOverlay.selectEmployee(employee);
			this.upgradeOverlay.close();
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
					const type = Phaser.Math.RND.pick([
						CustomerId.Small,
						CustomerId.Medium,
						CustomerId.Large,
						// CustomerId.TypeA,
						// CustomerId.TypeB,
						// CustomerId.TypeC,
						// CustomerId.TypeD,
						// CustomerId.TypeE,
						// CustomerId.TypeF,
					]);
					this.addCustomer(type);
				}
			},
			loop: true,
		});

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
			const station = this.stations.find((s) => s.stationId === id);
			if (station) {
				station.upgrade();
			}
		});
		this.savedPurchases.employees.forEach((id) => {
			const employee = this.employees.find((e) => e.employeeId === id);
			if (employee) {
				employee.upgrade();
			}
		});
		
		// Generate navmesh
		this.navmesh = GenerateNavMesh(this.board, LevelData[id])
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
		this.addCustomer(CustomerId.Small);

		// Setup daytime tween
		this.tweens.add({
			targets: this,
			timeOfDay: { from: 1, to: 0 },
			duration: this.dayDuration,
			onUpdate: (tween) => {
				this.timeOfDay = tween.getValue();
				this.ui.setTimeOfDay(this.timeOfDay);
			},
			onComplete: () => {
				// Shop closed. Play sound.
			},
		});
	}

	endDay() {
		//this.stations.forEach((s) => s.returnItems());
		this.employees.forEach((e) => e.walkTo(e.startX, e.startY));
		this.setState(GameState.Shopping);
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
	addCustomer(type: CustomerId) {
		const coord = this.board.gridToCoord(-8, 0);
		const customer = new Customer(
			this,
			coord.x,
			coord.y,
			type,
			this.board.size
		);
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
	getAvailableWaitingSeat() {
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

	// Request an available employee to serve the customer
	callEmployee(customer: Customer) {
		// Abort if customer is not assigned to a station
		if (!customer.currentStation || customer.currentEmployee) {
			return;
		}

		let closestEmployee: Employee = null as unknown as Employee;
		let closestDistance = Infinity;

		this.employees.forEach((employee) => {
			const distance = Phaser.Math.Distance.Between(
				customer.x,
				customer.y,
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

		if (closestEmployee) {
			const station = customer.currentStation;
			const { gridX, gridY } = this.board.coordToGrid(station.x, station.y);
			const { x, y } = this.board.gridToCoord(gridX, gridY - 1);

			customer.setRequest(null);
			customer.setEmployee(closestEmployee);

			closestEmployee.setCustomer(customer);
			closestEmployee.walkTo(x, y);
			
			const [cx, cy] = centerOnSubdividedCoord(this.board, station, 7);
			const posEmp = this.board.coordToGrid(closestEmployee.x, closestEmployee.y);
			const posSta = this.board.coordToGrid(station.x, station.y);


			const scale = ({gridX, gridY}: GridPoint) => {
				return {x: gridX*7, y: gridY*7}
			}

			//this.navmesh.findPath({})
		
			console.log(scale(posEmp))
			
			const path = this.navmesh.findPath(scale(posEmp), scale(posSta));



			console.log("path", path)

			// Wait for employee.on("walkend")
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
		let s = this.getClosestStationToItem(this.activeItem);
		if (s) {
			this.activeItem.snapTo(s.x, s.y);
		}
	}

	cleanUpItem() {
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
			"blankspr"
		);
	}

	returnItem(id: number) {
		this.inventory.returnItem(id);
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

	sortDepth() {
		this.stations.forEach((s) => s.setDepth(s.y / 100 + 0));
		this.employees.forEach((e) => e.setDepth(e.y / 100 + 1));
		this.customers.forEach((c) =>
			c.setDepth(c.y / 100 + (c.dragged ? 100 : 1))
		);
	}
}
