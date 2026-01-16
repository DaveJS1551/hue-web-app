interface LightState {
    on: boolean;
    bri?: number;
    hue?: number;
    sat?: number;
    ct?: number;
    xy?: [number, number]
}

interface Light {
    id: string,
    name?: string,
    state: LightState
}