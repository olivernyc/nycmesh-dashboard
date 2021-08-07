import { useState, useEffect } from "react";
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

  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isLoading) return;
    try {
      fetchMap();
    } catch (error) {
      alert(error);
      setLoading(false);
    }

    async function fetchMap() {
      setLoading(true);
      let token;
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
      }
      const newMapData = await fetchResource("map", token);
      setMapData((mapData) => ({
        ...newMapData,
        los: mapData.los,
      }));
      setLoading(false);
    }
  }, [isLoading, isAuthenticated, getAccessTokenSilently]);

  return [mapData, loading];
}
