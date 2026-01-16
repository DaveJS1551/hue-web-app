import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react';
import { fetchLights, toggleLight} from './features/lights/services/lightService';

function App() {
  const [lights, setLights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:1551/api/lights')
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch lights");
        return res.json();
      })
      .then (data => {
        setLights(data.lights || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [])

  const toggleLight = async (lightId, isCurrentlyOn) => {
    const newState = !isCurrentlyOn;

    setLights(prev => 
      prev.map(l => 
        l.id === lightId ? { ...l, state: { ...l.state, on: newState}} : l
      )
    );

    try {
      const response = await fetch(`http://localhost:1551/api/lights/${lightID}/state`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({on: newState})
      });

      if (!response.ok) {
        throw new Error('Toggle Failed');
      };

      setTimeout(() => {
        fetch('http://localhost:1551/api/lights')
          .then(res => res.json())
          .then(data = setLights(data.lights || []));
      }, 800)
    } catch (err) {
      console.error(err);

      setLights(prev => 
        prev.map(l =>
          l.id === lightID ? { ...l, state: { ...l.state, on: isCurrentlyOn } } : l
        )
      );

      alert('Could not change light state - check console');
    }
  }


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
            const cMode = light.state?.colormode ?? ct;

            return (
              <li
                key={light.id}
                className={`light-item ${isOn ? 'light-on' : 'light-off'}`}
              >
                <div>
                  <div>
                    <button class='header-button'
                      onClick={() => toggleLight(light.id, isOn)}
                    ><strong>{light.name || `Light ${light.id}`}</strong></button>
                  </div>

                  <div>
                    {cMode === 'ct' && (
                      <div class="stats">
                      <p><strong>CT: </strong>{light.state?.ct} </p>
                      </div>
                    )}

                    {cMode === 'hs' && (
                      <div class="stats">
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
