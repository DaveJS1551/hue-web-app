import type { Light, LightState} from '../types'

const API_BASE = 'http://localhost:1551/api/lights'

export const fetchLights = async (): Promise<Light[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch lights');
    const data = await res.json();
    return data.lights || []
}

export const toggleLight = async (
    lightId: string,
    currentOn: boolean
): Promise<void> => {
    const newOn = !currentOn;
    const response = await fetch(`${API_BASE}/${lightId}/state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({on: newOn})
    });

    if (!response.ok) throw new Error("Failed to toggle light");
}

export const updateState = async (
    lightId: string,
    lState: LightState
): Promise<void> => {
    const response = await fetch(`${API_BASE}/${lightId}/state`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(lState)
    });

    if (!response.ok) throw new Error("Failed to update light state");
}
