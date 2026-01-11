import requests
import json

# ================= CONFIG =================
BACKEND_URL = "http://localhost:1551"          # Change if your server runs on different port/host
LIGHT_ID    = "1"                              # Which light you want to control (as string)
# ==========================================

def control_light(light_id: str, state: dict):
    """
    Send PUT request to YOUR backend to change a Hue light state
    
    Examples:
    - Turn on full bright:    {"on": True, "bri": 254}
    - Dim to 30%:             {"bri": 77}
    - Nice warm white:        {"ct": 400, "bri": 180}
    - Colorful:               {"hue": 30000, "sat": 240, "bri": 200}
    """
    url = f"{BACKEND_URL}/api/lights/{light_id}/state"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print(f"Sending to: {url}")
        print("Payload:", json.dumps(state, indent=2))
        
        response = requests.put(
            url,
            json=state,           # automatically serializes dict → JSON
            headers=headers,
            timeout=5
        )
        
        response.raise_for_status()  # Raise exception for bad status codes
        
        print("\nSuccess! Status code:", response.status_code)
        print("Response from backend:")
        print(json.dumps(response.json(), indent=2))
        
        return True
        
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error: {e}")
        try:
            print("Error details:", response.json())
        except:
            print("Raw response:", response.text)
        return False
        
    except requests.exceptions.RequestException as e:
        print(f"Connection/Request error: {e}")
        return False


# ────────────────────────────────────────────────
#                Examples - uncomment what you want to test
# ────────────────────────────────────────────────

if __name__ == "__main__":
    # Example 1: Turn ON + maximum brightness
    # control_light(LIGHT_ID, {"on": True, "bri": 254})

    # Example 2: Turn OFF
    # control_light(LIGHT_ID, {"on": False})

    # Example 3: Warm white + smooth transition (most pleasant for testing)
    control_light(LIGHT_ID, {
        "on": True,
        "hue": 30000,              # warm white (~2700K)
        "sat": 255,
        "transitiontime": 30    # 3 seconds fade
    })

    # Example 4: Red party mode
    # control_light(LIGHT_ID, {"on": True, "hue": 0, "sat": 254, "bri": 200})

    # Example 5: Quick flash (alert)
    # control_light(LIGHT_ID, {"alert": "lselect"})  # long select flash