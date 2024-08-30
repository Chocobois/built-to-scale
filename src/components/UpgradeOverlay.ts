import { GameScene } from "@/scenes/GameScene";
import { RoundRectangle } from "./elements/RoundRectangle";
import { TextButton } from "./TextButton";
import { Station } from "./Station";
import { Employee } from "./Employee";
import { StationData } from "./StationData";
import { EmployeeData } from "./EmployeeData";
import { numberWithCommas } from "@/utils/functions";

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
		this.background = this.scene.add.rectangle(0, 0, scene.W, scene.H, 0, 0.8);
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
		this.titleText.setStroke("black", 6);
		this.panel.add(this.titleText);

		this.moneyText = this.scene.addText({
			x: -250,
			y: -50,
			size: 40,
			color: "#FFFFFF",
			text: "...",
		});
		this.moneyText.setStroke("black", 6);
		this.moneyText.setOrigin(0);
		this.panel.add(this.moneyText);

		this.buyButton = new TextButton(scene, 220, 150, 200, 100, "$100");
		this.panel.add(this.buyButton);
		this.buyButton.on("click", () => {
			if (this.selectedStation) {
				this.emit("upgradeStation", this.selectedStation);
				this.scene.sound.play("score", { volume: 1.0 });
			} else {
				this.emit("upgradeEmployee", this.selectedEmployee);
				this.scene.sound.play("score", { volume: 1.0 });
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
		this.panel.x = station.x + 450 * Math.sign(this.scene.W / 2 - station.x);
		this.panel.y = Phaser.Math.Clamp(station.y, 200, this.scene.H - 250);

		// Upgrade text if there is an upgrade available
		if (station.upgradeTo && station.hasBeenPurchased) {
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
		}
		// Otherwise, show current stats
		else {
			let text = "";
			text += `Tier: ${station.stationTier}\n`;
			text += `Duration: ${station.taskDuration / 1000}s\n`;
			text += `Revenue: $${station.admissionFee}\n`;
			this.moneyText.setText(text);
		}

		// Enable/disable buy button
		const canAfford = station.upgradeCost <= this.scene.money;
		this.buyButton.setEnabled(canAfford);
		this.buyButton.setVisible(!!station.upgradeTo || !station.hasBeenPurchased);
		this.buyButton.setText(`$${numberWithCommas(station.upgradeCost)}`);

		this.open();
	}

	selectEmployee(employee: Employee) {
		this.selectedStation = null;
		this.selectedEmployee = employee;
		this.titleText.setText(employee.employeeName);

		// Position panel
		this.panel.x = employee.x + 450 * Math.sign(this.scene.W / 2 - employee.x);
		this.panel.y = Phaser.Math.Clamp(employee.y, 200, this.scene.H - 250);

		// Upgrade text if there is an upgrade available
		if (employee.upgradeTo && employee.hasBeenPurchased) {
			const nextData = EmployeeData[employee.upgradeTo];
			const walkDiff = nextData.walkSpeed! - employee.walkSpeed;
			const workDiff = nextData.workSpeed! - employee.workSpeed;

			let text = "";
			text += `Tier: ${employee.employeeTier}\n`;
			text += `Walk speed: ${employee.walkSpeed} (+${walkDiff}s)\n`;
			text += `Work speed: ${employee.workSpeed} (+${workDiff})\n`;
			this.moneyText.setText(text);

			this.buyButton.setVisible(true);
		}
		// Otherwise, show current stats
		else {
			let text = "";
			text += `Tier: ${employee.employeeTier}\n`;
			text += `Walk speed: ${employee.walkSpeed}\n`;
			text += `Work speed: ${employee.workSpeed}\n`;
			this.moneyText.setText(text);
		}

		// Enable/disable buy button
		const canAfford = employee.upgradeCost <= this.scene.money;
		this.buyButton.setEnabled(canAfford);
		this.buyButton.setVisible(
			!!employee.upgradeTo || !employee.hasBeenPurchased
		);
		this.buyButton.setText(`$${numberWithCommas(employee.upgradeCost)}`);

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
			this.scene.sound.play("flail", { volume: 0.3 });
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
		this.scene.sound.play("missLand", { volume: 0.2 });
	}
}
