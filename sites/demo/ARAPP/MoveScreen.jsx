// import React from 'react';
// import { useRef, useMemo } from 'react';
// import { Object3D, Matrix4, Vector3} from 'three';
// import { useFrame } from '@react-three/fiber';
// import { Interactive } from '@react-three/xr';

// export function MoveScreen(
//   { onSelectStart, onSelectEnd, children, ...rest }
// ) {
//   const controller1Ref = useRef<Object3D | null>(null);
//   const controller2Ref = useRef<Object3D | null>(null);

//   const previousTransform = useMemo(() => new Matrix4(), [])
//   const previousPosition = useMemo(() => new Vector3(), [])

//   useFrame(() => {
//     const controller1 = controller1Ref.current;
//     const controller2 = controller2Ref.current;

//     const obj = intersectedObj.current;
//     if(!obj) return
//     if(!controller1) return

//     if(controller1 && !controller2) {
//       if (
//         Math.abs(previousPosition.x - controller1.position.x) < 0.0005 &&
//         Math.abs(previousPosition.y - controller1.position.y) < 0.0005 &&
//         Math.abs(previousPosition.z - controller1.position.z) < 0.0005
//       ) {
//         return;
//       }
//       // Handle translation and rotation for single controller
//       obj.applyMatrix4(previousTransform);
//       obj.applyMatrix4(controller1.matrixWorld);
//       obj.updateMatrixWorld();
//       previousPosition.copy(controller1.position)
//       previousTransform.copy(controller1.matrixWorld).invert();
//     }
//   });

//   const intersectedObj = useRef<Object3D | null>(null);
//   const handleSelectStart = (e) => {
//     console.debug('handleSelectStart')

//     const controller = e.target;
//     // Determine if it's the first or second controller
//     if (!controller1Ref.current) {
//       controller1Ref.current = controller.controller;
//       previousPosition.copy(controller.controller.position)
//       previousTransform.copy(controller.controller.matrixWorld).invert();
//       intersectedObj.current = e.intersection?.object
//       onSelectStart?.(e);
//     } else if (!controller2Ref.current && controller1Ref.current !== controller.controller) {
//       controller2Ref.current = controller.controller;
//     }
//   };

//   const handleSelectEnd = (e) => {
//     const controller = e.target;
    
//     console.log("handleSelectEnd", controller.controller)
//     if (controller1Ref.current === controller.controller) {
//       controller1Ref.current = undefined
//       intersectedObj.current = undefined
//     } else if (controller2Ref.current === controller.controller) {
//       controller2Ref.current = undefined
//     }
//     onSelectEnd?.(e);
//   };

//   return (
//     <Interactive
//       onSelectStart={handleSelectStart}
//       onBlur={handleSelectEnd}
//       onSelectEnd={handleSelectEnd}
//       {...rest}
//     >
//       {children}
//     </Interactive>
//   );
// }