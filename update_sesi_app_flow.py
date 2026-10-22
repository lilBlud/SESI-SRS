import os

output_path = r"c:\Users\User\OneDrive\Desktop\SESI SRS\SESI_App_Flow.drawio"

xml_content = """<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2026-10-21T04:35:00.000Z" agent="Antigravity" version="24.0.0" type="device">
  <diagram id="sesi-app-flow" name="1. Process Flow - SESI App Corporate Risk Register">
    <mxGraphModel dx="1200" dy="1400" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="1200" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />

        <!-- ========================================== -->
        <!-- HEADER: LOGO & TITLE BANNER                -->
        <!-- ========================================== -->
        
        <!-- Sabah Electricity Logo banner -->
        <mxCell id="logo_banner" value="&lt;table border=&quot;0&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot;&gt;&lt;tr&gt;&lt;td valign=&quot;middle&quot; style=&quot;padding-right:8px;&quot;&gt;&lt;svg width=&quot;42&quot; height=&quot;32&quot; viewBox=&quot;0 0 100 75&quot;&gt;&lt;path d=&quot;M10 65 L40 18 L58 42 L72 12 L95 65 Z&quot; fill=&quot;#1E8449&quot;/&gt;&lt;path d=&quot;M32 65 L50 38 L65 65 Z&quot; fill=&quot;#1B4F72&quot;/&gt;&lt;/svg&gt;&lt;/td&gt;&lt;td align=&quot;left&quot; valign=&quot;middle&quot;&gt;&lt;b style=&quot;font-size:14px;color:#1B4F72;font-family:Segoe UI,Arial;&quot;&gt;Sabah Electricity&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#5D6D7E;font-family:Segoe UI,Arial;&quot;&gt;Re-energizing Our Future&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;" vertex="1" parent="1">
          <mxGeometry x="40" y="15" width="200" height="42" as="geometry" />
        </mxCell>

        <!-- Title Banner -->
        <mxCell id="title_banner" value="1. Process Flow SESI App — Corporate Risk &amp;amp; Risk Register Data Entry" style="rounded=1;arcSize=25;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.5;fontStyle=1;fontSize=13;fontFamily=Segoe UI, Arial, sans-serif;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="260" y="15" width="620" height="40" as="geometry" />
        </mxCell>

        <!-- ========================================== -->
        <!-- TABLE STRUCTURE: HEADERS & SWIMLANES       -->
        <!-- ========================================== -->

        <!-- Roles Column Header -->
        <mxCell id="header_roles" value="&lt;b&gt;ROLES&lt;/b&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#001F5C;strokeColor=#001F5C;fontColor=#FFFFFF;fontStyle=1;fontSize=12;fontFamily=Segoe UI, Arial, sans-serif;" vertex="1" parent="1">
          <mxGeometry x="40" y="75" width="200" height="35" as="geometry" />
        </mxCell>

        <!-- Process Column Header -->
        <mxCell id="header_process" value="&lt;b&gt;PROCESS (SESI APP WORKFLOW)&lt;/b&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#001F5C;strokeColor=#001F5C;fontColor=#FFFFFF;fontStyle=1;fontSize=12;fontFamily=Segoe UI, Arial, sans-serif;" vertex="1" parent="1">
          <mxGeometry x="240" y="75" width="800" height="35" as="geometry" />
        </mxCell>

        <!-- Frame Lines -->
        <mxCell id="frame_top" value="" style="edgeStyle=none;html=1;endArrow=none;strokeColor=#000000;strokeWidth=1.5;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="40" y="75" as="sourcePoint" /><mxPoint x="1040" y="75" as="targetPoint" /></mxGeometry>
        </mxCell>
        <mxCell id="frame_bottom" value="" style="edgeStyle=none;html=1;endArrow=none;strokeColor=#000000;strokeWidth=1.5;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="40" y="1120" as="sourcePoint" /><mxPoint x="1040" y="1120" as="targetPoint" /></mxGeometry>
        </mxCell>
        <mxCell id="frame_left" value="" style="edgeStyle=none;html=1;endArrow=none;strokeColor=#000000;strokeWidth=1.5;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="40" y="75" as="sourcePoint" /><mxPoint x="40" y="1120" as="targetPoint" /></mxGeometry>
        </mxCell>
        <mxCell id="frame_right" value="" style="edgeStyle=none;html=1;endArrow=none;strokeColor=#000000;strokeWidth=1.5;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="1040" y="75" as="sourcePoint" /><mxPoint x="1040" y="1120" as="targetPoint" /></mxGeometry>
        </mxCell>
        <mxCell id="col_divider" value="" style="edgeStyle=none;html=1;endArrow=none;strokeColor=#000000;strokeWidth=1.5;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="240" y="75" as="sourcePoint" /><mxPoint x="240" y="1120" as="targetPoint" /></mxGeometry>
        </mxCell>
        <mxCell id="row_divider_1" value="" style="edgeStyle=none;html=1;endArrow=none;strokeColor=#000000;strokeWidth=1.5;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="40" y="535" as="sourcePoint" /><mxPoint x="1040" y="535" as="targetPoint" /></mxGeometry>
        </mxCell>
        <mxCell id="row_divider_2" value="" style="edgeStyle=none;html=1;endArrow=none;strokeColor=#000000;strokeWidth=1.5;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="40" y="795" as="sourcePoint" /><mxPoint x="1040" y="795" as="targetPoint" /></mxGeometry>
        </mxCell>

        <!-- ========================================== -->
        <!-- ROLES LABELS                               -->
        <!-- ========================================== -->

        <!-- Role 1: INITIATOR -->
        <mxCell id="role_initiator" value="&lt;div align=&quot;center&quot;&gt;&lt;b&gt;&lt;u&gt;INITIATOR&lt;/u&gt;&lt;/b&gt;&lt;br&gt;&lt;br&gt;&lt;b&gt;1. CORPORATE RISKS -&lt;/b&gt;&lt;br&gt;(Executive CRMU)&lt;br&gt;&lt;br&gt;&lt;b&gt;2. DIVISIONAL RISKS -&lt;/b&gt;&lt;br&gt;(Executive/Engineer/&lt;br&gt;Divisional Risk Coordinator)&lt;br&gt;&lt;br&gt;&lt;font color=&quot;#1B4F72&quot; style=&quot;font-size:9px;&quot;&gt;&lt;b&gt;[SESI Mobile App]&lt;/b&gt;&lt;/font&gt;&lt;/div&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontFamily=Segoe UI, Arial, sans-serif;fontSize=11;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="45" y="195" width="190" height="160" as="geometry" />
        </mxCell>

        <!-- Role 2: VERIFIER -->
        <mxCell id="role_verifier" value="&lt;div align=&quot;center&quot;&gt;&lt;b&gt;&lt;u&gt;VERIFIER&lt;/u&gt;&lt;/b&gt;&lt;br&gt;&lt;br&gt;&lt;b&gt;1. CORPORATE RISKS -&lt;/b&gt;&lt;br&gt;(Senior Manager CRMU)&lt;br&gt;&lt;br&gt;&lt;b&gt;2. DIVISIONAL RISKS -&lt;/b&gt;&lt;br&gt;(Senior Manager/Station Manager)&lt;br&gt;&lt;br&gt;&lt;font color=&quot;#1B4F72&quot; style=&quot;font-size:9px;&quot;&gt;&lt;b&gt;[SESI App Verifier Portal]&lt;/b&gt;&lt;/font&gt;&lt;/div&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontFamily=Segoe UI, Arial, sans-serif;fontSize=11;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="45" y="595" width="190" height="140" as="geometry" />
        </mxCell>

        <!-- Role 3: APPROVER -->
        <mxCell id="role_approver" value="&lt;div align=&quot;center&quot;&gt;&lt;b&gt;&lt;u&gt;APPROVER&lt;/u&gt;&lt;/b&gt;&lt;br&gt;&lt;br&gt;&lt;b&gt;1. CORPORATE RISKS -&lt;/b&gt;&lt;br&gt;(CSSO)&lt;br&gt;&lt;br&gt;&lt;b&gt;2. DIVISIONAL RISKS -&lt;/b&gt;&lt;br&gt;(Head/General)&lt;br&gt;&lt;br&gt;&lt;font color=&quot;#1B4F72&quot; style=&quot;font-size:9px;&quot;&gt;&lt;b&gt;[SESI App Approval Portal]&lt;/b&gt;&lt;/font&gt;&lt;/div&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;fontFamily=Segoe UI, Arial, sans-serif;fontSize=11;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="45" y="860" width="190" height="140" as="geometry" />
        </mxCell>

        <!-- ========================================== -->
        <!-- SWIMLANE 1: INITIATOR PROCESS SHAPES       -->
        <!-- ========================================== -->

        <!-- (1) START: Launch SESI App -->
        <mxCell id="node_start" value="(1)&lt;br&gt;&lt;b&gt;START&lt;/b&gt;&lt;br&gt;&lt;font style=&quot;font-size:8px;&quot; color=&quot;#555555&quot;&gt;(SESI App)&lt;/font&gt;" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.2;fontFamily=Segoe UI, Arial, sans-serif;fontSize=10;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="605" y="115" width="95" height="45" as="geometry" />
        </mxCell>

        <!-- (2) New/Revision -->
        <mxCell id="node_new_rev" value="&lt;b&gt;(2)&lt;/b&gt;&lt;br&gt;New/&lt;br&gt;Revision" style="rhombus;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.2;fontFamily=Segoe UI, Arial, sans-serif;fontSize=11;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="580" y="180" width="145" height="70" as="geometry" />
        </mxCell>

        <!-- (3) Select Related Registered Risk -->
        <mxCell id="node_select_risk" value="&lt;b&gt;(3)&lt;/b&gt;&lt;br&gt;Select Related&lt;br&gt;Registered Risk&lt;br&gt;&lt;font style=&quot;font-size:8px;&quot; color=&quot;#1B4F72&quot;&gt;(SESI Risk Register)&lt;/font&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.2;fontFamily=Segoe UI, Arial, sans-serif;fontSize=10;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="780" y="120" width="145" height="52" as="geometry" />
        </mxCell>

        <!-- (3)(b)(i) Data Entry -->
        <mxCell id="node_data_entry_3bi" value="&lt;b&gt;(3)(b)(i)&lt;/b&gt;&lt;br&gt;Data Entry&lt;br&gt;&lt;font style=&quot;font-size:8px;&quot; color=&quot;#1B4F72&quot;&gt;(Edit in SESI App)&lt;/font&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.2;fontFamily=Segoe UI, Arial, sans-serif;fontSize=10;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="795" y="195" width="115" height="44" as="geometry" />
        </mxCell>

        <!-- (3)(b)(ii) Any Changes to critical item? -->
        <mxCell id="node_changes_critical" value="&lt;b&gt;(3)(b)(ii)&lt;/b&gt;&lt;br&gt;Any Changes to&lt;br&gt;critical item?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.2;fontFamily=Segoe UI, Arial, sans-serif;fontSize=10;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="760" y="260" width="185" height="70" as="geometry" />
        </mxCell>

        <!-- (3)(a)(i) Data Entry -->
        <mxCell id="node_data_entry_3ai" value="&lt;b&gt;(3)(a)(i)&lt;/b&gt;&lt;br&gt;Data Entry&lt;br&gt;&lt;font style=&quot;font-size:8px;&quot; color=&quot;#1B4F72&quot;&gt;(New Form in SESI)&lt;/font&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.2;fontFamily=Segoe UI, Arial, sans-serif;fontSize=10;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="405" y="193" width="110" height="44" as="geometry" />
        </mxCell>

        <!-- (4)(a) Submit -->
        <mxCell id="node_submit_4a" value="&lt;b&gt;(4)(a)&lt;/b&gt;&lt;br&gt;Submit&lt;br&gt;&lt;font style=&quot;font-size:8px;&quot; color=&quot;#1B4F72&quot;&gt;(To Verifier Queue)&lt;/font&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.2;fontFamily=Segoe UI, Arial, sans-serif;fontSize=10;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="405" y="273" width="110" height="44" as="geometry" />
        </mxCell>

        <!-- Critical Item Callout Box -->
        <mxCell id="box_critical_item" value="&lt;div align=&quot;left&quot;&gt;&lt;b&gt;&lt;u&gt;Critical Item:&lt;/u&gt;&lt;/b&gt;&lt;br&gt;&lt;br&gt;1. Risk Rating&lt;br&gt;2. Risk Parameter&lt;/div&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#D5D8DC;strokeColor=#BDC3C7;strokeWidth=1;fontFamily=Segoe UI, Arial, sans-serif;fontSize=10;fontColor=#000000;spacingLeft=8;spacingTop=4;" vertex="1" parent="1">
          <mxGeometry x="635" y="325" width="120" height="60" as="geometry" />
        </mxCell>

        <!-- (4)(b) Submit -->
        <mxCell id="node_submit_4b" value="&lt;b&gt;(4)(b)&lt;/b&gt;&lt;br&gt;Submit&lt;br&gt;&lt;font style=&quot;font-size:8px;&quot; color=&quot;#2E7D32&quot;&gt;(Direct DB Save)&lt;/font&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.2;fontFamily=Segoe UI, Arial, sans-serif;fontSize=10;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="797" y="355" width="110" height="44" as="geometry" />
        </mxCell>

        <!-- Reject Box -->
        <mxCell id="node_reject" value="Reject" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FADBD8;strokeColor=#78281F;strokeWidth=1.2;fontFamily=Segoe UI, Arial, sans-serif;fontSize=11;fontStyle=1;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="275" y="470" width="75" height="32" as="geometry" />
        </mxCell>

        <!-- ========================================== -->
        <!-- SWIMLANE 2: VERIFIER PROCESS SHAPES        -->
        <!-- ========================================== -->

        <!-- (5) Checking & Verify. Any comment? -->
        <mxCell id="node_check_verify_5" value="&lt;b&gt;(5)&lt;/b&gt;&lt;br&gt;Checking &amp;amp; Verify.&lt;br&gt;Any comment?&lt;br&gt;&lt;font style=&quot;font-size:8px;&quot; color=&quot;#1B4F72&quot;&gt;(SESI Verifier Portal)&lt;/font&gt;" style="rhombus;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.2;fontFamily=Segoe UI, Arial, sans-serif;fontSize=10;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="382" y="620" width="155" height="85" as="geometry" />
        </mxCell>

        <!-- ========================================== -->
        <!-- SWIMLANE 3: APPROVER PROCESS SHAPES        -->
        <!-- ========================================== -->

        <!-- (6) Checking & Approve. Any comment? -->
        <mxCell id="node_check_approve_6" value="&lt;b&gt;(6)&lt;/b&gt;&lt;br&gt;Checking &amp;amp; Approve.&lt;br&gt;Any comment?&lt;br&gt;&lt;font style=&quot;font-size:8px;&quot; color=&quot;#1B4F72&quot;&gt;(SESI Approval Portal)&lt;/font&gt;" style="rhombus;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.2;fontFamily=Segoe UI, Arial, sans-serif;fontSize=10;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="382" y="875" width="155" height="85" as="geometry" />
        </mxCell>

        <!-- Approve & Submit -->
        <mxCell id="node_approve_submit" value="&lt;b&gt;Approve &amp;amp; Submit&lt;/b&gt;&lt;br&gt;&lt;font style=&quot;font-size:8px;&quot; color=&quot;#2E7D32&quot;&gt;(Digital Sign-off in SESI)&lt;/font&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.2;fontFamily=Segoe UI, Arial, sans-serif;fontSize=10;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="390" y="1000" width="140" height="46" as="geometry" />
        </mxCell>

        <!-- FINISH Oval -->
        <mxCell id="node_finish" value="&lt;b&gt;FINISH&lt;/b&gt;" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.2;fontFamily=Segoe UI, Arial, sans-serif;fontSize=11;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="800" y="1005" width="105" height="35" as="geometry" />
        </mxCell>

        <!-- Data Captured & Stored In SESI Database (Risk Mitigation Monthly Update) -->
        <mxCell id="box_data_captured" value="&lt;b&gt;Data Captured &amp;amp; Stored&lt;/b&gt;&lt;br&gt;in SESI Database (Supabase)&lt;br&gt;&lt;i&gt;Risk Mitigation Monthly Update&lt;/i&gt;" style="rounded=0;whiteSpace=wrap;html=1;dashed=1;dashPattern=4 2;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.2;fontFamily=Segoe UI, Arial, sans-serif;fontSize=9;fontStyle=0;fontColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="765" y="1050" width="175" height="52" as="geometry" />
        </mxCell>

        <!-- ========================================== -->
        <!-- CONNECTORS / FLOW EDGES                    -->
        <!-- ========================================== -->

        <!-- (1) START -> (2) New/Revision -->
        <mxCell id="edge_start_to_newrev" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=1.2;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="node_start" target="node_new_rev">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- (2) New/Revision -> (3)(a)(i) Data Entry [Label: New] -->
        <mxCell id="edge_newrev_to_3ai" value="&lt;font color=&quot;#000000&quot;&gt;New&lt;/font&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=1.2;exitX=0;exitY=0.5;entryX=1;entryY=0.5;verticalAlign=bottom;fontSize=10;" edge="1" parent="1" source="node_new_rev" target="node_data_entry_3ai">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- (2) New/Revision -> (3) Select Related Registered Risk [Label: Revision] -->
        <mxCell id="edge_newrev_to_select_risk" value="&lt;font color=&quot;#000000&quot;&gt;Revision&lt;/font&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=1.2;exitX=1;exitY=0.5;entryX=0;entryY=0.5;verticalAlign=bottom;fontSize=10;" edge="1" parent="1" source="node_new_rev" target="node_select_risk">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="755" y="215" />
              <mxPoint x="755" y="146" />
            </Array>
          </mxGeometry>
        </mxCell>

        <!-- (3) Select Related Registered Risk -> (3)(b)(i) Data Entry -->
        <mxCell id="edge_select_to_3bi" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=1.2;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="node_select_risk" target="node_data_entry_3bi">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- (3)(b)(i) Data Entry -> (3)(b)(ii) Any Changes to critical item? -->
        <mxCell id="edge_3bi_to_3bii" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=1.2;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="node_data_entry_3bi" target="node_changes_critical">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- (3)(b)(ii) Any Changes -> (4)(a) Submit [Label: Yes (Red)] -->
        <mxCell id="edge_3bii_to_4a_yes" value="&lt;b&gt;&lt;font color=&quot;#C00000&quot;&gt;Yes&lt;/font&gt;&lt;/b&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#C00000;strokeWidth=1.5;exitX=0;exitY=0.5;entryX=1;entryY=0.5;verticalAlign=bottom;fontSize=10;" edge="1" parent="1" source="node_changes_critical" target="node_submit_4a">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- (3)(b)(ii) Any Changes -> (4)(b) Submit [Label: No (Red)] -->
        <mxCell id="edge_3bii_to_4b_no" value="&lt;b&gt;&lt;font color=&quot;#C00000&quot;&gt;No&lt;/font&gt;&lt;/b&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=1.2;exitX=0.5;exitY=1;entryX=0.5;entryY=0;align=left;fontSize=10;" edge="1" parent="1" source="node_changes_critical" target="node_submit_4b">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- (3)(a)(i) Data Entry -> (4)(a) Submit -->
        <mxCell id="edge_3ai_to_4a" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=1.2;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="node_data_entry_3ai" target="node_submit_4a">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- (4)(a) Submit -> (5) Checking & Verify. Any comment? -->
        <mxCell id="edge_4a_to_5" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=1.2;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="node_submit_4a" target="node_check_verify_5">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- (5) Checking & Verify -> (6) Checking & Approve [Label: No (Red)] -->
        <mxCell id="edge_5_to_6_no" value="&lt;b&gt;&lt;font color=&quot;#C00000&quot;&gt;No&lt;/font&gt;&lt;/b&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=1.2;exitX=0.5;exitY=1;entryX=0.5;entryY=0;align=left;fontSize=10;" edge="1" parent="1" source="node_check_verify_5" target="node_check_approve_6">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- (6) Checking & Approve -> Approve & Submit [Label: No (Red)] -->
        <mxCell id="edge_6_to_approve_no" value="&lt;b&gt;&lt;font color=&quot;#C00000&quot;&gt;No&lt;/font&gt;&lt;/b&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;strokeWidth=1.2;exitX=0.5;exitY=1;entryX=0.5;entryY=0;align=left;fontSize=10;" edge="1" parent="1" source="node_check_approve_6" target="node_approve_submit">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- Approve & Submit -> FINISH [Dashed Blue Arrow] -->
        <mxCell id="edge_approve_to_finish" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;dashPattern=6 4;strokeColor=#418AB3;strokeWidth=1.5;exitX=1;exitY=0.5;entryX=0;entryY=0.5;" edge="1" parent="1" source="node_approve_submit" target="node_finish">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- (4)(b) Submit -> FINISH [Long Dashed Blue Arrow] -->
        <mxCell id="edge_4b_to_finish" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;dashPattern=6 4;strokeColor=#418AB3;strokeWidth=1.5;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="node_submit_4b" target="node_finish">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- ========================================== -->
        <!-- REJECTION FLOW (RED)                       -->
        <!-- ========================================== -->

        <!-- (6) Checking & Approve [Yes branch to vertical line] -->
        <mxCell id="edge_reject_from_6" value="&lt;b&gt;&lt;font color=&quot;#C00000&quot;&gt;Yes&lt;/font&gt;&lt;/b&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#C00000;strokeWidth=1.5;endArrow=none;exitX=0;exitY=0.5;verticalAlign=bottom;fontSize=10;" edge="1" parent="1" source="node_check_approve_6">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="312" y="917" as="targetPoint" />
          </mxGeometry>
        </mxCell>

        <!-- (5) Checking & Verify [Yes branch to vertical line] -->
        <mxCell id="edge_reject_from_5" value="&lt;b&gt;&lt;font color=&quot;#C00000&quot;&gt;Yes&lt;/font&gt;&lt;/b&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#C00000;strokeWidth=1.5;endArrow=none;exitX=0;exitY=0.5;verticalAlign=bottom;fontSize=10;" edge="1" parent="1" source="node_check_verify_5">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="312" y="662" as="targetPoint" />
          </mxGeometry>
        </mxCell>

        <!-- Lower vertical red line going up into Reject box bottom -->
        <mxCell id="edge_reject_up_to_box" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#C00000;strokeWidth=1.5;entryX=0.5;entryY=1;" edge="1" parent="1" target="node_reject">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="312" y="917" as="sourcePoint" />
          </mxGeometry>
        </mxCell>

        <!-- Upper vertical red line from Reject box top into (3)(a)(i) Data Entry left side -->
        <mxCell id="edge_reject_box_to_3ai" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#C00000;strokeWidth=1.5;exitX=0.5;exitY=0;entryX=0;entryY=0.5;" edge="1" parent="1" source="node_reject" target="node_data_entry_3ai">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="312" y="215" />
            </Array>
          </mxGeometry>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
"""

with open(output_path, "w", encoding="utf-8") as f:
    f.write(xml_content.strip())

print(f"Successfully updated {output_path} to match the image layout!")
