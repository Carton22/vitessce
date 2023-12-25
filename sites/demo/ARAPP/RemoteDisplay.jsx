import React from "react";
import { useThree } from "@react-three/fiber";
import { useXR } from "@react-three/xr";
import { useEffect, useMemo, useState } from "react";
import {
	BackSide,
	DoubleSide,
	MirroredRepeatWrapping,
	PlaneGeometry,
	Vector2,
	WebGLRenderer,
	sRGBEncoding,
} from "three";
import { video } from "./connectRemoteDisplay";

export function RemoteDisplay({
	centralAngle = Math.PI / 10,
	radius = 2.4,
	transform = new XRRigidTransform({ x: 0, y: 0, z: 1.35 }),
}) {
	const renderer = useThree((s) => s.gl);
	const isPresenting = useXR((s) => s.isPresenting);

	// for debugging
	const isDesktop = false;
	const layer = isDesktop
		? null
		: useMemo(
				() => (isPresenting ? createLayer(renderer) : null),
				[renderer, isPresenting]
		  );

	useRerenderOnAspectRatioChange(video);
	const aspectRatio = Number.isFinite(video.videoWidth / video.videoHeight)
		? video.videoWidth / video.videoHeight
		: 16 / 9;

	useEffect(() => {
		if (!layer) return;
		layer.centralAngle = centralAngle;
		layer.radius = radius;
		layer.transform = transform;
	}, [layer, centralAngle, radius, transform]);

	const material = layer ? (
		<meshBasicMaterial side={DoubleSide} colorWrite={false} color="pink" />
	) : (
		<meshBasicMaterial side={DoubleSide}>
			<videoTexture
				args={[video]}
				attach="map"
				offset={new Vector2(1, 0)}
				wrapS={MirroredRepeatWrapping}
				encoding={sRGBEncoding}
			/>
		</meshBasicMaterial>
	);

	return (
		<mesh
			name="display"
			position={[
				transform.position.x,
				transform.position.y,
				transform.position.z,
			]}
			rotation={[0, 0, 0]}
		>
			<cylinderGeometry
				args={[
					radius,
					radius,
					(centralAngle * radius) / aspectRatio, // height
					16, // segments
					1, // height segments
					true, // open ended
					Math.PI - centralAngle / 2, // theta start
					centralAngle, // theta length
				]}
			/>
			{material}
		</mesh>
	);
}

function createLayer(renderer) {
	const session = renderer.xr.getSession();
	if (!session) throw Error("no session");
	const space = renderer.xr.getReferenceSpace();
	if (!space) throw Error("no ref space");
	const xrMediaFactory = new XRMediaBinding(session);
	const layer = xrMediaFactory.createCylinderLayer(video, { space });
	session.updateRenderState({ layers: [layer, renderer.xr.getBaseLayer()] });
	return layer;
}

function useRerenderOnAspectRatioChange(video) {
	const [, set] = useState(0);
	useEffect(() => {
		const forceRerender = () => set((x) => x + 1);
		video.addEventListener("loadedmetadata", forceRerender);
		return () => video.removeEventListener("loadedmetadata", forceRerender);
	}, [video]);
}
