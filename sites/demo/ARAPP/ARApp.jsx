import { Canvas } from "@react-three/fiber";
import { XRButton, XR, Hands, Interactive } from "@react-three/xr";
import { Holodeck } from "./Holodeck";
import { RemoteDisplay } from "./RemoteDisplay";
import { EnhancedRayGrab } from "./TwoHandScale";
// import { MoveScreen } from "./MoveScreen";
import { RetriveObject } from "./RetriveObject";
import { Controllers } from "./react-xr/Controller";
import { DoubleSide, Vector3 } from "three";
import { useState } from "react";
import { useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import React from "react";
const ws = import.meta.hot;
export const WS_EVENT = "click:event";
export let objectsToShow = [];
// const eventManagerFactory: Parameters<typeof Canvas>[0]["events"] = (
// 	state
// ) => ({
// 	// Default configuration
// 	...events(state),

// 	// // Determines if the event layer is active
// 	// enabled: true,

// 	// // Event layer priority, higher prioritized layers come first and may stop(-propagate) lower layer
// 	// priority: 1,

// 	// The filter can re-order or re-structure the intersections
// 	// @ztchen: We need this to intersect with multiple occluded objects
// 	filter: (items: THREE.Intersection[]) => {
// 		// cube has the highest priority
// 		const toReturn = [];
// 		for (const item of items) {
// 			toReturn.push(item);
// 			if (item.object.name === "cube") {
// 				break;
// 			}
// 		}
// 		return toReturn;
// 	},

// 	// // The compute defines how pointer events are translated into the raycaster and pointer vector2
// 	// compute: (event: DomEvent, state: RootState, previous?: RootState) => {
// 	//   state.pointer.set((event.offsetX / state.size.width) * 2 - 1, -(event.offsetY / state.size.height) * 2 + 1)
// 	//   state.raycaster.setFromCamera(state.pointer, state.camera)
// 	// },

// 	// Find more configuration default on ./packages/fiber/src/web/events.ts
// 	// And type definitions in ./packages/fiber/src/core/events.ts
// });

export default function App() {
	const [initialHandPosition, setInitialHandPosition] = useState(
		new Vector3(0, 0, 0)
	);
	const [intersectX, setIntersectX] = useState(0);
	const [intersectY, setIntersectY] = useState(0);
	const orbitRef = useRef(null);
	return (
		<div id="ThreeJs" style={{ width: "100%", height: "100%" }}>
			<XRButton
				mode="AR"
				sessionInit={{ optionalFeatures: ["layers"] }}
				style={{
					position: "absolute",
					bottom: "10%",
					left: "50%",
					transform: "translateX(-50%)",
					zIndex: 1,
				}}
			/>
			<Canvas
				camera={{ position: [0, 3, 2], rotation: [0, 0, 0] }}
			>
				<XR>
					<Interactive
						onSelectStart={(e) => {
							console.log("selected", e);
							// only send event for the right controller
							// if (e.target.index !== 0) return;
							setInitialHandPosition(e.target.controller.position.clone());
							ws?.send(WS_EVENT, {
								type: "selectStart",
								data: e.intersection?.uv,
							});
							console.log("on select start", e.intersection?.uv);
							if (e.intersection?.uv) {
								setIntersectX(e.intersection.uv.x);
								setIntersectY(e.intersection.uv.y);
							}
						}}
						onSelectEnd={(e) => {
							// console.log("selected", e)
							// only send event for the right controller
							// if (e.target.index !== 0) return;
							ws?.send(WS_EVENT, {
								type: "selectEnd",
								data: e.intersection?.uv,
							});
							console.log("on select end", e.intersection?.uv);
						}}
						onSelectMissed={(e) => {
							// console.log("selected", e)
							// only send event for the right controller
							// if (e.target.index !== 0) return;
							ws?.send(WS_EVENT, {
								type: "selectMissed",
								data: e.intersection?.uv,
							});
						}}
						onBlur={(e) => {
							// console.log("selected", e)
							// only send event for the right controller
							if (e.target.index !== 0) return;
							ws?.send(WS_EVENT, { type: "blur", data: e.intersection?.uv });
						}}
						onMove={(e) => {
							// console.log("selected", e)
							// only send event for the right controller
							// if (e.target.index !== 0) return;
							ws?.send(WS_EVENT, { type: "move", data: e.intersection?.uv });
							setHandDeltaZ(
								e.target.controller.position.z - initialHandPosition.z
							);
						}}
					>
						{import.meta.env.DEV && <RemoteDisplay />}
						{/* {screen} */}
					</Interactive>
					{/* to remove the black and yello background, you just need to annotate the below code*/}
					{/* <Holodeck /> */}
					{lights}
					<RetriveObject
						intersectPointX={intersectX}
						intersectPointY={intersectY}
					/>
					<Controllers />
					<Hands />
					<OrbitControls ref={orbitRef} />
				</XR>
			</Canvas>
		</div>
	);
}

const lights = (
	<>
		<ambientLight intensity={0.15} />
		<directionalLight position={[1, 1, 1]} intensity={0.65} />
		<directionalLight
			position={[-1, -1, -1]}
			intensity={0.25}
			color="#cccc00"
		/>
	</>
);

const screen = (
	// <MoveScreen>
	<mesh
		name="display"
		position={[0, 1.6, 1.8]}
		rotation={[-Math.PI / 20, 0, 0]}
	>
		<cylinderGeometry
			args={[
				2.4, // radius
				2.4, // radius
				((Math.PI / 10) * 2.4) / (14 / 9), // height
				16, // segments
				1, // height segments
				true, // open ended
				Math.PI - Math.PI / 20, // theta start
				Math.PI / 10, // theta length
			]}
		/>
		<meshBasicMaterial side={DoubleSide} colorWrite={true} color="orange" />
	</mesh>
	// </MoveScreen>
);

