import { EnhancedRayGrab } from "./TwoHandScale";
import { Fragment } from "react";
import { objectsToShow } from "./ARApp";
import React from "react";
const cube = (
	<EnhancedRayGrab>
		<mesh name="cube" position={[-0.18, 1.13, -1.2]} rotation={[0, 0, 0]}>
			<boxGeometry args={[0.35, 0.35, 0.35]} />
			<meshStandardMaterial color="skyblue" />
		</mesh>
	</EnhancedRayGrab>
);

const cubes = (
	<EnhancedRayGrab>
		<mesh name="cube" position={[0.18, 1.13, -1.2]} rotation={[0, 0, 0]}>
			<boxGeometry args={[0.35, 0.35, 0.35]} />
			<meshStandardMaterial color="skyblue" transparent opacity={0.5} />
			<EnhancedRayGrab>
				<mesh position={[-0.025, 0, 0]}>
					<boxGeometry args={[0.02, 0.02, 0.02]} />
				</mesh>
			</EnhancedRayGrab>
			<EnhancedRayGrab>
				<mesh position={[0.025, 0, 0]}>
					<boxGeometry args={[0.02, 0.02, 0.02]} />
					<meshLambertMaterial />
				</mesh>
			</EnhancedRayGrab>
		</mesh>
	</EnhancedRayGrab>
);

const knot = (
	<EnhancedRayGrab>
		<mesh position={[0, 1, -5]}>
			<torusKnotGeometry args={[0.5, 0.2, 200, 32]} />
			<meshPhongMaterial color="skyblue" />
		</mesh>
	</EnhancedRayGrab>
);

export function RetriveObject({
	intersectPointX = 0,
	intersectPointY = 0,
}) {
	if (intersectPointX && intersectPointX < 0.5 && intersectPointX > 0) {
		displayObject({ objectName: "cubes", object: cubes });
	} else if (intersectPointX && intersectPointX > 0.5 && intersectPointX < 1) {
		displayObject({ objectName: "cube", object: cube });
	}
	// objectsToShow.push(<Fragment key={`object${objectsToShow.length}`}>{knot}</Fragment>);
	// objectsToShow.push(<Fragment key={`object${objectsToShow.length}`}>{cubes}</Fragment>);
	return <Fragment>{objectsToShow}</Fragment>;
}

function displayObject({
	objectName = " ",
	object,
}) {
	if (
		!objectsToShow.some(
			(item) => React.isValidElement(item) && item.key === objectName
		)
	) {
		objectsToShow.push(<Fragment key={objectName}>{object}</Fragment>);
	}
}
