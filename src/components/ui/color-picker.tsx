"use client";

import { type IColor, ColorPicker as ReactColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

interface ColorPickerProps {
	color?: string;
	height?: number;
	hideAlpha?: boolean;
	hideInput?: (keyof IColor)[] | boolean;
	onChange?: (color: IColor) => void;
	onChangeComplete?: (color: IColor) => void;
}

const ColorPicker = ({
	color = "#27AE80",
	height = 120,
	hideAlpha = true,
	hideInput = ["rgb", "hsv"],
	onChange = () => {},
	onChangeComplete = () => {},
}: ColorPickerProps) => {
	const [chosenColor, setChosenColor] = useColor(color);

	const handleChange = (val: IColor) => {
		setChosenColor(val);
		onChange(val);
	};

	return (
		<div className="[&_.rcp-root]:bg-surface-light-200 [&_.rcp-root]:dark:bg-surface-dark-500 [&_.rcp-root]:rounded [&_.rcp-saturation]:rounded [&_.rcp-saturation]:rounded-b-none [&_.rcp-field-input]:bg-neutral-200 [&_.rcp-field-input]:dark:bg-neutral-950 [&_.rcp-field-input]:border-none [&_.rcp-field-input]:text-neutral-700 [&_.rcp-field-input]:dark:text-neutral-200 [&_.rcp-field-label]:font-semibold [&_.rcp-field-label]:text-neutral-500">
			<ReactColorPicker
				color={chosenColor}
				height={height}
				hideAlpha={hideAlpha}
				hideInput={hideInput}
				onChange={handleChange}
				onChangeComplete={onChangeComplete}
			/>
		</div>
	);
};

export default ColorPicker;
