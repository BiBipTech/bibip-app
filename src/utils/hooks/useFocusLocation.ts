import Mapbox from "@rnmapbox/maps";
import { CameraRef } from "@rnmapbox/maps/lib/typescript/components/Camera";
import { useCallback, useEffect, useState } from "react";

export const useFocusLocation = () => {
  const [cameraRef, setCameraRef] = useState<CameraRef | null>(null);
  const [userLocationRef, setUserLocationRef] =
    useState<Mapbox.UserLocation | null>(null);

  // map related callback references
  const camera = useCallback((node: CameraRef) => {
    setCameraRef(node);
  }, []);
  const userLocation = useCallback((node: Mapbox.UserLocation) => {
    setUserLocationRef(node);
  }, []);

  useEffect(() => {
    if (!cameraRef || !userLocationRef) return;

    cameraRef.setCamera({
      centerCoordinate: userLocationRef.state.coordinates ?? [],
      zoomLevel: 16,
      animationDuration: 1000,
    });
  }, [userLocationRef, cameraRef]);

  return {
    camera,
    userLocation,
    cameraRef,
    userLocationRef,
  };
};
