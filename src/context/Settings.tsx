import { createContext, ReactNode, useState } from "react";

interface Props {
	children: ReactNode;
}

const defaultSettings: Settings = {
	grid: true,
	canvasBorder: false,
};

export const SettingsContext = createContext({
	settings: defaultSettings,
	setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => {},
});

export const SettingsProvider = ({ children }: Props) => {
	const [settings, setSettings] = useState<Settings>(defaultSettings);

	const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
		setSettings((prev) => ({ ...prev, [key]: value }));
	};

	return <SettingsContext.Provider value={{ settings, setSetting }}>{children}</SettingsContext.Provider>;
};