import { useContext, useState } from "react";

import { CanvasContext } from "@/context/Canvas";
import { HistoryContext } from "@/context/History";

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VersionCombobox from "@/components/VersionCombobox";

function SetVersion({ close }: DialogProps) {
	const { version: contextVersion, setVersion: setContextVersion } = useContext(CanvasContext);
	const { addHistory } = useContext(HistoryContext);

	const [version, setVersion] = useState(contextVersion);

	const onSubmit = () => {
		const oldVersion = contextVersion;

		setContextVersion(version);
		addHistory(
			"Set Version",
			() => setContextVersion(version),
			() => setContextVersion(oldVersion)
		);

		close();
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Set Version</DialogTitle>
				<DialogDescription>Updates your block palette to the specified Minecraft version</DialogDescription>
			</DialogHeader>

			<VersionCombobox version={version} setVersion={setVersion} />

			<DialogFooter>
				<Button variant="outline" onClick={close}>
					Cancel
				</Button>
				<Button type="submit" onClick={onSubmit} autoFocus>
					Set
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}

export default SetVersion;
