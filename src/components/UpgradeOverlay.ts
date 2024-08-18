import { GameScene } from "@/scenes/GameScene";
import { RoundRectangle } from "./elements/RoundRectangle";
import { TextButton } from "./TextButton";
import { Station } from "./Station";
import { Employee } from "./Employee";
import { StationData } from "./StationData";
import { EmployeeData } from "./EmployeeData";

export class UpgradeOverlay extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private selectedStation: Station | null = null;
	private selectedEmployee: Employee | null = null;

	private background: Phaser.GameObjects.Rectangle;
	private panel: RoundRectangle;
	private titleText: Phaser.GameObjects.Text;
	private moneyText: Phaser.GameObjects.Text;
	private buyButton: TextButton;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		this.setVisible(false);
		this.setAlpha(0);

		// Fullscreen blackness
		this.background = this.scene.add.rectangle(0, 0, scene.W, scene.H, 0, 0.75);
		this.background.setOrigin(0);
		this.add(this.background);

		this.panel = new RoundRectangle(scene, {
			x: 0,
			y: 0,
			width: 600,
			height: 300,
			radius: 20,
			color: 0xffffff,
		});
		this.add(this.panel);

		this.titleText = this.scene.addText({
			x: 0,
			y: -100,
			size: 50,
			color: "#FFFFFF",
			text: "...",
		});
		this.titleText.setOrigin(0.5);
		this.titleText.setStroke("black", 4);
		this.panel.add(this.titleText);

		this.moneyText = this.scene.addText({
			x: -250,
			y: -50,
			size: 40,
			color: "#FFFFFF",
			text: "...",
		});
		this.moneyText.setStroke("black", 4);
		this.moneyText.setOrigin(0);
		this.panel.add(this.moneyText);

		this.buyButton = new TextButton(scene, 220, 150, "$100");
		this.panel.add(this.buyButton);
		this.buyButton.on("click", () => {
			if (this.selectedStation) {
				this.emit("upgradeStation", this.selectedStation);
			} else {
				this.emit("upgradeEmployee", this.selectedEmployee);
			}
		});

		// Interactions

		// Dismiss overlay when clicking outside of panel
		this.background.setInteractive();
		this.background.on("pointerdown", this.close, this);

		// Prevent clicks on panel from closing overlay
		this.panel.setInteractive();
	}

	update(time: number, delta: number) {
		this.buyButton.update(time, delta);
	}

	selectStation(station: Station) {
		this.selectedEmployee = null;
		this.selectedStation = station;
		this.titleText.setText(station.stationName);

		// Position panel
		if (station.x > this.scene.W / 2) {
			this.panel.x = station.x - 500;
			this.panel.y = station.y;
		} else {
			this.panel.x = station.x + 500;
			this.panel.y = station.y;
		}

		// Upgrade text if there is an upgrade available
		if (station.upgradeTo) {
			const nextData = StationData[station.upgradeTo];
			const durationDiff = nextData.taskDuration! - station.taskDuration;
			const revenueDiff = nextData.admissionFee! - station.admissionFee;

			let text = "";
			text += `Tier: ${station.stationTier}\n`;
			if (station.taskDuration > 0) {
				text += `Duration: ${station.taskDuration / 1000}s (${
					durationDiff / 1000
				}s)\n`;
			}
			if (station.admissionFee > 0) {
				text += `Revenue: $${station.admissionFee} (+$${revenueDiff})\n`;
			}
			this.moneyText.setText(text);

			this.buyButton.setVisible(true);
			this.buyButton.setText(`$${station.upgradeCost}`);
		}
		// Otherwise, show current stats
		else {
			let text = "";
			text += `Tier: ${station.stationTier}\n`;
			text += `Duration: ${station.taskDuration / 1000}s\n`;
			text += `Revenue: $${station.admissionFee}\n`;
			this.moneyText.setText(text);

			this.buyButton.setVisible(false);
		}

		// Enable/disable buy button
		const canAfford = station.upgradeCost <= this.scene.money;
		this.buyButton.setEnabled(canAfford);

		this.open();
	}

	selectEmployee(employee: Employee) {
		this.selectedStation = null;
		this.selectedEmployee = employee;
		this.titleText.setText(employee.employeeName);

		// Position panel
		if (employee.x > this.scene.W / 2) {
			this.panel.x = employee.x - 500;
			this.panel.y = employee.y;
		} else {
			this.panel.x = employee.x + 500;
			this.panel.y = employee.y;
		}

		// Upgrade text if there is an upgrade available
		if (employee.upgradeTo) {
			const nextData = EmployeeData[employee.upgradeTo];
			const walkDiff = nextData.walkSpeed! - employee.walkSpeed;
			const workDiff = nextData.workSpeed! - employee.workSpeed;

			let text = "";
			text += `Tier: ${employee.employeeTier}\n`;
			text += `Walk speed: ${employee.walkSpeed} (+${walkDiff}s)\n`;
			text += `Work speed: ${employee.workSpeed} (+${workDiff})\n`;
			this.moneyText.setText(text);

			this.buyButton.setVisible(true);
			this.buyButton.setText(`$${employee.upgradeCost}`);
		}
		// Otherwise, show current stats
		else {
			let text = "";
			text += `Tier: ${employee.employeeTier}\n`;
			text += `Walk speed: ${employee.walkSpeed}\n`;
			text += `Work speed: ${employee.workSpeed}\n`;
			this.moneyText.setText(text);

			this.buyButton.setVisible(false);
		}

		// Enable/disable buy button
		const canAfford = employee.upgradeCost <= this.scene.money;
		this.buyButton.setEnabled(canAfford);

		this.open();
	}

	open() {
		if (this.alpha < 1) {
			this.setVisible(true);
			this.setAlpha(0);
			this.scene.tweens.add({
				targets: this,
				alpha: 1,
				duration: 200,
			});
		}
	}

	close() {
		this.setVisible(true);
		this.setAlpha(1);
		this.scene.tweens.add({
			targets: this,
			alpha: 0,
			duration: 200,
			onComplete: () => {
				this.setVisible(false);
				this.emit("close");
			},
		});
	}
}
