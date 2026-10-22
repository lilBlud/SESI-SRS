import json
import html

with open(r"c:\Users\User\OneDrive\Desktop\SESI SRS\SESI_App_Flow.drawio", "r", encoding="utf-8") as f:
    xml_content = f.read()

config = {
    "highlight": "#012060",
    "nav": True,
    "resize": True,
    "toolbar": "zoom layers tags pages",
    "xml": xml_content
}

json_str = json.dumps(config)
escaped_json = html.escape(json_str, quote=True)

html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SESI SRS App Process Flow — Preview &amp; Export</title>
  <script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>
  <style>
    body {{
      margin: 0;
      padding: 24px;
      background: #0b1120;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }}
    .header {{
      max-width: 1140px;
      width: 100%;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }}
    .title-group {{
      display: flex;
      flex-direction: column;
    }}
    .title {{
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .subtitle {{
      font-size: 13px;
      color: #94a3b8;
      margin-top: 4px;
    }}
    .badge {{
      display: inline-block;
      padding: 3px 8px;
      background: #012060;
      color: #ffffff;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      border: 1px solid #1e3a8a;
    }}
    .actions {{
      display: flex;
      gap: 10px;
    }}
    .btn {{
      background: #1e293b;
      color: #38bdf8;
      border: 1px solid #334155;
      padding: 9px 18px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }}
    .btn:hover {{
      background: #334155;
      color: #7dd3fc;
    }}
    .btn-primary {{
      background: #0284c7;
      color: #ffffff;
      border-color: #0369a1;
    }}
    .btn-primary:hover {{
      background: #0369a1;
      color: #ffffff;
    }}
    .diagram-container {{
      width: 100%;
      max-width: 1140px;
      background: #ffffff;
      border-radius: 12px;
      overflow: auto;
      box-shadow: 0 20px 30px -10px rgba(0,0,0,0.6);
      padding: 16px;
    }}
    .toast {{
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #059669;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.4);
      display: none;
      z-index: 1000;
    }}
  </style>
</head>
<body>
  <div class="header">
    <div class="title-group">
      <div class="title">
        ⚡ SESI SRS App — Process Flow Diagram
        <span class="badge">#012060 Navy Corporate Header</span>
      </div>
      <div class="subtitle">
        Active Directory SSO • Quiz to Real-Time Dashboard • Open Dictionary &amp; PDF Export
      </div>
    </div>
    <div class="actions">
      <button class="btn" onclick="copyXml()">📋 Copy XML</button>
      <a class="btn btn-primary" href="https://app.diagrams.net" target="_blank">🌐 Open in Diagrams.net</a>
    </div>
  </div>

  <div class="diagram-container">
    <div class="mxgraph" style="max-width:100%;min-height:1200px;" data-mxgraph="{escaped_json}"></div>
  </div>

  <div id="toast" class="toast">✅ XML copied to clipboard! Paste into Draw.io (Ctrl+V)</div>

  <script>
    const rawXml = {json.dumps(xml_content)};
    function copyXml() {{
      navigator.clipboard.writeText(rawXml).then(() => {{
        const toast = document.getElementById('toast');
        toast.style.display = 'block';
        setTimeout(() => {{ toast.style.display = 'none'; }}, 3000);
      }}).catch(err => {{
        alert('Could not copy automatically. You can open SESI_App_Flow.drawio directly in VS Code or Draw.io');
      }});
    }}
  </script>
</body>
</html>
"""

output_html = r"c:\Users\User\OneDrive\Desktop\SESI SRS\SESI_App_Flow_Viewer.html"
with open(output_html, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Created refreshed HTML preview at: {output_html}")
