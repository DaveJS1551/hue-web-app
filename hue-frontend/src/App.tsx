import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react';
import { fetchLights, toggleLight} from './features/lights/services/lightService';
import type { LightState, Light} from './features/lights/types';

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
        <p>No lights found</p>
      ) : (
        <ul>
          {lights.map((light) => {
            const isOn = light.state?.on ?? false;
            const cMode = light.state?.colormode ?? "ct";

            return (
              <li
                key={light.id}
                className={`light-item ${isOn ? 'light-on' : 'light-off'}`}
              >
                <div>
                  <div>
                    <button className='header-button'
                      onClick={() => toggleLight(light.id, isOn)}
                    ><strong>{light.name || `Light ${light.id}`}</strong></button>
                  </div>

                  <div>
                    {cMode === 'ct' && (
                      <div className="stats">
                      <p><strong>CT: </strong>{light.state?.ct} </p>
                      </div>
                    )}

                    {cMode === 'hs' && (
                      <div className="stats">
                        <p><strong>Hue:</strong> {light.state?.hue}</p>
                        <p><strong>Sat:</strong> {light.state?.sat}</p>
                        
                      </div>
                    )}
                  </div>

                  <div id="light-footer">
                    <p><strong>Bri:</strong> {light.state?.bri}</p>
                    
                    
                  </div>
                  
                </div>
              </li>
            )
          })}
        </ul>
      )}

    </div>

  </>
  )
}

export default App
