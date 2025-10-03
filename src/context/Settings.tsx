import { createContext, ReactNode, useState } from "react";

interface Context {
	settings: Settings;
	setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

interface Props {
	children: ReactNode;
}

const defaultSettings: Settings = {
	grid: true,
	canvasBorder: false,
	historyPanel: true,
	colorPicker: true,
	blockReplacer: true,
	toolSettings: true,
	blockSelector: true,
};

// eslint-disable-next-line react-refresh/only-export-components
export const SettingsContext = createContext<Context>({} as Context);

export const SettingsProvider = ({ children }: Props) => {
	const [settings, setSettings] = useState<Settings>(defaultSettings);

	const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
		setSettings((prev) => ({ ...prev, [key]: value }));
	};

	return <SettingsContext.Provider value={{ settings, setSetting }}>{children}</SettingsContext.Provider>;
};
