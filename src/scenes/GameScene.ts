import { BaseScene } from "@/scenes/BaseScene";
import { Board } from "@/components/Board";
import { Employee } from "@/components/Employee";
import { Customer } from "@/components/Customer";
import { CustomerId } from "@/components/CustomerData";
import { Station } from "@/components/Station";
import { UI } from "@/components/UI";
import { StationData, StationId, StationType } from "@/components/StationData";
import { Inventory } from "@/components/Inventory";
import { ToggleButton } from "@/components/elements/ToggleButton";
import { ItemButton } from "@/components/ItemButton";
import { ItemHandler } from "@/components/ItemHandler";
import { UpgradeOverlay } from "@/components/UpgradeOverlay";
import { SummaryOverlay } from "@/components/SummaryOverlay";
import { EmployeeData, EmployeeId } from "@/components/EmployeeData";
import {
	BlockType,
	BlockTypeEmployees,
	BlockTypeStations,
	LevelData,
	LevelId,
} from "@/components/Levels";
import { Effect } from "@/components/Effect";
import { Intermission, Mode } from "@/components/Intermission";
import { SnapType } from "@/components/Item";
import { Music } from "@/utils/Music";

import { NavMesh } from "navmesh";
import { GenerateNavMesh } from "@/utils/NavMeshHelper";
import { Button } from "@/components/elements/Button";
import { ShopInventory } from "@/components/ShopInventory";

enum GameState {
	Cutscene,
	Day,
	Shopping,
	Intermission,
}

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private foreground: Phaser.GameObjects.Image;
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
	private shopinventory: ShopInventory;
	private invButton: ToggleButton;
	private iHandler: ItemHandler;
	public activeItem: ItemButton;

	public tArray: number[];

	public musicBase: Music;
	public musicCutscene: Music;
	public musicDowntime: Music;

	private shopClicker: Button;
	private ownerImage: Phaser.GameObjects.Sprite;
	private shopSpeech: Phaser.GameObjects.Container;
	private shopBubble: Phaser.GameObjects.Image;
	private shopText: Phaser.GameObjects.Text;

	private noivern: string[] = [
		"Like I said, the prices are absolutely fair!",
		"My old job? I used to be a turret engineer~",
		"If you encounter a special customer, use clues to figure out their needs!",
		"Have you heard of widgets? I might have one in stock.",
		"It's alawys so hot in the dragonlands...",
		"Different customers will have different preferences!",
		"That one's popular! Why not pick up a few for your salon?",
		"Some items can be only given to customers. Others are only equipped at stations.",
		"Happy customers tip more! Give them things they like and tend to them quickly!",
		"Don't forget to upgrade your stations! A well equipped salon succeeds.",
		"My favorite items? A tasty hot dog and a box of milk! And I love the widgets too!",
		"How's the weather been lately? I think it's lovely outside.",
		"I saw lots of happy people by your salon! I hope it's doing well.",
		"Buy a lot and buy often! Think of it as an investment!",
	];
	private viewedShopTutorial: boolean = false;
	private shopTutorialText: string[] = [
		"Hey, going to leave already? Click the left tab and drop by!",
		"First time? Welcome to my little otter shop!",
		"You can pick up all kinds of snacks, trinkets, and widgets here!",
		"They might be of help for your customers and stations!",
		"I left some notes in the descriptions too, if you need any help.",
		"And you can hit the brown arrow to browse the other shelves!",
		"The prices are totally fair, but make sure you have enough money!",
		"Once you're done, you can hit the tab again to close the shop!",
		"Oh, and it works for your inventory too during the day!",
		"I'll look forward to your visits!",
	];
	private shopTutorialFrames: number[] = [0, 0, 1, 1, 2, 0, 2, 0, 0, 1];
	private shopTutorialIndex: number = 1;
	private shopTutorialInitialized: boolean = false;
	private tutorialTimer: number = 0;
	private canProceed: boolean[] = [false, false, false];
	private dinonugget: number = 0;
	private shopOpenCheck: boolean = false;
	private shopOwnerState: number = -1;
	private proceedButton: Button;
	private hitRectangle: Phaser.GameObjects.Rectangle;

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
		tip: number;
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
		this.input.dragDistanceThreshold = 32;

		// Reset daily stats
		this.dailyStats = {
			money: 0,
			tip: 0,
			happyCustomers: 0,
			angryCustomers: 0,
		};
		this.savedPurchases = {
			stations: [
				StationId.Waiting_1,
				StationId.Nail_1,
				StationId.Wax_1,
				StationId.Register_1,
			],
			employees: [EmployeeId.Washbear_1],
		};

		// Background
		this.background = this.add.image(0, 0, "6x4_bg");
		this.background.setOrigin(0);
		this.fitToScreen(this.background);

		this.foreground = this.add.image(0, 0, "6x4_fg");
		this.foreground.setOrigin(0);
		this.foreground.setDepth(50);
		this.fitToScreen(this.foreground);

		this.board = new Board(this, this.CX, this.CY, 6, 4, 100);

		this.stations = [];
		this.employees = [];
		this.customers = [];

		this.ui = new UI(this);
		this.ui.setDepth(1000);
		this.ui.setTimeOfDay(1);
		this.ui.on("nextDay", () => {
			if (this.inventory.isOpen) this.toggleInventory();
			this.startDay();
		});
		this.ui.on("nextLevel", () => {
			const upgradeCost = LevelData[this.level].upgradeCost ?? 0;
			if (this.money >= upgradeCost) {
				this.addMoney(-upgradeCost);
				if (this.inventory.isOpen) this.toggleInventory();
				this.intermission.fadeToIntermission(Mode.NextLevelCutscene);
			}
		});

		this.iHandler = new ItemHandler(this);

		this.intermission = new Intermission(this);
		this.intermission.setDepth(10000);
		this.intermission.on("startDay", () => {
			this.intermission.fadeToGame();
			this.startDay();
		});
		this.intermission.on("nextLevel", () => {
			const nextLevel = {
				[LevelId.Level1]: LevelId.Level2,
				[LevelId.Level2]: LevelId.Level3,
				[LevelId.Level3]: LevelId.Level4,
				[LevelId.Level4]: LevelId.Level1,
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
			[99, 5, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0]
		);

		this.shopinventory = new ShopInventory(
			this,
			-650,
			0,
			[99, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1]
		);
		this.shopinventory.setDepth(2500);

		this.invButton = new ToggleButton(this, 64, 540, "invbutton");
		this.invButton.setScale(0.5);
		this.invButton.setAlpha(0.85);
		this.add.existing(this.invButton);
		this.invButton.on("click", () => {
			this.togglePanel();
		});
		this.inventory.setDepth(800);
		this.invButton.setDepth(900);
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
			const cost = station.upgradeCost;
			station.upgrade();
			this.addMoney(-cost);
			this.upgradeOverlay.close();
			this.updateSavedPurchases();
		});
		this.upgradeOverlay.on("upgradeEmployee", (employee: Employee) => {
			const cost = employee.upgradeCost;
			employee.upgrade();
			this.addMoney(-cost);
			this.upgradeOverlay.close();
			this.updateSavedPurchases();
		});
		this.upgradeOverlay.on("close", () => {
			this.sortDepth();
		});

		this.summaryOverlay = new SummaryOverlay(this);
		this.summaryOverlay.setDepth(1020);
		this.summaryOverlay.on("progress", () => {
			this.summaryOverlay.close();
		});

		//shop
		this.shopClicker = new Button(this, 1460, 540);
		this.add.existing(this.shopClicker);

		this.ownerImage = new Phaser.GameObjects.Sprite(this, 0, 0, "otter");
		this.ownerImage.setOrigin(0.5, 0.5);
		this.shopClicker.add(this.ownerImage);

		this.shopClicker.bindInteractive(this.ownerImage);
		this.shopClicker.on("click", () => this.proceedShopTutorial());
		this.ownerImage.input!.enabled = false;
		this.shopSpeech = new Phaser.GameObjects.Container(this, 1010, 450);
		this.add.existing(this.shopSpeech);
		this.shopBubble = new Phaser.GameObjects.Image(this, 0, 0, "bubble");
		this.shopBubble.setScale(-3.5, 2.5);
		this.shopBubble.setOrigin(0.5, 0.5);
		this.shopSpeech.add(this.shopBubble);
		this.shopClicker.setDepth(1050);
		this.shopSpeech.setDepth(1045);
		this.shopText = this.addText({
			x: 0,
			y: -20,
			size: 40,
			color: "#000000",
			text: "",
		});
		this.shopText.setWordWrapWidth(380);
		this.shopText.setOrigin(0.5, 0.5);
		this.shopSpeech.add(this.shopText);
		this.proceedButton = new Button(this, 960, 540);
		this.hitRectangle = new Phaser.GameObjects.Rectangle(
			this,
			0,
			0,
			1980,
			1100,
			0x000000
		);
		this.hitRectangle.setOrigin(0.5, 0.5);
		this.hitRectangle.setAlpha(0.001);
		this.proceedButton.add(this.hitRectangle);
		this.proceedButton.bindInteractive(this.hitRectangle);
		this.add.existing(this.proceedButton);
		this.proceedButton.setDepth(5000);
		this.proceedButton.setVisible(false);
		this.shopClicker.setVisible(false);
		this.shopSpeech.setVisible(false);
		/* Init */

		this.loadLevel(LevelId.Level1);
		this.setState(GameState.Shopping);
		this.sortDepth();
		// this.startDay();
		// this.intermission.fadeToGame(); // Comment this out to see cutscenes
		this.tArray = [];
		this.pauseInvButton();
		this.musicBase = new Music(this, "m_salonbase", { volume: 0.4 });
		this.musicDowntime = new Music(this, "m_salondowntime", { volume: 0.4 });
		this.musicCutscene = new Music(this, "m_saloncutscene", { volume: 0.4 });
		this.musicBase.play();
		this.musicDowntime.play();
		this.musicCutscene.play();
	}

	update(time: number, delta: number) {
		if (!this.viewedShopTutorial || this.shopOwnerState == 2) {
			this.updateShopTutorial(time, delta);
		}
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

		// Highlight button for tutorial
		if (this.shopTutorialIndex == 0) {
			this.invButton.setScale(0.5 + 0.08 * Math.sin(time / 100));
		} else {
			this.invButton.setScale(0.5);
		}

		this.sortDepth();
		this.updateMusicState();
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
			this.summaryOverlay.open(this.day, this.dailyStats);
		}
	}

	// Load level data
	loadLevel(id: LevelId) {
		this.level = id;
		const level = LevelData[id];

		this.background.setTexture(level.background);
		this.foreground.setTexture(level.foreground);

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
				const blockType: BlockType = level.grid[y][x];

				const stationId = BlockTypeStations[blockType];
				if (stationId !== undefined) {
					this.addStation(gridX, gridY, stationId);
				}

				const employeeId = BlockTypeEmployees[blockType];
				if (employeeId !== undefined) {
					this.addEmployee(gridX, gridY, employeeId);
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
		this.addMoney(0);

		this.setState(GameState.Shopping);
	}

	addMoney(amount: number) {
		this.money += amount;
		this.ui.setMoney(this.money);
		this.stations.forEach((s) => s.setMoney(this.money));
		this.employees.forEach((e) => e.setMoney(this.money));
	}

	// Start a new day
	startDay() {
		if (this.day > 1) {
			if (!this.viewedShopTutorial) {
				this.beginShopTutorial(0);
				return;
			} else {
				if (this.shopinventory.isOpen) {
					this.toggleShop();
				}
			}
		}
		this.setState(GameState.Day);
		this.day += 1;
		this.ui.setDay(this.day);

		// Reset daily stats
		this.dailyStats = {
			money: 0,
			tip: 0,
			happyCustomers: 0,
			angryCustomers: 0,
		};

		// Reset customer spawning
		if (this.customerSpawnTimer) this.customerSpawnTimer.destroy();
		this.updateSpawnPool();

		// Setup daytime tween
		this.tweens.add({
			targets: this,
			duration: this.dayDuration,
			timeOfDay: { from: 0, to: 100 },

			onStart: () => {
				this.timeOfDay = 0;
				this.attemptSpawnCustomer();
				this.sound.play("endday", { volume: 0.2 });
			},
			onUpdate: (tween) => {
				this.ui.setTimeOfDay(this.timeOfDay / 100);
			},
			onComplete: () => {
				this.sound.play("endday", { volume: 0.2 });
			},
		});
	}

	endDay() {
		this.customerSpawnTimer.destroy();

		// Return employees to their starting positions
		this.employees.forEach((e) => {
			const path = new Phaser.Curves.Path();
			path.moveTo(e.x, e.y);
			path.lineTo(e.startX, e.startY);
			e.walk(path);
		});

		//this.stations.forEach((s) => s.returnItems());
		this.resumeInvButton();
		this.restockShop();
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
		let delay = 4000;

		// Randomly select customer type
		let id = Phaser.Math.RND.pick(this.customerSpawnPool);

		// Very first customer
		if (this.day == 1 && this.timeOfDay == 0) {
			id = CustomerId.SmallRed;
		}

		if (this.canSpawnCustomer(id)) {
			this.addCustomer(id);

			// TODO: Adjust to difficulty
			let delayMin = Math.max(2000, 6000 - 400 * this.day);
			let delayMax = delayMin + 10000 - 400 * this.day;
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
				if (s.stationTier >= 1) {
					this.customerSpawnPool.push(CustomerId.SmallRed);
					this.customerSpawnPool.push(CustomerId.SmallAqua);
					this.customerSpawnPool.push(CustomerId.SmallGreen);
				}
				if (s.stationTier >= 2) {
					this.customerSpawnPool.push(CustomerId.MediumRed);
					this.customerSpawnPool.push(CustomerId.MediumAqua);
					this.customerSpawnPool.push(CustomerId.MediumGreen);
				}
				if (s.stationTier >= 3) {
					this.customerSpawnPool.push(CustomerId.LargeRed);
					this.customerSpawnPool.push(CustomerId.LargeAqua);
					this.customerSpawnPool.push(CustomerId.LargeGreen);
				}
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
			}
		});
	}

	openInventory() {
		this.browsing = true;
		this.pauseAllClickables();
		this.tweens.pauseAll();
	}
	closeInventory() {
		this.browsing = false;
		this.resumeAllClickables();
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
			}
		});
	}

	// Add new customer
	addCustomer(id: CustomerId) {
		const customer = new Customer(this, 0, 0, id, this.board.size);
		this.customers.push(customer);

		// Place in available waiting seat
		const seat = this.getAvailableWaitingSeat(id);
		if (seat) {
			seat.setCustomer(customer);
			customer.setStation(seat);
			// customer.snapTo(seat.x, seat.y);

			this.moveCustomerToSeat(customer, seat);
		} else {
			console.error("Whoops");
		}

		// Customer getting seated
		customer.on("seated", () => {
			this.setCustomerItinerary(customer);
		});

		// Picking up a customer
		customer.on("pickup", () => {
			if (customer.currentStation) {
				customer.clearMask();
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
				}

				station.setCustomer(customer);
				customer.setStation(station);
				customer.applyMask(station);
			} else if (customer.currentStation) {
				customer.snapTo(customer.currentStation.x, customer.currentStation.y);
				customer.applyMask(customer.currentStation);
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
			if (
				this.state == GameState.Day &&
				this.timeOfDay >= 100 &&
				this.customers.length === 0
			) {
				this.endDay();
			}
		});

		// Customer completing their itinerary and paying
		customer.on("pay", (money: number) => {
			this.addMoney(money);
			this.dailyStats.money += money;
			this.dailyStats.happyCustomers += 1;
		});

		customer.on("tip", (money: number) => {
			this.addMoney(money);
			this.dailyStats.tip += money;
		});

		// Customer leaving angry
		customer.on("angry", () => {
			this.dailyStats.angryCustomers += 1;
		});
	}

	// Get available seat for new customers to go to
	getAvailableWaitingSeat(id: CustomerId) {
		// TODO: Use id to ensure seat and stations are available for tier
		return Phaser.Math.RND.pick(
			this.stations.filter(
				(s) =>
					s.stationType === StationType.Waiting &&
					s.hasBeenPurchased &&
					!s.currentCustomer
			)
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
			let distance = Phaser.Math.Distance.Between(x, y, employee.x, employee.y);
			distance /= employee.walkSpeed;

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
			this.sound.play("crit", { volume: 0.5 });

			const start = this.board.coordToNav(closestEmployee.x, closestEmployee.y);
			const goal = this.board.coordToNav(station.x, station.y);
			goal.x -= 2.6;
			goal.y -= 3.6;

			const gridPath = this.navmesh.findPath(start, goal);
			// Pathfinding success, walk to station
			if (gridPath) {
				const points = gridPath.map((pos) =>
					this.board.navGridToCoord(pos.x, pos.y)
				);
				const path = new Phaser.Curves.Path();
				path.moveTo(closestEmployee.x, closestEmployee.y);
				points.forEach((point) => path.lineTo(point.x, point.y));
				// const path = new Phaser.Curves.Spline(points);

				closestEmployee.walk(path);
			}
			// Fallback to direct line if pathfinding fails
			else {
				console.error("No path found");
				const debug = this.board.navGridToCoord(goal.x, goal.y);
				this.add.ellipse(debug.x, debug.y, 30, 30, 0xff0000);

				const path = new Phaser.Curves.Path();
				path.moveTo(closestEmployee.x, closestEmployee.y);
				path.lineTo(
					station.x - this.board.size / 3,
					station.y - this.board.size / 3
				);
				closestEmployee.walk(path);
			}
		} else {
			this.sound.play("squish1", { volume: 0.6 });
		}
	}

	moveCustomerToSeat(customer: Customer, seat: Station) {
		// Pathfinding to seat
		const startY = LevelData[this.level].height - 3;
		const startCoord = this.board.gridToCoord(0, startY);
		const start = this.board.coordToNav(startCoord.x, startCoord.y);
		const goal = this.board.coordToNav(seat.x, seat.y);

		// Starting location outside of screen
		customer.snapTo(-this.board.size, startCoord.y, true);

		const navPath = this.navmesh.findPath(start, goal);
		if (navPath) {
			const points = navPath.map((pos) =>
				this.board.navGridToCoord(pos.x, pos.y)
			);
			const path = new Phaser.Curves.Path();
			path.moveTo(customer.x, customer.y);
			points.forEach((point) => path.lineTo(point.x, point.y));

			customer.walk(path);
		} else {
			const path = new Phaser.Curves.Path();
			path.moveTo(customer.x, customer.y);
			path.lineTo(seat.x, seat.y);

			customer.walk(path);
		}
	}

	moveCustomerToEntrance(customer: Customer) {
		// Pathfinding to left entrance
		const doorY = LevelData[this.level].height - 3;
		const doorCoord = this.board.gridToCoord(0, doorY);
		const goal = this.board.coordToNav(doorCoord.x, doorCoord.y);
		const start = this.board.coordToNav(customer.x, customer.y);

		const navPath = this.navmesh.findPath(start, goal);
		if (navPath) {
			const points = navPath.map((pos) =>
				this.board.navGridToCoord(pos.x, pos.y)
			);
			const path = new Phaser.Curves.Path();
			path.moveTo(customer.x, customer.y);
			points.forEach((point) => path.lineTo(point.x, point.y));
			path.lineTo(-this.board.size, doorCoord.y);

			customer.walk(path);
		} else {
			const path = new Phaser.Curves.Path();
			path.moveTo(customer.x, customer.y);
			path.lineTo(doorCoord.x, doorCoord.y);
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
		const nailAvailable = check(StationType.Nail);
		const waxAvailable = check(StationType.Wax);
		const bathAvailable = check(StationType.Bath);

		function getActivities() {
			let activities = [];
			if (nailAvailable && Math.random() < 0.65) {
				activities.push(StationType.Nail);
			}
			if (waxAvailable && Math.random() < 0.65) {
				activities.push(StationType.Wax);
			}
			if (bathAvailable && Math.random() < 0.65) {
				activities.push(StationType.Bath);
			}
			return activities;
		}

		let activities: StationType[] = [];
		let limit = 100;
		while (activities.length < 1 && limit-- > 0) {
			activities = getActivities();
		}

		customer.itinerary = activities;
		customer.requestedStation = activities[0];
		customer.nextActivity();
	}

	togglePanel() {
		if (this.state === GameState.Shopping) {
			this.toggleShop();
		} else {
			this.toggleInventory();
		}
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

	toggleShop() {
		this.shopinventory.toggle();
		if (this.shopinventory.isOpen) {
			this.invButton.setPosition(714, 540);
			this.invButton.toggleForward();
			this.openInventory();
			//console.log("VARIABLE STATE: "+this.shopOpenCheck)
			if (this.shopTutorialInitialized == false) {
				this.beginShopTutorial(1);
				this.pauseInvButton();
			}
			if (this.shopOpenCheck) {
				this.shopOpenCheck = false;
				this.pauseInvButton();
				this.proceedShopTutorial();
			}
			//console.log(this.invButton);
			//this.pauseInvButton();
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
			this.sound.play("place", { volume: 0.4 });
		} else {
			this.returnItem(this.activeItem.id);
			this.sound.play("return", { volume: 0.4 });
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
			this.sound.play("place", { volume: 0.4 });
		} else {
			this.returnItem(this.activeItem.id);
			this.sound.play("return", { volume: 0.4 });
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

	buyItem(id: number, qt: number) {
		this.inventory.buyItem(id, qt);
	}

	pauseInvButton() {
		this.invButton.spr.input!.enabled = false;
		this.invButton.setAlpha(0.34);
	}

	resumeInvButton() {
		this.invButton.spr.input!.enabled = true;
		this.invButton.setAlpha(0.85);
	}

	parseCustomerItems(i: number, ct: Customer) {
		this.iHandler.processCustomerItem(this.inventory.itemList[i], ct);
		this.sound.play(this.inventory.itemList[i].sound, { volume: 0.4 });
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
				!(station.stationType == StationType.Register) &&
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

	removeMoney(n: number) {
		this.addMoney(-n);
		this.sound.play("cashmoney", { volume: 0.4 });
	}

	beginShopTutorial(n: number) {
		this.shopTutorialIndex = n;
		this.shopTutorialInitialized = false;
		this.ownerImage.input!.enabled = false;
		this.ownerImage.setFrame(this.shopTutorialFrames[n]);
		this.shopText.setText(this.shopTutorialText[n]);
		this.shopClicker.setVisible(true);
		this.shopSpeech.setVisible(true);
		this.shopSpeech.setAlpha(0);
		this.tutorialTimer = 1000;
		if (n > 0) {
			this.pauseInvButton();
		}
	}

	updateShopTutorial(t: number, d: number) {
		if (this.dinonugget > 0) {
			this.dinonugget -= d;
			//console.log("DINO NUGGET");
			if (this.dinonugget <= 0) {
				this.shopClicker.setAlpha(0);
				this.shopSpeech.setAlpha(0);
				this.shopSpeech.setVisible(false);
				this.shopClicker.setVisible(false);
				this.shopOwnerState = -1;
			} else {
				this.shopClicker.setAlpha(this.dinonugget / 300);
				this.shopSpeech.setAlpha(this.dinonugget / 300);
			}
		}
		if (this.viewedShopTutorial) {
			return;
		}
		if (!this.shopTutorialInitialized) {
			if (this.tutorialTimer > 0) {
				if (this.tutorialTimer > 300) {
					this.tutorialTimer -= d;
					if (this.tutorialTimer <= 300) {
						this.shopClicker.setPosition(1460, 540);
					} else {
						this.shopClicker.setPosition(
							1460,
							1480 + -940 * (1 - (this.tutorialTimer - 300) / 700)
						);
					}
				} else if (this.tutorialTimer <= 300) {
					this.tutorialTimer -= d;
					if (this.tutorialTimer <= 0) {
						this.shopSpeech.setAlpha(1);
						this.shopTutorialInitialized = true;
						this.ownerImage.input!.enabled = true;
						if (this.shopTutorialIndex == 0) {
							this.shopOpenCheck = true;
						}
						this.canProceed = [true, false, false];
					}
					this.shopSpeech.setAlpha(1 - this.tutorialTimer / 300);
				}
			}
		} else if (!this.viewedShopTutorial) {
			if (this.tutorialTimer > 0) {
				this.tutorialTimer -= d;
				if (this.tutorialTimer <= 0) {
					this.shopSpeech.setAlpha(1);
					this.canProceed = [true, false, false];
					this.ownerImage.input!.enabled = true;
				} else {
					this.shopSpeech.setAlpha(1 - this.tutorialTimer / 300);
				}
			}
		}
	}

	proceedShopTutorial() {
		if (this.shopOpenCheck || !this.canProceed) {
			return;
		}
		this.shopTutorialIndex++;
		if (this.shopTutorialIndex < this.shopTutorialText.length) {
			this.canProceed = [false, false, false];
			this.tutorialTimer = 300;
			this.shopSpeech.setAlpha(0);
			this.shopText.setText(this.shopTutorialText[this.shopTutorialIndex]);
			this.ownerImage.setFrame(this.shopTutorialFrames[this.shopTutorialIndex]);
			this.ownerImage.input!.enabled = false;
			this.sound.play("button", { volume: 0.5 });
		} else {
			this.sound.play("button", { volume: 0.5 });
			this.completeShopTutorial();
		}
	}

	completeShopTutorial() {
		this.canProceed = [false, false, false];
		this.ownerImage.input!.enabled = false;
		this.viewedShopTutorial = true;
		this.sound.play("meme_explosion_sound", { volume: 0.4 });
		this.dinonugget = 300;
		this.shopOwnerState = 2;
		this.resumeInvButton();
	}

	pauseAllClickables() {
		this.stations.forEach((s) => s.pauseClickable());
		this.customers.forEach((c) => c.pauseClickable());
		this.employees.forEach((e) => e.pauseClickable());
	}

	resumeAllClickables() {
		this.stations.forEach((s) => s.resumeClickable());
		this.customers.forEach((c) => c.resumeClickable());
		this.employees.forEach((e) => e.resumeClickable());
	}

	getAmountOwned(id: number) {
		return this.inventory.itemList[id].quant;
	}

	veilInvButton() {
		this.invButton.setAlpha(0.17);
	}

	unveilInvButton() {
		this.invButton.setAlpha(0.85);
	}

	restockShop() {
		this.shopinventory.itemList.forEach(
			(st) => (st.quant += Math.trunc(Math.random() * 10))
		);
	}

	sortDepth() {
		this.stations.forEach((s) => s.setDepth(s.y / 50 + 0));
		this.employees.forEach((e) => e.setDepth(e.y / 50 + 1));
		this.customers.forEach((c) => c.setDepth(c.y / 50 + (c.dragged ? 100 : 1)));

		const focusStation = this.stations.find(
			(s) => this.upgradeOverlay.selectedStation == s
		);
		const focusEmployee = this.employees.find(
			(e) => this.upgradeOverlay.selectedEmployee == e
		);
		if (focusStation) focusStation.setDepth(2000);
		if (focusEmployee) focusEmployee.setDepth(2000);
	}

	refreshStationIDArray() {
		this.tArray = [];
		this.stations.forEach((st) => {
			if (st.stationType == StationType.Nail) {
				this.tArray.push(0);
			} else if (st.stationType == StationType.Wax) {
				this.tArray.push(1);
			} else if (st.stationType == StationType.Bath) {
				this.tArray.push(2);
			}
		});
	}

	updateMusicState() {
		const clamp = Phaser.Math.Clamp;
		const tween = this.intermission.transitionProgress;
		const volumeModifier = 0.4;

		let intendedVolume = {
			base: 1,
			cutscene: 0,
			downtime: 0,
		};

		if (this.state != GameState.Day)
			intendedVolume = {
				base: 0,
				cutscene: 0,
				downtime: 1,
			};

		if (this.intermission.visible) {
			intendedVolume.cutscene = 1 - tween;
			intendedVolume.downtime *= tween;
			intendedVolume.base *= tween;
		}

		this.musicBase.setVolume(clamp(intendedVolume.base, 0, 1) * volumeModifier);
		this.musicDowntime.setVolume(
			clamp(intendedVolume.downtime, 0, 1) * volumeModifier
		);
		this.musicCutscene.setVolume(
			clamp(intendedVolume.cutscene, 0, 1) * volumeModifier
		);

		// Singing animation

		if (this.game.hasFocus) {
			const sing =
				this.musicDowntime.volume > 0.1 ? this.musicDowntime.noteActive : false;

			this.employees.forEach((e) => (e.isSinging = sing));
		}
	}
}
