import { fetchLights, toggleLight, updateState} from '../services/lightService.ts';
import type { LightState, Light} from '../types';


export function LightItem({light}: Light) {
    const isOn = light.state?.on ?? false;
    const bri = light.state?.bri ?? 1;
    const cMode = light.state?.colormode ?? 'ct';

    const handleToggle = () => {
        toggleLight(light.id, isOn).catch(err => {
            console.error("Failed to toggle light");
        });
    };

    const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBri = parseInt(e.target.value, 10);
        updateState(light.id, {bri: newBri}).catch(err => {
            console.error("Brightness update failed")
        });
    };

    return (
        <li className={`light-item ${isOn ? 'light-on' : 'light-off'}`}>
            <div className='light-container'>
                <div className='light-header'>
                    <button className='header-button' onClick={handleToggle}>
                        <strong>{light.name || `Light: ${light.id}`}</strong>
                    </button>
                </div>
            </div> {/* Light Container Div */ }

            <div>
            </div>

        </li>
    )

}