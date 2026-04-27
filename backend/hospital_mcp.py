import requests

def find_hospitals(location: str, hospital_name: str = None) -> str:
    """
    Search for hospitals in a given city or location using OpenStreetMap Nominatim API.
    Can also search for a specific hospital by name if provided.
    Returns a formatted string of up to 5 matching results.
    """
    # Use headers to comply with Nominatim's user agent policy
    headers = {
        "User-Agent": "Healthcare_RAG_Assistant_App/1.0"
    }

    # Query Nominatim API
    # Searching specifically for a named hospital or general hospitals in the provided location
    if hospital_name:
        query = f"{hospital_name}+in+{location}"
    else:
        query = f"hospital+in+{location}"

    url = f"https://nominatim.openstreetmap.org/search?q={query}&format=jsonv2&limit=5"
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if not data:
            if hospital_name:
                return f"No results found for {hospital_name} near {location}. Please verify the name or city."
            return f"No hospitals found near {location}. Please verify the city name or try searching a nearby larger city."
            
        if hospital_name:
            result_text = f"Here are the search results for {hospital_name} in {location}:\n"
        else:
            result_text = f"Here are the nearest hospitals to {location} based on our search:\n"
            
        for i, place in enumerate(data, 1):
            name = place.get('name', 'Unnamed Hospital/Clinic')
            if not name and hospital_name: 
                name = hospital_name  # fallback if OSM doesn't return a specific name tag
            # Extract formatted address from display_name
            address_parts = place.get('display_name', '').split(',')
            # Cleaning up display name to skip super lengthy coordinates
            formatted_address = ", ".join(address_parts[:3]).strip() if len(address_parts) > 3 else place.get('display_name', 'Address not found')
            
            result_text += f"{i}. **{name}**\n   Address: {formatted_address}\n"
            
        return result_text
        
    except requests.exceptions.RequestException as e:
        return f"Sorry, there was an error retrieving hospital data for {location}. Please consult local emergency directories directly."
