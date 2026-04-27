"""
Health Report Analyzer for Rabbit AI
Extracts medical parameters from PDF blood test reports using Groq LLM,
compares with normal ranges, and generates AI explanation.
Does NOT modify existing RAG pipeline.
"""

import os
import json
import re
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

# Normal ranges for common blood test parameters
NORMAL_RANGES = {
    "HEMOGLOBIN": {"min": 12.0, "max": 17.5, "unit": "g/dL"},
    "WBC": {"min": 4000, "max": 11000, "unit": "cells/mcL"},
    "RBC": {"min": 4.5, "max": 5.5, "unit": "million/mcL"},
    "PLATELETS": {"min": 150000, "max": 400000, "unit": "cells/mcL"},
    "BLOOD SUGAR": {"min": 70, "max": 100, "unit": "mg/dL"},
    "FASTING GLUCOSE": {"min": 70, "max": 100, "unit": "mg/dL"},
    "RANDOM GLUCOSE": {"min": 70, "max": 140, "unit": "mg/dL"},
    "HBA1C": {"min": 4.0, "max": 5.6, "unit": "%"},
    "TOTAL CHOLESTEROL": {"min": 0, "max": 200, "unit": "mg/dL"},
    "HDL": {"min": 40, "max": 60, "unit": "mg/dL"},
    "LDL": {"min": 0, "max": 100, "unit": "mg/dL"},
    "TRIGLYCERIDES": {"min": 0, "max": 150, "unit": "mg/dL"},
    "CREATININE": {"min": 0.6, "max": 1.2, "unit": "mg/dL"},
    "UREA": {"min": 7, "max": 20, "unit": "mg/dL"},
    "BILIRUBIN": {"min": 0.1, "max": 1.2, "unit": "mg/dL"},
    "SGOT": {"min": 5, "max": 40, "unit": "U/L"},
    "SGPT": {"min": 7, "max": 56, "unit": "U/L"},
    "ALBUMIN": {"min": 3.5, "max": 5.5, "unit": "g/dL"},
    "CALCIUM": {"min": 8.5, "max": 10.5, "unit": "mg/dL"},
    "SODIUM": {"min": 136, "max": 145, "unit": "mEq/L"},
    "POTASSIUM": {"min": 3.5, "max": 5.0, "unit": "mEq/L"},
    "IRON": {"min": 60, "max": 170, "unit": "mcg/dL"},
    "VITAMIN D": {"min": 30, "max": 100, "unit": "ng/mL"},
    "VITAMIN B12": {"min": 200, "max": 900, "unit": "pg/mL"},
    "TSH": {"min": 0.4, "max": 4.0, "unit": "mIU/L"},
    "ESR": {"min": 0, "max": 20, "unit": "mm/hr"},
    "NEUTROPHILS": {"min": 40, "max": 70, "unit": "%"},
    "LYMPHOCYTES": {"min": 20, "max": 40, "unit": "%"},
    "MONOCYTES": {"min": 2, "max": 8, "unit": "%"},
    "EOSINOPHILS": {"min": 1, "max": 4, "unit": "%"},
    "BASOPHILS": {"min": 0, "max": 1, "unit": "%"},
    "MCV": {"min": 80, "max": 100, "unit": "fL"},
    "MCH": {"min": 27, "max": 33, "unit": "pg"},
    "MCHC": {"min": 32, "max": 36, "unit": "g/dL"},
    "URIC ACID": {"min": 3.5, "max": 7.2, "unit": "mg/dL"},
    "TOTAL PROTEIN": {"min": 6.0, "max": 8.3, "unit": "g/dL"},
    "GLOBULIN": {"min": 2.0, "max": 3.5, "unit": "g/dL"},
    "ALP": {"min": 44, "max": 147, "unit": "U/L"},
    "GGT": {"min": 0, "max": 48, "unit": "U/L"},
    "HCT": {"min": 36, "max": 50, "unit": "%"},
    "PCV": {"min": 36, "max": 50, "unit": "%"},
}


def get_groq_client():
    """Get Groq client with API key from environment."""
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return None
    return Groq(api_key=api_key)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF bytes using pypdf"""
    from pypdf import PdfReader
    import io

    reader = PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text


def extract_parameters_via_llm(raw_text: str) -> list:
    """
    Use Groq LLM to extract medical parameters from raw PDF text.
    This is far more reliable than regex for varied report formats.
    """
    client = get_groq_client()
    if not client:
        return []

    known_params = ", ".join(NORMAL_RANGES.keys())

    prompt = f"""You are a medical report parser. Extract ALL medical test parameters and their numeric values from this blood test report text.

Report text:
---
{raw_text[:4000]}
---

Return ONLY a valid JSON array. Each item must have:
- "parameter": the test name (use standard names like: {known_params})
- "value": the numeric value (number only, no units)

Example output format:
[
  {{"parameter": "HEMOGLOBIN", "value": 14.5}},
  {{"parameter": "WBC", "value": 7500}},
  {{"parameter": "RBC", "value": 4.8}}
]

IMPORTANT RULES:
- Extract EVERY parameter you can find, even if not in my list above
- Use UPPERCASE for parameter names
- value must be a number (float or int), not a string
- If a parameter appears multiple times, use the most recent value
- Do NOT include any text outside the JSON array
- Return an empty array [] if no parameters are found"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a precise medical data extractor. Output only valid JSON arrays. No markdown, no explanation."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.1,
            max_tokens=2048,
            top_p=0.9,
        )

        response_text = completion.choices[0].message.content.strip()

        # Clean up response — extract JSON array
        # Sometimes LLM wraps in ```json ... ```
        if "```" in response_text:
            match = re.search(r'\[.*\]', response_text, re.DOTALL)
            if match:
                response_text = match.group(0)

        # Find the JSON array in the response
        start = response_text.find('[')
        end = response_text.rfind(']')
        if start != -1 and end != -1:
            response_text = response_text[start:end + 1]

        params = json.loads(response_text)

        if not isinstance(params, list):
            return []

        return params

    except Exception as e:
        print(f"LLM extraction error: {e}")
        return []


def compare_with_ranges(extracted_params: list) -> list:
    """
    Compare extracted parameters against known normal ranges.
    Returns structured results with status.
    """
    results = []

    for param in extracted_params:
        name = param.get("parameter", "").upper().strip()
        value = param.get("value")

        if not name or value is None:
            continue

        try:
            value = float(value)
        except (ValueError, TypeError):
            continue

        # Look up normal range
        if name in NORMAL_RANGES:
            normal = NORMAL_RANGES[name]
            if value < normal["min"]:
                status = "Low"
            elif value > normal["max"]:
                status = "High"
            else:
                status = "Normal"

            results.append({
                "parameter": name,
                "value": value,
                "normal_range": f"{normal['min']} - {normal['max']} {normal['unit']}",
                "unit": normal["unit"],
                "status": status,
            })
        else:
            # Parameter not in our known ranges — still include it
            results.append({
                "parameter": name,
                "value": value,
                "normal_range": "N/A",
                "unit": "",
                "status": "Normal",  # Can't determine without range
            })

    return results


def generate_summary(extracted_values: list, raw_text: str) -> str:
    """Send parameter summary to Groq API for a simplified explanation."""
    client = get_groq_client()
    if not client:
        return "⚠️ GROQ_API_KEY not set. Cannot generate AI summary."

    if not extracted_values:
        # Even if no structured data, let's try to explain the raw text
        prompt = f"""You are Rabbit AI, a healthcare information assistant.
A user uploaded a medical report. Here is the raw text from the report:

{raw_text[:3000]}

Please provide:
1. A brief, easy-to-understand summary of what this report contains
2. Highlight any concerning values if visible
3. General recommendations
4. Emphasize this is informational only — consult their doctor

Keep it concise and friendly."""
    else:
        param_lines = []
        for p in extracted_values:
            param_lines.append(f"- {p['parameter']}: {p['value']} {p['unit']} (Normal: {p['normal_range']}) → Status: {p['status']}")

        param_text = "\n".join(param_lines)
        abnormal = [p for p in extracted_values if p["status"] != "Normal"]
        abnormal_text = ""
        if abnormal:
            abnormal_text = "\n\nAbnormal parameters:\n" + "\n".join(
                [f"- {p['parameter']}: {p['value']} {p['unit']} ({p['status']})" for p in abnormal]
            )

        prompt = f"""You are Rabbit AI, a healthcare information assistant.
A user uploaded their blood test report. Here are the extracted parameters:

{param_text}
{abnormal_text}

Please provide:
1. A brief, easy-to-understand summary of the results
2. Highlight any concerning values and what they might indicate
3. General lifestyle recommendations based on the results
4. Always emphasize that this is informational only and they should consult their doctor

Keep the response concise, friendly, and easy to understand for a non-medical person."""

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful healthcare information assistant. Provide clear, safe health information."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=1024,
            top_p=0.9,
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"⚠️ Error generating AI summary: {str(e)}"


def analyze_report(file_bytes: bytes) -> dict:
    """
    Main function: extract PDF text → LLM extracts parameters → compare ranges → get explanation.
    """
    raw_text = extract_text_from_pdf(file_bytes)

    if not raw_text.strip():
        return {
            "extracted_values": [],
            "abnormal_parameters": [],
            "summary": "Could not extract text from the PDF. Please ensure it's a valid, text-based PDF report.",
        }

    # Use LLM to extract parameters (much more reliable than regex)
    llm_params = extract_parameters_via_llm(raw_text)

    # Compare against normal ranges
    extracted_values = compare_with_ranges(llm_params)
    abnormal = [p for p in extracted_values if p["status"] != "Normal"]

    # Generate AI explanation (even if no structured params found, explain raw text)
    summary = generate_summary(extracted_values, raw_text)

    return {
        "extracted_values": extracted_values,
        "abnormal_parameters": abnormal,
        "summary": summary,
    }
