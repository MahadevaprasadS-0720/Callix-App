import time
from typing import Dict, Any

class FraudReportGenerator:
    def __init__(self):
        self.helpline = "1930 (National Cybercrime Portal)"

    def generate_html_report(self, report_data: Dict[str, Any]) -> str:
        """Generates a standalone, beautifully styled HTML forensics report."""
        scan_id = report_data.get("scanId", f"scan_{int(time.time())}")
        file_name = report_data.get("fileName", "Recorded_Audio.wav")
        scam_score = report_data.get("scamScore", 0)
        deepfake_score = report_data.get("deepfakeScore", 0)
        verdict = report_data.get("overallVerdict", "Legitimate / Human")
        category = report_data.get("scamCategory", "SAFE")
        confidence = int(report_data.get("confidence", 0.95) * 100)
        timeline = report_data.get("transcriptTimeline", [])
        highlights = report_data.get("forensicHighlights", [])
        recommendations = report_data.get("safetyRecommendations", [])
        markers = report_data.get("deepfakeMarkers", {})

        # Determine risk styling
        risk_color = "#ef4444" if scam_score >= 75 else "#f59e0b" if scam_score >= 40 else "#10b981"
        badge_bg = "#fef2f2" if scam_score >= 75 else "#fffbeb" if scam_score >= 40 else "#ecfdf5"
        badge_border = "#fca5a5" if scam_score >= 75 else "#fde68a" if scam_score >= 40 else "#a7f3d0"

        timeline_rows = ""
        for item in timeline:
            level = item.get("riskLevel", "safe")
            color = "#dc2626" if level == "danger" else "#d97706" if level == "warning" else "#059669"
            vectors = ", ".join(item.get("detectedVectors", []))
            vectors_html = f"<br><small style='color: {color}; font-weight: 600;'>Vectors: {vectors}</small>" if vectors else ""
            timeline_rows += f"""
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px; color: #64748b; font-family: monospace;">{item.get('time', '00:00')}</td>
                <td style="padding: 10px; font-weight: 600; color: #1e293b;">{item.get('speaker', 'Caller')}</td>
                <td style="padding: 10px; color: #334155;">{item.get('text', '')}{vectors_html}</td>
                <td style="padding: 10px;"><span style="color: {color}; font-weight: bold; text-transform: uppercase;">{level}</span></td>
            </tr>
            """

        highlights_html = "".join([f"<li style='margin-bottom: 8px;'>{h}</li>" for h in highlights])
        recomms_html = "".join([f"<li style='margin-bottom: 8px;'>{r}</li>" for r in recommendations])

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Callix Audio Guardian - Forensic Report ({scan_id})</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            margin: 0;
            padding: 30px;
        }}
        .container {{
            max-width: 900px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            padding: 35px;
            border: 1px solid #e2e8f0;
        }}
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 20px;
            margin-bottom: 25px;
        }}
        .logo-title h1 {{
            margin: 0;
            font-size: 24px;
            color: #1e293b;
            letter-spacing: -0.5px;
        }}
        .logo-title p {{
            margin: 4px 0 0 0;
            font-size: 13px;
            color: #64748b;
        }}
        .verdict-badge {{
            background: {badge_bg};
            border: 1px solid {badge_border};
            color: {risk_color};
            padding: 10px 18px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 16px;
            text-align: right;
        }}
        .grid {{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 30px;
        }}
        .card {{
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
        }}
        .card-val {{
            font-size: 26px;
            font-weight: 800;
            margin: 4px 0;
        }}
        .card-lbl {{
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        h2 {{
            font-size: 16px;
            color: #334155;
            border-left: 4px solid #3b82f6;
            padding-left: 10px;
            margin: 25px 0 15px 0;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            margin-bottom: 25px;
        }}
        th {{
            background: #f1f5f9;
            color: #475569;
            padding: 10px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
        }}
        ul {{
            padding-left: 20px;
            color: #334155;
            font-size: 14px;
            line-height: 1.6;
        }}
        .footer {{
            margin-top: 35px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-title">
                <h1>Audio Guardian Forensic Report</h1>
                <p>AI Scam, Deepfake & Voice Extortion Inspection</p>
            </div>
            <div class="verdict-badge">
                {verdict}<br>
                <small style="font-size: 12px; font-weight: 500;">Confidence: {confidence}%</small>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <div class="card-lbl">Scam Risk Score</div>
                <div class="card-val" style="color: {risk_color};">{scam_score}/100</div>
            </div>
            <div class="card">
                <div class="card-lbl">AI Voice Cloning</div>
                <div class="card-val" style="color: {'#ef4444' if deepfake_score > 60 else '#10b981'};">{deepfake_score}%</div>
            </div>
            <div class="card">
                <div class="card-lbl">Category</div>
                <div class="card-val" style="font-size: 18px; padding-top: 8px; color: #1e293b;">{category}</div>
            </div>
            <div class="card">
                <div class="card-lbl">Acoustic Pitch Stability</div>
                <div class="card-val" style="font-size: 18px; padding-top: 8px; color: #1e293b;">{markers.get('prosodyUnnaturalness', 0)}% Unnatural</div>
            </div>
        </div>

        <h2>Acoustic & Forensic Observations</h2>
        <ul>{highlights_html}</ul>

        <h2>Safety & Counter-Fraud Recommendations</h2>
        <ul>{recomms_html}</ul>

        <h2>Diarized Dialogue Timeline</h2>
        <table>
            <thead>
                <tr>
                    <th style="width: 80px;">Time</th>
                    <th style="width: 140px;">Speaker</th>
                    <th>Spoken Transcript</th>
                    <th style="width: 90px;">Risk</th>
                </tr>
            </thead>
            <tbody>
                {timeline_rows}
            </tbody>
        </table>

        <div class="footer">
            <span>Scan ID: {scan_id} | File: {file_name}</span>
            <span>Emergency Cybercrime Helpline: {self.helpline}</span>
        </div>
    </div>
</body>
</html>"""
        return html

report_generator = FraudReportGenerator()
