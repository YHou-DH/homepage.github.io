/* maon_widget.js — MAon SQL Explorer widget.
 * Static file: never edit directly.
 * Requires maon_data.js to be loaded first (sets window.MAON_DATA).
 *
 * Usage in any HTML page:
 *   <script src="maon_data.js"></script>
 *   <script src="maon_widget.js"></script>
 *   <button onclick="MAonSQL.open()">Open explorer</button>
 */
document.addEventListener("DOMContentLoaded", function() {
  // Inject CSS
  var _s = document.createElement('style');
  _s.id = 'maon-sql-style';
  _s.textContent = `#maon-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9000;align-items:center;justify-content:center}
#maon-overlay.open{display:flex}
#maon-panel{background:#fff;border:1px solid #999;width:min(92vw,1020px);height:min(88vh,700px);display:flex;flex-direction:column;font-family:inherit;font-size:13px;color:#000;box-shadow:0 4px 20px rgba(0,0,0,.25)}
#maon-titlebar{background:#eee;border-bottom:1px solid #999;padding:6px 12px;display:flex;align-items:center;gap:10px;flex-shrink:0}
#maon-titlebar strong{font-size:13px}
#maon-titlebar .maon-iri{font-family:monospace;font-size:11px;color:#555}
#maon-close{margin-left:auto;background:none;border:1px solid #aaa;cursor:pointer;font-size:13px;padding:2px 9px;color:#333;line-height:1.4}
#maon-close:hover{background:#ddd}
#maon-tabs{display:flex;border-bottom:1px solid #ccc;background:#f5f5f5;flex-shrink:0}
.maon-tab{padding:5px 14px;font-size:12px;cursor:pointer;border:none;border-right:1px solid #ccc;background:none;color:#444;font-family:inherit}
.maon-tab:hover{background:#eaeaea}
.maon-tab.active{background:#fff;border-bottom:2px solid #000;color:#000;font-weight:bold}
.maon-view{display:none;flex:1;overflow:hidden;flex-direction:column}
.maon-view.active{display:flex}
#maon-editor-area{border-bottom:1px solid #ccc;padding:8px 10px 7px;background:#fafafa;flex-shrink:0}
#maon-sql-input{width:100%;font-family:monospace;font-size:13px;border:1px solid #bbb;padding:5px 7px;resize:vertical;min-height:80px;background:#fff;color:#000;outline:none;line-height:1.5;box-sizing:border-box}
#maon-sql-input:focus{border-color:#555}
#maon-editor-actions{display:flex;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap}
#maon-editor-actions button{font-family:inherit;font-size:12px;padding:3px 12px;cursor:pointer;border:1px solid #999;background:#f0f0f0;color:#000}
#maon-editor-actions button:hover{background:#e0e0e0}
.maon-hint{font-size:11px;color:#777;margin-left:auto}
.maon-hint kbd{border:1px solid #bbb;padding:0 4px;font-size:10px;background:#f5f5f5}
#maon-results{flex:1;overflow:auto;padding:8px 10px}
.maon-results-meta{font-size:11px;color:#555;margin-bottom:6px}
.maon-error{font-family:monospace;font-size:12px;color:#900;background:#fff5f5;border:1px solid #f00;padding:7px 10px}
.maon-table-wrap{overflow-x:auto}
.maon-table{border-collapse:collapse;font-size:12px;min-width:100%}
.maon-table th{border:1px solid #ccc;padding:4px 9px;text-align:left;background:#f0f0f0;white-space:nowrap;font-size:11px;text-transform:uppercase;letter-spacing:.04em}
.maon-table td{border:1px solid #ddd;padding:3px 9px;vertical-align:top;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.maon-table tr:nth-child(even) td{background:#fafafa}
.maon-table tr:hover td{background:#f0f0f0}
.maon-null{color:#aaa;font-style:italic}
.maon-tag{display:inline-block;border:1px solid #aaa;padding:0 5px;font-size:10px;margin:1px;cursor:pointer;background:#f5f5f5}
.maon-tag:hover{background:#ddd}
.maon-zh{font-family:"Noto Sans TC","MS JhengHei","PingFang TC",sans-serif}
#maon-templates-inner{padding:10px;overflow-y:auto;flex:1}
#maon-templates-inner h4{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#555;margin:14px 0 6px;border-bottom:1px solid #ddd;padding-bottom:3px}
#maon-templates-inner h4:first-child{margin-top:0}
.maon-tpl-btn{display:block;width:100%;text-align:left;padding:4px 8px;font-family:inherit;font-size:12px;background:none;border:none;cursor:pointer;color:#000;border-bottom:1px solid #eee}
.maon-tpl-btn:hover{background:#f0f0f0}
.maon-tpl-btn::before{content:"▶  ";font-size:9px;color:#888}
#maon-schema-inner{padding:10px;overflow-y:auto;flex:1;font-size:12px}
#maon-schema-inner h3{font-size:13px;margin:16px 0 6px;border-bottom:1px solid #ccc;padding-bottom:3px}
#maon-schema-inner h3:first-child{margin-top:0}
.maon-schema-table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:6px}
.maon-schema-table th{background:#f0f0f0;border:1px solid #ddd;padding:3px 8px;text-align:left;white-space:nowrap;font-weight:bold}
.maon-schema-table td{border:1px solid #ddd;padding:3px 8px;vertical-align:top}
.maon-schema-table td:first-child{font-family:monospace;white-space:nowrap}
.maon-schema-table td:nth-child(2){font-family:monospace;color:#555;white-space:nowrap}
#maon-help-inner{padding:14px 16px;overflow-y:auto;flex:1;font-size:13px;line-height:1.6}
#maon-help-inner h3{font-size:13px;font-weight:bold;margin:18px 0 6px;border-bottom:1px solid #ddd;padding-bottom:3px}
#maon-help-inner h3:first-child{margin-top:0}
#maon-help-inner p{margin:0 0 8px}
#maon-help-inner code{font-family:monospace;font-size:12px;background:#f0f0f0;padding:1px 4px}
#maon-help-inner pre{font-family:monospace;font-size:12px;background:#f5f5f5;border:1px solid #ddd;padding:8px 10px;margin:6px 0 10px;overflow-x:auto;line-height:1.5}
#maon-help-inner table{border-collapse:collapse;font-size:12px;margin-bottom:10px;width:100%}
#maon-help-inner table th{background:#f0f0f0;border:1px solid #ddd;padding:3px 8px;text-align:left}
#maon-help-inner table td{border:1px solid #ddd;padding:3px 8px;vertical-align:top}
#maon-help-inner table td:first-child{font-family:monospace;white-space:nowrap}
#maon-statusbar{border-top:1px solid #ccc;background:#f5f5f5;padding:3px 10px;font-size:11px;color:#666;flex-shrink:0;display:flex;gap:16px}`;
  document.head.appendChild(_s);

  // Inject overlay HTML
  var _t = document.createElement('div');
  _t.innerHTML = `<div id="maon-overlay" role="dialog" aria-modal="true" aria-label="MAon SQL Explorer">
  <div id="maon-panel">
    <div id="maon-titlebar">
      <strong>MAon SQL Explorer</strong>
      <span class="maon-iri">mao: https://purl.org/maont/ontology/</span>
      <button id="maon-close" onclick="MAonSQL.close()" title="Close (Esc)">&#x2715; Close</button>
    </div>
    <div id="maon-tabs">
      <button class="maon-tab active" onclick="MAonSQL.tab('query')">SQL Query</button>
      <button class="maon-tab" onclick="MAonSQL.tab('templates')">Templates</button>
      <button class="maon-tab" onclick="MAonSQL.tab('schema')">Schema</button>
      <button class="maon-tab" onclick="MAonSQL.tab('help')">Help</button>
    </div>
    <div class="maon-view active" id="maon-view-query">
      <div id="maon-editor-area">
        <textarea id="maon-sql-input" spellcheck="false">SELECT id, name_en, name_zh, primary_class, name_romanCAN
FROM individuals
WHERE used_in LIKE '%Hung_Kuen%'
ORDER BY primary_class, name_en
LIMIT 30;</textarea>
        <div id="maon-editor-actions">
          <button onclick="MAonSQL.run()">&#9654; Run</button>
          <button onclick="document.getElementById('maon-sql-input').value=''">Clear</button>
          <span class="maon-hint"><kbd>Ctrl</kbd>+<kbd>Enter</kbd> to run</span>
        </div>
      </div>
      <div id="maon-results">
        <div style="color:#888;font-size:12px;padding:10px 0">
          Run a query above. Tables: <code>individuals</code> &middot; <code>classes</code> &middot; <code>object_properties</code> &middot; <code>relations</code>
        </div>
      </div>
    </div>
    <div class="maon-view" id="maon-view-templates">
      <div id="maon-templates-inner"></div>
    </div>
    <div class="maon-view" id="maon-schema-inner-view">
      <div id="maon-schema-inner"></div>
    </div>
    <div class="maon-view" id="maon-view-help">
      <div id="maon-help-inner"></div>
    </div>
    <div id="maon-statusbar">
      <span id="maon-stat-ind">individuals: &#8212;</span>
      <span id="maon-stat-cls">classes: &#8212;</span>
      <span id="maon-stat-prop">properties: &#8212;</span>
      <span id="maon-stat-rel">relations: &#8212;</span>
    </div>
  </div>
</div>`;
  document.body.appendChild(_t.firstElementChild);

  // Widget logic
(function(){
if(!window.MAON_DATA){console.error("maon_widget.js: load maon_data.js before maon_widget.js");return;}
  const _RAW=window.MAON_DATA;
const TABLES={individuals:_RAW.individuals,classes:_RAW.classes,object_properties:_RAW.object_properties,annotation_properties:[],relations:_RAW.relations};
function init(){
  document.getElementById('maon-stat-ind').textContent='individuals: '+TABLES.individuals.length;
  document.getElementById('maon-stat-cls').textContent='classes: '+TABLES.classes.length;
  document.getElementById('maon-stat-prop').textContent='properties: '+TABLES.object_properties.length;
  document.getElementById('maon-stat-rel').textContent='relations: '+TABLES.relations.length;
  buildTemplates();buildSchema();buildHelp();
}
const TEMPLATES={
  "By style": [
    ["Hung Kuen — all techniques",         "SELECT id, name_en, name_zh, primary_class, name_romanCAN\nFROM individuals\nWHERE used_in LIKE '%Hung_Kuen%'\nORDER BY primary_class, name_en\nLIMIT 60;"],
    ["Choy Li Fut — all techniques",       "SELECT id, name_en, name_zh, primary_class, name_romanCAN\nFROM individuals\nWHERE used_in LIKE '%Choy_Li_Fut%'\nORDER BY primary_class, name_en\nLIMIT 60;"],
    ["White Crane — all techniques",       "SELECT id, name_en, name_zh, primary_class, name_romanCAN\nFROM individuals\nWHERE used_in LIKE '%White_Crane_Kungfu%'\nORDER BY primary_class, name_en\nLIMIT 60;"],
    ["Shared: Hung Kuen + Choy Li Fut",    "SELECT id, name_en, name_zh, used_in\nFROM individuals\nWHERE used_in LIKE '%Hung_Kuen%'\n  AND used_in LIKE '%Choy_Li_Fut%'\nORDER BY name_en;"],
    ["Shared: all three styles",           "SELECT id, name_en, name_zh, used_in\nFROM individuals\nWHERE used_in LIKE '%Hung_Kuen%'\n  AND used_in LIKE '%Choy_Li_Fut%'\n  AND used_in LIKE '%White_Crane_Kungfu%'\nORDER BY name_en;"]
  ],
  "By technique class": [
    ["Palm techniques",    "SELECT id, name_en, name_zh, name_romanCAN, name_romanMAN, used_in\nFROM individuals\nWHERE primary_class = 'palm_tech'\nORDER BY name_en;"],
    ["Fist techniques",    "SELECT id, name_en, name_zh, name_romanCAN, name_romanMAN, used_in\nFROM individuals\nWHERE primary_class = 'fist_tech'\nORDER BY name_en;"],
    ["Leg techniques",     "SELECT id, name_en, name_zh, name_romanCAN, name_romanMAN, used_in\nFROM individuals\nWHERE primary_class = 'leg_tech'\nORDER BY name_en;"],
    ["Stances",            "SELECT id, name_en, name_zh, name_romanCAN, name_romanMAN, used_in\nFROM individuals\nWHERE primary_class = 'stance'\nORDER BY name_en;"],
    ["Gestures",           "SELECT id, name_en, name_zh, name_romanCAN, employs\nFROM individuals\nWHERE primary_class = 'gesture'\nORDER BY name_en;"],
    ["Bridge techniques",  "SELECT id, name_en, name_zh, name_romanCAN, used_in\nFROM individuals\nWHERE primary_class = 'bridge_tech'\nORDER BY name_en;"],
    ["Combo techniques",   "SELECT id, name_en, name_zh, name_romanCAN, employs\nFROM individuals\nWHERE primary_class = 'combo_tech'\nORDER BY name_en;"],
    ["Bodywork",           "SELECT id, name_en, name_zh, name_romanCAN, used_in\nFROM individuals\nWHERE primary_class = 'bodywork'\nORDER BY name_en;"]
  ],
  "Systems & masters": [
    ["All styles and systems", "SELECT id, name_en, name_zh, primary_class, belongs_to\nFROM individuals\nWHERE primary_class = 'MA_style'\n   OR primary_class = 'MA_system'\nORDER BY primary_class, name_en;"],
    ["Masters",               "SELECT id, name_en, name_zh, teaches, has_principle\nFROM individuals\nWHERE primary_class = 'MA_Master'\nORDER BY name_en;"],
    ["Principles",            "SELECT id, name_en, name_zh, belongs_to\nFROM individuals\nWHERE primary_class LIKE '%principle%'\nORDER BY primary_class, name_en;"]
  ],
  "Name & language": [
    ["With Chinese name",           "SELECT id, name_en, name_zh, name_romanCAN, name_romanMAN, primary_class\nFROM individuals\nWHERE name_zh IS NOT NULL\nORDER BY primary_class, name_en\nLIMIT 60;"],
    ["With Cantonese romanisation", "SELECT id, name_en, name_zh, name_romanCAN, primary_class\nFROM individuals\nWHERE name_romanCAN IS NOT NULL\nORDER BY name_romanCAN\nLIMIT 60;"],
    ["With alternate names",        "SELECT id, name_en, name_zh, other_name_en, other_name_zh\nFROM individuals\nWHERE other_name_en IS NOT NULL\n   OR other_name_zh IS NOT NULL\nORDER BY name_en\nLIMIT 60;"]
  ],
  "Ontology schema": [
    ["All classes",              "SELECT id, label, parent_class, comment\nFROM classes\nORDER BY id;"],
    ["Top-level classes",        "SELECT id, label, comment\nFROM classes\nWHERE parent_class IS NULL\nORDER BY id;"],
    ["All object properties",    "SELECT id, label, domain, range_cls, comment\nFROM object_properties\nORDER BY id;"]
  ],
  "Graph (relations)": [
    ["Relations FROM individual",    "SELECT subject, predicate, object\nFROM relations\nWHERE subject = 'Hung_Kuen'\nORDER BY predicate;"],
    ["Relations TO individual",      "SELECT subject, predicate, object\nFROM relations\nWHERE object = 'Hung_Kuen'\nORDER BY predicate, subject\nLIMIT 40;"],
    ["Similar-to pairs",             "SELECT subject, object\nFROM relations\nWHERE predicate = 'similar_to'\nORDER BY subject;"],
    ["Employs graph",                "SELECT subject, object\nFROM relations\nWHERE predicate = 'employs'\nORDER BY subject\nLIMIT 40;"]
  ],
  "Annotations": [
    ["With archivist notes", "SELECT id, name_en, name_zh, archivist_note\nFROM individuals\nWHERE archivist_note IS NOT NULL\nORDER BY id;"],
    ["With origin stories",  "SELECT id, name_en, name_zh, origin_story\nFROM individuals\nWHERE origin_story IS NOT NULL\nORDER BY id;"],
    ["With descriptions",    "SELECT id, name_en, name_zh, description\nFROM individuals\nWHERE description IS NOT NULL\nORDER BY id;"]
  ]};
function buildTemplates(){
  const c=document.getElementById('maon-templates-inner');
  let h='';
  for(const[group,items]of Object.entries(TEMPLATES)){
    h+=`<h4>${group}</h4>`;
    items.forEach(([label,sql])=>{h+=`<button class="maon-tpl-btn" onclick="MAonSQL.applyTpl(${JSON.stringify(sql)})">${label}</button>`;});
  }
  c.innerHTML=h;
}
const SCHEMA={individuals:{desc:"Named OWL individuals.",cols:[["id","TEXT PK","Local URI name"],["label","TEXT","rdfs:label"],["comment","TEXT","rdfs:comment"],["name_en","TEXT","English name"],["name_zh","TEXT","Chinese name"],["name_romanCAN","TEXT","Cantonese (Jyutping)"],["name_romanMAN","TEXT","Mandarin (Pinyin)"],["other_name_en","TEXT","Alternate English names"],["other_name_zh","TEXT","Alternate Chinese names"],["primary_class","TEXT","OWL class"],["used_in","JSON[]","mao:used_in"],["belongs_to","JSON[]","mao:belongs_to"],["employs","JSON[]","mao:employs"],["has_component","JSON[]","mao:has_component"],["similar_to","JSON[]","mao:similar_to"],["type_of","JSON[]","mao:type_of"],["has_principle","JSON[]","mao:has_principle"],["teaches","JSON[]","mao:teaches"],["practiced_in","JSON[]","mao:practiced_in"],["description","TEXT","mao:has_description"],["archivist_note","TEXT","mao:archivist_note"],["origin_story","TEXT","mao:origin_story"],["characteristics","TEXT","mao:characteristics"]]},classes:{desc:"OWL classes.",cols:[["id","TEXT PK","Class name"],["label","TEXT","rdfs:label"],["comment","TEXT","Class definition"],["name_en","TEXT","English name"],["name_zh","TEXT","Chinese name"],["name_romanCAN","TEXT","Cantonese"],["name_romanMAN","TEXT","Mandarin"],["parent_class","TEXT","rdfs:subClassOf"]]},object_properties:{desc:"OWL ObjectProperties.",cols:[["id","TEXT PK","Property name"],["label","TEXT","rdfs:label"],["comment","TEXT","Definition"],["domain","JSON[]","rdfs:domain"],["range_cls","JSON[]","rdfs:range"],["name_zh","TEXT","Chinese name"]]},relations:{desc:"Flattened triple table.",cols:[["subject","TEXT","Source individual"],["predicate","TEXT","Property name"],["object","TEXT","Target"]]}  };
function buildSchema(){
  const c=document.getElementById('maon-schema-inner');
  let h='<p style="font-size:11px;color:#666;margin-bottom:12px">JSON array columns (used_in, belongs_to, employs…) are stored as arrays. Filter with <code>LIKE '%value%'</code>.</p>';
  for(const[tname,tdef]of Object.entries(SCHEMA)){
    const cnt=TABLES[tname]?TABLES[tname].length:'?';
    h+=`<h3>${tname} <span style="font-weight:normal;font-size:11px;color:#666">(${cnt} rows) — ${tdef.desc}</span></h3>`;
    h+='<table class="maon-schema-table"><thead><tr><th>Column</th><th>Type</th><th>Description</th></tr></thead><tbody>';
    tdef.cols.forEach(([col,type,desc])=>{h+=`<tr><td>${col}</td><td>${type}</td><td>${desc}</td></tr>`;});
    h+='</tbody></table>';
  }
  c.innerHTML=h;
}
function buildHelp(){
  document.getElementById('maon-help-inner').innerHTML=`
<h3>Overview</h3>
<p>SQL access to MAon annotation data. Five tables: <code>individuals</code>, <code>classes</code>, <code>object_properties</code>, <code>annotation_properties</code>, <code>relations</code>. All data runs in-browser — no server needed.</p>
<h3>Embedding in your page</h3>
<pre>&lt;button onclick="MAonSQL.open()"&gt;Browse annotation dataset&lt;/button&gt;
&lt;a href="#" onclick="MAonSQL.open();return false"&gt;Open SQL explorer&lt;/a&gt;</pre>
<p>Close with <code>Esc</code> or click outside. Run with <code>Ctrl+Enter</code> / <code>&#8984;+Enter</code>.</p>
<h3>SQL syntax</h3>
<pre>SELECT col1, col2 FROM table
WHERE condition
ORDER BY col [ASC|DESC]
LIMIT n  OFFSET n</pre>
<p>Supported: <code>=</code> <code>!=</code> <code>&lt;</code> <code>&gt;</code> <code>LIKE '%…%'</code> <code>NOT LIKE</code> <code>IN(…)</code> <code>IS NULL</code> <code>IS NOT NULL</code> <code>AND</code> chains. Functions: <code>UPPER()</code> <code>LOWER()</code> <code>COALESCE()</code>.</p>
<h3>JSON array columns</h3>
<p><code>used_in</code>, <code>belongs_to</code>, <code>employs</code>, <code>has_component</code>, <code>similar_to</code>, <code>type_of</code>, <code>has_principle</code>, <code>teaches</code>, <code>practiced_in</code> store multiple values as arrays. Filter with LIKE:</p>
<pre>WHERE used_in LIKE '%Hung_Kuen%'</pre>
<h3>Hosting</h3>
<p><strong>Static:</strong> upload the HTML file anywhere — GitHub Pages, Netlify, or alongside your ontology page. No server needed.</p>
<p><strong>Dynamic (real SQLite):</strong> run <code>datasette maon.db</code> for full SQL with GROUP BY, JOIN, and aggregates.</p>
`;}
function executeSql(sql){
  let s=sql.trim().replace(/[ \t\r\n]+/g,' ');
  const m=s.match(/^SELECT\s+(.*?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.*?))?(?:\s+ORDER\s+BY\s+(.*?))?(?:\s+LIMIT\s+(\d+))?(?:\s+OFFSET\s+(\d+))?;?$/i);
  if(!m)throw new Error('Only SELECT … FROM table [WHERE …] [ORDER BY …] [LIMIT n] supported.');
  let[,cols,table,where,order,lim,off]=m;
  table=table.toLowerCase();
  if(!TABLES[table])throw new Error(`Unknown table "${table}". Available: ${Object.keys(TABLES).join(', ')}`);
  let rows=[...TABLES[table]];
  if(where)rows=applyWhere(rows,where.trim());
  if(order)rows=applyOrder(rows,order.trim());
  const offset=off?+off:0;if(offset)rows=rows.slice(offset);
  rows=rows.slice(0,lim?+lim:200);
  const colList=cols.trim()==='*'
    ?(()=>{const ks=new Set();TABLES[table].forEach(r=>Object.keys(r).forEach(k=>ks.add(k)));return[...ks].map(k=>{return{expr:k,alias:null}});})()
    :cols.split(',').map(c=>{c=c.trim();const am=c.match(/^(.*?)\s+AS\s+(\w+)$/i);return am?{expr:am[1].trim(),alias:am[2]}:{expr:c,alias:null};});
  return{columns:colList.map(c=>c.alias||c.expr),rows:rows.map(r=>colList.map(c=>evalExpr(c.expr,r)))};
}
function evalExpr(expr,row){
  expr=expr.trim();
  if(/^'[^']*'$/.test(expr))return expr.slice(1,-1);
  const um=expr.match(/^UPPER\((\w+)\)$/i);if(um)return row[um[1]]?String(row[um[1]]).toUpperCase():null;
  const lm=expr.match(/^LOWER\((\w+)\)$/i);if(lm)return row[lm[1]]?String(row[lm[1]]).toLowerCase():null;
  const cm=expr.match(/^COALESCE\((.+)\)$/i);if(cm)return cm[1].split(',').map(e=>evalExpr(e.trim(),row)).find(v=>v!=null)??null;
  return row.hasOwnProperty(expr)?(row[expr]!==undefined?row[expr]:null):null;
}
function splitAnd(clause){
  const parts=[];let depth=0,start=0;const up=clause.toUpperCase();
  for(let i=0;i<clause.length-3;i++){
    if(clause[i]==='(')depth++;else if(clause[i]===')')depth--;
    else if(depth===0&&up.slice(i,i+5)===' AND '){parts.push(clause.slice(start,i));start=i+5;i+=4;}
  }
  parts.push(clause.slice(start));return parts;
}
function evalCond(cond,row){
  let m;
  m=cond.match(/^(\w+)\s+IS\s+NOT\s+NULL$/i);if(m)return row[m[1]]!=null&&row[m[1]]!==undefined;
  m=cond.match(/^(\w+)\s+IS\s+NULL$/i);if(m)return row[m[1]]==null||row[m[1]]===undefined;
  m=cond.match(/^(\w+)\s+(NOT\s+)?LIKE\s+'([^']+)'$/i);
  if(m){const v=String(row[m[1]]||'').toLowerCase(),neg=!!m[2],pat=m[3].toLowerCase().replace(/%/g,'.*').replace(/_/g,'.'),ok=new RegExp('^'+pat+'$').test(v);return neg?!ok:ok;}
  m=cond.match(/^(\w+)\s+(NOT\s+)?IN\s+\(([^)]+)\)$/i);
  if(m){const neg=!!m[2],vals=m[3].split(',').map(v=>v.trim().replace(/^'|'$/g,'')),ok=vals.includes(String(row[m[1]]||''));return neg?!ok:ok;}
  m=cond.match(/^(\w+)\s*(=|!=|<>|>=|<=|>|<)\s*'([^']*)'$/);
  if(m){const rv=String(row[m[1]]||'').toLowerCase(),v=m[3].toLowerCase();switch(m[2]){case'=':return rv===v;case'!=':case'<>':return rv!==v;case'>':return rv>v;case'<':return rv<v;case'>=':return rv>=v;case'<=':return rv<=v;}}
  m=cond.match(/^(\w+)\s*(=|!=|<>|>=|<=|>|<)\s*(-?\d+(\.\d+)?)$/);
  if(m){const rv=parseFloat(row[m[1]]),v=parseFloat(m[3]);if(!isNaN(rv)){switch(m[2]){case'=':return rv===v;case'!=':case'<>':return rv!==v;case'>':return rv>v;case'<':return rv<v;case'>=':return rv>=v;case'<=':return rv<=v;}}}
  return true;
}
function applyWhere(rows,clause){return rows.filter(r=>splitAnd(clause).every(c=>evalCond(c.trim(),r)));}
function applyOrder(rows,clause){
  const parts=clause.split(',').map(p=>{const m=p.trim().match(/^(\w+)\s*(ASC|DESC)?$/i);return m?{col:m[1],dir:(m[2]||'ASC').toUpperCase()}:null;}).filter(Boolean);
  return[...rows].sort((a,b)=>{for(const{col,dir}of parts){const av=a[col],bv=b[col];if(av==null)return 1;if(bv==null)return-1;const c=String(av).localeCompare(String(bv),undefined,{numeric:true});if(c!==0)return dir==='DESC'?-c:c;}return 0;});
}
function isZh(s){return/[一-鿿]/.test(s);}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function renderResults(result,elapsed){
  const{columns,rows}=result;
  const el=document.getElementById('maon-results');
  let h=`<div class="maon-results-meta">${rows.length} row${rows.length!==1?'s':''} &nbsp;&middot;&nbsp; ${elapsed}ms &nbsp;&middot;&nbsp; ${columns.length} column${columns.length!==1?'s':''}</div>`;
  if(!rows.length){el.innerHTML=h+'<div style="color:#888;font-size:12px">No results.</div>';return;}
  h+='<div class="maon-table-wrap"><table class="maon-table"><thead><tr>';
  columns.forEach(c=>h+=`<th>${esc(c)}</th>`);
  h+='</tr></thead><tbody>';
  rows.forEach(row=>{
    h+='<tr>';
    row.forEach((cell,i)=>{
      const col=columns[i];
      if(cell===null||cell===undefined){h+='<td class="maon-null">&#8212;</td>';}
      else if(Array.isArray(cell)){h+=`<td>${cell.map(v=>`<span class="maon-tag" onclick="MAonSQL.inject('${esc(v)}')">${esc(v)}</span>`).join('')}</td>`;}
      else if(typeof cell==='string'&&cell.startsWith('[')){
        try{const arr=JSON.parse(cell);h+=`<td>${arr.length?arr.map(v=>`<span class="maon-tag" onclick="MAonSQL.inject('${esc(v)}')">${esc(v)}</span>`).join(''):'<span class="maon-null">[]</span>'}</td>`;}
        catch{h+=`<td class="${isZh(cell)?'maon-zh':''}">${esc(cell)}</td>`;}
      }else if(col==='primary_class'||col==='parent_class'){h+=`<td><span class="maon-tag" onclick="MAonSQL.queryClass('${esc(cell)}')">${esc(cell)}</span></td>`;}
      else if(col==='id'||col==='subject'||col==='object'){h+=`<td><a href="#" style="color:#00c" onclick="MAonSQL.queryId('${esc(cell)}');return false">${esc(cell)}</a></td>`;}
      else{h+=`<td class="${isZh(String(cell))?'maon-zh':''}">${esc(String(cell))}</td>`;}
    });
    h+='</tr>';
  });
  h+='</tbody></table></div>';
  el.innerHTML=h;
}
window.MAonSQL={
  open(){document.getElementById('maon-overlay').classList.add('open');},
  close(){document.getElementById('maon-overlay').classList.remove('open');},
  tab(name){
    document.querySelectorAll('.maon-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.maon-view').forEach(v=>v.classList.remove('active'));
    const idx=['query','templates','schema','help'].indexOf(name);
    document.querySelectorAll('.maon-tab')[idx].classList.add('active');
    ['maon-view-query','maon-view-templates','maon-schema-inner-view','maon-view-help'].forEach((id,i)=>{if(i===idx)document.getElementById(id).classList.add('active');});
  },
  run(){
    const sql=document.getElementById('maon-sql-input').value.trim();
    const el=document.getElementById('maon-results');
    if(!sql)return;
    const t0=performance.now();
    try{const result=executeSql(sql);renderResults(result,(performance.now()-t0).toFixed(1));}
    catch(err){el.innerHTML=`<div class="maon-error">Error: ${esc(err.message)}</div>`;}
  },
  applyTpl(sql){document.getElementById('maon-sql-input').value=sql;this.tab('query');this.run();},
  inject(val){
    document.getElementById('maon-sql-input').value=`SELECT id, name_en, name_zh, primary_class\nFROM individuals\nWHERE id = '${val}'\n   OR used_in LIKE '%${val}%'\n   OR belongs_to LIKE '%${val}%'\nLIMIT 50;`;
    this.tab('query');this.run();
  },
  queryClass(cls){
    document.getElementById('maon-sql-input').value=`SELECT id, name_en, name_zh, name_romanCAN, name_romanMAN\nFROM individuals\nWHERE primary_class = '${cls}'\nORDER BY name_en\nLIMIT 100;`;
    this.tab('query');this.run();
  },
  queryId(id){
    document.getElementById('maon-sql-input').value=`SELECT *\nFROM individuals\nWHERE id = '${id}';`;
    this.tab('query');this.run();
  },
};
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')MAonSQL.close();
  if((e.ctrlKey||e.metaKey)&&e.key==='Enter')MAonSQL.run();
});
document.getElementById('maon-overlay').addEventListener('click',function(e){if(e.target===this)MAonSQL.close();});
init();
})();
});
