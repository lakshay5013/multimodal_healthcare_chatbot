"""
Risk Severity Scoring System for Rabbit AI
Analyzes chatbot responses to determine health risk level.
Does NOT modify RAG pipeline or Groq logic.
"""

import re

# Emergency / High-risk keywords
HIGH_RISK_KEYWORDS = [
    "chest pain", "heart attack", "cardiac arrest", "stroke",
    "breathing difficulty", "difficulty breathing", "shortness of breath",
    "unconscious", "loss of consciousness", "unresponsive",
    "severe bleeding", "hemorrhage", "internal bleeding",
    "suicidal", "suicide", "self-harm", "thoughts of death",
    "seizure", "convulsion",
    "anaphylaxis", "severe allergic reaction",
    "poisoning", "overdose",
    "choking", "cannot breathe",
    "call 911", "call emergency", "emergency services",
    "medical emergency", "seek emergency",
    "pulmonary embolism", "blood clot",
    "severe trauma", "head injury",
    "facial drooping", "arm weakness", "speech difficulty",
]

# Moderate-risk keywords
MEDIUM_RISK_KEYWORDS = [
    "persistent pain", "chronic pain", "pain lasting",
    "fever", "high fever", "temperature",
    "infection", "infected",
    "swelling", "inflammation",
    "blood in urine", "blood in stool",
    "vomiting", "persistent vomiting",
    "difficulty swallowing",
    "severe cough", "cough with blood",
    "weight loss", "unexplained weight",
    "numbness", "tingling",
    "blurred vision", "vision changes",
    "palpitations", "irregular heartbeat",
    "dizziness", "fainting",
    "rash", "skin changes",
    "urgent care", "schedule appointment",
    "consult a doctor", "see a doctor", "consult your doctor",
    "seek medical", "medical attention",
    "medication", "prescribed",
    "monitor", "check-up",
]


def analyze_risk(response_text: str) -> dict:
    """
    Analyze the chatbot response text and determine risk severity.
    
    Args:
        response_text: The AI-generated response string
        
    Returns:
        dict with risk_level and suggested_action
    """
    text_lower = response_text.lower()
    
    # Check HIGH risk first
    high_matches = [kw for kw in HIGH_RISK_KEYWORDS if kw in text_lower]
    if high_matches:
        return {
            "risk_level": "High",
            "suggested_action": "⚠️ This may be a medical emergency. Please call emergency services (911) or visit the nearest emergency room immediately.",
        }
    
    # Check MEDIUM risk
    medium_matches = [kw for kw in MEDIUM_RISK_KEYWORDS if kw in text_lower]
    if len(medium_matches) >= 2:
        return {
            "risk_level": "Medium",
            "suggested_action": "📋 We recommend scheduling an appointment with your healthcare provider for proper evaluation.",
        }
    
    # Default: LOW risk
    return {
        "risk_level": "Low",
        "suggested_action": "✅ General health information. Maintain a healthy lifestyle and attend regular check-ups.",
    }
