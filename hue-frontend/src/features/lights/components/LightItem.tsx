import { fetchLights, toggleLight, updateState} from '../services/lightService.ts';
import type { LightState, Light} from '../types';
import { useState } from 'react'
import './LightStyles.css';

interface LightItemProps {
    light: Light;
}

export function LightItem({light}: LightItemProps) {
    const isOn = light.state?.on ?? false;
    const bri = light.state?.bri ?? 1;
    const cMode = light.state?.colormode ?? 'ct';

    const [selectMode, setSelectMode] = useState(cMode)
    const [values, setValues] = useState({
        hue: light.state?.hue ?? 0,
        sat: light.state?.hue ?? 0,
        bri: light.state?.hue ?? 0,
        ct: light.state?.hue ?? 0,
    })

    const handleChangeMode = (mode: 'ct' | 'hs' | 'xy') => {
        setSelectMode(mode);
    };

    const handleChange = (property: keyof typeof values, newValue: number) => {
        setValues(prev => ({
            ...prev,
            [property]: newValue
        }));

        updateState(light.id, {[property]: newValue, on: true}).catch(console.error)
    }

    

    const handleToggle = () => {
        toggleLight(light.id, isOn).catch(err => {
            console.error("Failed to toggle light");
        });
    };

    const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBri = parseInt(e.target.value, 10);
        updateState(light.id, {on: true, bri: newBri}).catch(err => {
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
                <div className='light-body'>
                    <div className='mode-select-div'>
                        <label>
                            <input
                                type='radio'
                                name={`color-mode-${light.id}`}
                                value='ct'
                                checked={selectMode === 'ct'}
                                onChange={() => handleChangeMode('ct')}/>
                                    CT
                        </label>
                        <label>
                            <input
                            type='radio'
                            name={`color-mode-${light.id}`}
                            value='hs'
                            checked={selectMode === 'hs'}
                            onChange={() => handleChangeMode('hs')}/>
                            HS
                        </label>
                        <label>
                            <input
                            type='radio'
                            name={`color-mode-${light.id}`}
                            value='xy'
                            checked={selectMode === 'xy'}
                            onChange={() => handleChangeMode('xy')}/>
                            XY
                        </label>
                    </div>{/* radio buttons div*/}
                    
                    <div className='stats'>
                        {selectMode === 'ct' && (
                            <div>
                                <div>Color Tempearture</div>
                            </div>
                        )}

                        {selectMode === 'hs' && (
                            <div>
                                <div className='prop-div'>
                                    <label>Hue</label>
                                    <input 
                                        className='prop-slider '
                                        type='range'
                                        min='0'
                                        max='65535'
                                        value={values.hue}
                                        onChange={e => handleChange('hue', parseInt(e.target.value, 10))}
                                    />
                                </div>
                                <div className='prop-div'>
                                    <label>Sat</label>
                                    <input
                                        className='prop-slider'
                                        type='range'
                                        min='1'
                                        max='254'
                                        value={values.sat}
                                        onChange={e => handleChange('sat', parseInt(e.target.value, 10))}
                                    />

                                </div>
                            </div>
                        )}

                        {selectMode === 'xy' && (
                            <div>
                                <div>X</div>
                                <div>Y</div>
                            </div>
                        )}

                    </div>
                    

                    <div className='brightness-div'>Brightness</div>

                </div> {/* Light body */}
            </div> {/* Light Container Div */ }

            <div>
            </div>

        </li>
    )

}