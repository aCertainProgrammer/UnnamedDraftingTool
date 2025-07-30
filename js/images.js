import { capitalize } from "./util.js";

async function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

export async function drawDraft(draft, icon_paths) {
	const image_canvas = document.createElement("canvas");
	if (!image_canvas.getContext("2d")) {
		console.error("Canvas API is not supported in your browser!");
		this.exportAllDraftsAsScreenshotsButton.innerText =
			"Canvas API is not supported in your browser!";
		return;
	}

	const ctx = image_canvas.getContext("2d");
	const row_gap_px = 10;
	const column_gap_px = 200;
	const ban_gap_px = 10;
	const champion_pick_width_px = 230;
	const champion_pick_height_px = 130;
	const champion_ban_width_px = 100;
	const champion_ban_height_px = 100;
	const padding_x_px = 4;
	const padding_y_px = 4;
	const name_space_px = 50;

	const image_height_px =
		6 * champion_pick_height_px +
		row_gap_px * 2 +
		2 * padding_y_px +
		name_space_px;
	const image_width_px =
		9 * champion_ban_width_px +
		ban_gap_px * 9 +
		column_gap_px +
		champion_ban_width_px +
		2 * padding_x_px;
	image_canvas.height = image_height_px;
	image_canvas.width = image_width_px;
	ctx.clearRect(0, 0, image_width_px, image_height_px);
	ctx.fillStyle = "#0d1117";
	ctx.fillRect(0, 0, image_width_px, image_height_px);

	await Promise.all(
		draft.picks.map(async (champion, i) => {
			let src = "";
			if (champion == "" || champion == "undefined") {
				src = icon_paths.defaultPickIconPath;
			} else {
				src =
					icon_paths.imagePath +
					"/centered_minified_converted_to_webp_scaled/" +
					capitalize(champion) +
					"_0.webp";
			}
			const img = await loadImage(src);

			const col = i < 5 ? 0 : 1;
			const row = i % 5;

			const max_x =
				9 * champion_ban_width_px + ban_gap_px * 9 + column_gap_px;

			const x =
				col == 0
					? col * champion_pick_width_px +
						column_gap_px * col +
						padding_x_px
					: max_x -
						champion_pick_width_px +
						champion_ban_width_px +
						padding_x_px;
			const y =
				row * champion_pick_height_px +
				row_gap_px * row +
				champion_ban_height_px +
				row_gap_px +
				padding_y_px +
				name_space_px;

			ctx.drawImage(
				img,
				x,
				y,
				champion_pick_width_px,
				champion_pick_height_px,
			);

			const border_width_px = 1;
			const border_color = "#404040";
			ctx.strokeStyle = border_color;
			ctx.lineWidth = border_width_px;
			ctx.strokeRect(
				x,
				y,
				champion_pick_width_px,
				champion_pick_height_px,
			);
		}),
	);

	await Promise.all(
		draft.bans.map(async (champion, i) => {
			let src = "";
			if (champion == "" || champion == "undefined") {
				src = icon_paths.defaultBanIconPath;
			} else {
				src =
					icon_paths.imagePath +
					icon_paths.banIconPath +
					capitalize(champion) +
					icon_paths.banIconPostfix;
			}

			const img = await loadImage(src);

			let col = i;
			if (i > 4) {
				col = 9 - (col % 5);
			}

			const middle_gap = i > 4 ? 1 : 0;
			const row = 0;

			const separator_values = [0, 0, 0, 1, 1, -1, -1, 0, 0, 0];
			let ban_separator = separator_values[col];

			const x =
				col * champion_ban_width_px +
				ban_gap_px * col +
				middle_gap * column_gap_px +
				padding_x_px +
				ban_separator * ban_gap_px * 2;
			const y =
				row * champion_pick_height_px +
				row_gap_px * row +
				padding_y_px +
				name_space_px;

			ctx.drawImage(
				img,
				x,
				y,
				champion_ban_width_px,
				champion_ban_height_px,
			);

			const border_width_px = 1;
			const border_color = "#404040";
			ctx.strokeStyle = border_color;
			ctx.lineWidth = border_width_px;
			ctx.strokeRect(x, y, champion_ban_width_px, champion_ban_height_px);
		}),
	);

	const font_size_px = 48;
	if (draft.name) {
		ctx.fillStyle = "#cccccc";
		ctx.font = `${font_size_px}px serif`;
		ctx.textAlign = "center";

		const max_text_width_px =
			image_width_px - 2 * champion_pick_width_px - 2 * ban_gap_px;

		const lines = getLines(ctx, draft.name, max_text_width_px);

		lines.forEach((line, index) => {
			ctx.fillText(
				line,
				image_width_px / 2,
				champion_ban_height_px * 2 + index * font_size_px,
				max_text_width_px,
			);
		});
	}

	ctx.textAlign = "left";
	if (draft.blue_name) {
		ctx.fillText(
			draft.blue_name,
			padding_x_px,
			font_size_px - padding_y_px / 2,
		);
	}

	ctx.textAlign = "right";
	if (draft.red_name) {
		ctx.fillText(
			draft.red_name,
			image_width_px - padding_x_px,
			font_size_px - padding_y_px / 2,
		);
	}

	return image_canvas.toDataURL("image/png");
}

function getLines(ctx, text, maxWidth) {
	let words = text.split(" ");
	let lines = [];
	let currentLine = words[0];

	for (let i = 1; i < words.length; i++) {
		let word = words[i];
		let width = ctx.measureText(currentLine + " " + word).width;

		if (width < maxWidth) {
			currentLine += " " + word;
		} else {
			lines.push(currentLine);
			currentLine = word;
		}
	}

	lines.push(currentLine);
	return lines;
}
