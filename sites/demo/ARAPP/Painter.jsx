import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { TubePainter } from "./TubePainter";
import { Object3D, Vector3 } from "three";

const Painter = React.memo(() => {
	const painter = useRef();
	const controller1Ref = (useRef < Object3D) | (null > null);
	const controller2Ref = (useRef < Object3D) | (null > null);

	useEffect(() => {
		painter.current = new TubePainter();
		return () => {
			painter.current.dispose();
		};
	}, []);

	useFrame(() => {
		const controller1 = controller1Ref.current;
		const controller2 = controller2Ref.current;
		handleController(controller1);
		handleController(controller2);
	});

	const handleController = (controller) => {
		if (!controller) {
			return; // Add a null check to avoid errors
		}

		const userData = controller.userData;
		const pivot = controller.getObjectByName("pivot");

		if (userData && userData.isSqueezing === true) {
			const delta =
				(controller.position.y - userData.positionAtSqueezeStart) * 5;
			const scale = Math.max(0.1, userData.scaleAtSqueezeStart + delta);

			pivot.scale.setScalar(scale);
			painter.current.setSize(scale);
		}

		const cursor = new Vector3();
		cursor.setFromMatrixPosition(controller.matrixWorld);

		if (userData && userData.isSelecting === true) {
			painter.current.lineTo(cursor);
			painter.current.update();
		}
	};

	return null; // This component doesn't render anything in the scene
});

export default Painter;
