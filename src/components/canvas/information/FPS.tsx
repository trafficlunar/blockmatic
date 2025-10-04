interface Props {
	fps: number | undefined;
}

function FPS({ fps }: Props) {
	return (
		<div className="absolute left-4 top-4 info-child">
			<span>FPS: {fps ? Math.round(fps) : "???"}</span>
		</div>
	);
}

export default FPS;
