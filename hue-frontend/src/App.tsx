import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';
import { fetchLights, toggleLight} from './features/lights/services/lightService';
import type { LightState, Light} from './features/lights/types';
import { LightItem } from './features/lights/components/LightItem';

function App() {
  const [lights, setLights] = useState<Light[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string |null>(null);

  useEffect(() => {
    const loadLights = async () => {
      try {
        setLoading(true);
        const fetchedLights = await fetchLights();
        setLights(fetchedLights)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load lights");
      } finally {
        setLoading(false);
      }
    };

    loadLights();
  }, [])

  if (loading) return <div>Loading lights...</div>
  if (error) return <div>Error: {error}</div>


  return (
    <>
    
    <div style={{ padding: '2rem' }}>
      <h1>My Hue Lights</h1>

      {lights.length === 0 ? (
        <p>No Lights Found</p>
      ) : (
        <ul style={{listStyle: 'none', padding: 0}}>
          {lights.map(light => (
            <LightItem key={light.id} light={light} />
          ))}
        </ul> 
      )
    
    }; 

    </div>

  </>
  )
}

export default App
