import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { fetchResource } from "../../api";

export default function useMapData() {
  const [mapData, setMapData] = useState({
    nodes: null,
    requests: null,
    links: null,
    appointments: null,
    los: null,
  });

  const [loading, setLoading] = useState(false);
  const [stale, setStale] = useState(true);

  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isLoading) return;

    // Hack to trigger map reload from child components
    if (!stale) return;

    try {
      fetchMap();
    } catch (error) {
      alert(error);
      setLoading(false);
    }

    async function fetchMap() {
      setLoading(true);
      const token = isAuthenticated ? await getAccessTokenSilently() : null;
      const newMapData = await fetchResource("map", token);
      setMapData((mapData) => ({
        ...newMapData,
        los: mapData.los,
      }));
      setLoading(false);
    }
  }, [isLoading, stale, isAuthenticated, getAccessTokenSilently]);

  const reloadMap = useCallback(() => {
    setStale(true);
  }, [setStale]);

  const setLos = useCallback(
    (los) => {
      setMapData((mapData) => ({
        ...mapData,
        los,
      }));
    },
    [setMapData]
  );

  return [mapData, loading, reloadMap, setLos];
}
