import "client-only";

import { Area } from "react-easy-crop";

// Function to read a file and return its contents as a data URL
async function readFile(file: Blob): Promise<string | ArrayBuffer | null> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);

		reader.readAsDataURL(file);
	});
}

// Function to create an HTMLImageElement from a URL
async function createImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();

		image.onload = () => resolve(image);
		image.onerror = (error) => reject(error);

		image.crossOrigin = "anonymous";
		image.src = url;
	});
}

// Function to convert degrees to radians
function getRadianAngle(degreeValue: number) {
	return (degreeValue * Math.PI) / 180;
}

// Function to calculate the bounding box size of a rotated rectangle
function rotateSize(width: number, height: number, rotation: number) {
	const rotRad = getRadianAngle(rotation);

	return {
		width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
		height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
	};
}

// Function to get a cropped, rotated, and possibly flipped image as a Blob and URL
async function getCroppedImg(
	imageSrc: string,
	pixelCrop: Area = { x: 0, y: 0, width: 0, height: 0 },
	rotation: number = 0,
	flip = { horizontal: false, vertical: false }
): Promise<string | null> {
	// Load the image from the provided URL
	const image = await createImage(imageSrc);

	// Create a canvas element and get its 2D rendering context
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	// Return null if the context is not available
	if (!ctx) return null;

	// Calculate the rotation in radians
	const rotRad = getRadianAngle(rotation);

	// Calculate the bounding box dimensions of the rotated image
	const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

	// Set canvas size to match the bounding box
	canvas.width = bBoxWidth;
	canvas.height = bBoxHeight;

	// Transform context
	ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
	ctx.rotate(rotRad);
	ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
	ctx.translate(-image.width / 2, -image.height / 2);

	// Draw the rotated and flipped image
	ctx.drawImage(image, 0, 0);

	// Extract the cropped image
	const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

	// Resize canvas to crop size
	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	// Paste the cropped image data onto the resized canvas
	ctx.putImageData(data, 0, 0);

	// Convert Base64 string and return
	return canvas.toDataURL("image/jpeg");
}

export { readFile, getCroppedImg };
