/* CarlOS v2 */
(function(){
"use strict";

/* ── storage ── */
const KEY = "carlos2";
const DEF = {moves:{}, events:[], skips:{}, workouts:[], course:{name:"Origin story course", total:0, done:0, notes:[]}, done:{}, overrides:{}, eveGym:{}, jobs:[], journal:{}, read:{},
  train:{phase:0, phaseStart:null, exDone:{}, loads:{}, gate:{}},
  body:[], dateCheck:{}, qIndex:0, coachLink:""};
let S;
try { S = Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch(e){ S = Object.assign({}, DEF); }
S.train = Object.assign({}, DEF.train, S.train || {});
S.course = Object.assign({}, DEF.course, S.course || {});
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }

/* ── helpers ── */
const $ = (sel, el) => (el || document).querySelector(sel);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad = n => String(n).padStart(2, "0");
const keyOf = d => d.getFullYear() + "-" + pad(d.getMonth()+1) + "-" + pad(d.getDate());
const parseKey = k => { const [y,m,d] = k.split("-").map(Number); return new Date(y, m-1, d); };
const mins = hm => { const [h,m] = hm.split(":").map(Number); return h*60+m; };
const fmt = hm => { let [h,m] = hm.split(":").map(Number); const ap = h >= 12 ? "p" : "a"; h = h % 12 || 12; return h + (m ? ":" + pad(m) : "") + ap; };
const nowMin = () => { const n = new Date(); return n.getHours()*60 + n.getMinutes(); };
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DOWL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const CAT = {grow:"var(--grow)", faith:"var(--faith)", body:"var(--body)", us:"var(--us)", sleep:"var(--sleep)", life:"var(--life)"};
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

let viewDate = new Date();
const today = () => keyOf(new Date());

function toast(msg){ const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("on"), 1800); }

/* ── sky by hour ── */
function paintSky(){
  const h = new Date().getHours() + new Date().getMinutes()/60;
  let p;
  if (h >= 5 && h < 8)       p = ["#1d1a45","#5b3f86","#e7906f","#f2a37a"]; // dawn
  else if (h >= 8 && h < 16) p = ["#10295c","#1f4f94","#3d7cc4","#6fa6e6"]; // day
  else if (h >= 16 && h < 19.5) p = ["#2a1f55","#7a4a8c","#e99a5f","#ffb36b"]; // golden
  else                        p = ["#0f1233","#221d5a","#3f3384","#6f5bd6"]; // night
  const r = document.documentElement.style;
  r.setProperty("--sky1", p[0]); r.setProperty("--sky2", p[1]); r.setProperty("--sky3", p[2]); r.setProperty("--glow", p[3]);
  document.querySelector('meta[name="theme-color"]').setAttribute("content", p[0]);
}

/* ── day model ── */
function dayType(d){ return S.overrides[keyOf(d)] || DEFAULT_WEEK[d.getDay()]; }
function isFirstFriday(d){ return d.getDay() === 5 && d.getDate() <= 7; }
function typeInfo(t){
  if (t === "sat" || t === "sun") return {label:"Off", color:TYPES.rest.color, desc: t === "sat" ? "Rest and time with your wife" : "Church, rest, reset for the week"};
  return TYPES[t];
}
function blocksFor(d){
  const t = dayType(d), k = keyOf(d);
  let list = [];
  const work = ["admin","shoot","edit"].includes(t);
  if (work){
    let morning = MORNING.map(b => Object.assign({}, b));
    if (S.eveGym[k]) morning = morning.filter(b => !b.gym);
    list = list.concat(morning, DAY_BLOCKS[t].map(b => Object.assign({}, b, {cat:b.cat === "work" ? t : b.cat})));
  } else if (t === "sat"){
    list.push({s:"08:00",e:"08:30",cat:"faith",title:"Word + journal",sub:"Slow morning, today's verse",link:"word",detail:"No alarm. Open the Word tab over coffee before the walk."});
    list = list.concat(DAY_BLOCKS.sat);
  } else {
    list = list.concat(DAY_BLOCKS[t === "sun" ? "sun" : "rest"]);
  }
  let evening = EVENING.map(b => Object.assign({}, b));
  if (work && S.eveGym[k]){
    list.push({s:"17:45",e:"18:45",cat:"body",title:"Gym (evening)",sub:"Moved from the morning",link:"train",gym:true,detail:"Early call today, so the session moved here. Same session as listed in Train."});
    evening = evening.map(b => b.title === "Dinner together" ? Object.assign(b, {s:"19:00", e:"19:45"}) : b);
  }
  if (isFirstFriday(d)){
    evening = [DATE_NIGHT, {s:"22:30",e:"22:31",cat:"sleep",title:"Lights out",sub:"A little later tonight",detail:"Late night is fine once a month."}];
  }
  evening.forEach(b => b.fixed = true);
  list.forEach(b => { if (b.title === "Church" || b.title === "State of Us") b.fixed = true; });
  list = list.concat(evening);
  list.forEach(b => { b.id = b.s + "|" + b.title; b.ps = mins(b.s); });
  const skip = S.skips[k] || {};
  list = list.filter(b => !skip[b.id]);
  eventsOn(d).forEach(ev => list.push({s:ev.s, e:ev.e, cat:ev.cat, title:ev.title, sub:ev.note || (ev.repeat === "weekly" ? "Every " + DOWL[d.getDay()] : "Added by you"), detail:ev.note, event:ev.id, id:"ev:" + ev.id, fixed:true, ps:mins(ev.s)}));
  const wo = S.workouts.find(w => w.d === k);
  if (wo) list.forEach(b => { if (b.gym) b.sub = "Logged: " + wo.what; });
  applyMoves(list, k);
  list.sort((a,b) => mins(a.s) - mins(b.s) || a.ps - b.ps);
  return list;
}
const hm = m => { m = Math.max(0, Math.min(m, 23*60 + 59)); return pad(Math.floor(m/60)) + ":" + pad(m % 60); };
/* Moves: a block can be given a new start for one day. Flexible blocks after it
   get pushed later only if they would overlap. Fixed blocks (evening routine,
   church, your own events) never move. */
function applyMoves(list, k){
  const mv = S.moves[k] || {};
  const flex = list.filter(b => !b.fixed).sort((a,b) => a.ps - b.ps);
  let prevEnd = -1;
  flex.forEach(b => {
    const dur = mins(b.e) - mins(b.s);
    let st = mv[b.id] != null ? mv[b.id] : b.ps;
    if (Object.keys(mv).length && prevEnd > st) st = prevEnd;
    b.moved = st !== b.ps;
    b.s = hm(st); b.e = hm(st + dur);
    prevEnd = st + dur;
  });
  const firstFixedEve = list.filter(b => b.fixed && b.ps >= mins("17:00")).sort((a,b) => a.ps - b.ps)[0];
  const lastFlex = flex.filter(b => b.ps < (firstFixedEve ? firstFixedEve.ps : 24*60)).pop();
  list.overrun = (firstFixedEve && lastFlex && mins(lastFlex.e) > firstFixedEve.ps) ? {mins: mins(lastFlex.e) - firstFixedEve.ps, into: firstFixedEve.title} : null;
}
/* shift block b (and optionally everything flexible after it) by delta minutes */
function shiftFrom(d, b, delta, cascade){
  const k = keyOf(d), list = blocksFor(d);
  S.moves[k] = S.moves[k] || {};
  const target = list.find(x => x.id === b.id);
  if (!target) return;
  const from = mins(target.s);
  list.filter(x => !x.fixed && (x.id === b.id || (cascade && mins(x.s) >= from && x.id !== b.id))).forEach(x => {
    S.moves[k][x.id] = Math.max(0, mins(x.s) + delta);
  });
  Object.keys(S.moves[k]).forEach(id => { const x = list.find(y => y.id === id); if (x && S.moves[k][id] === x.ps) delete S.moves[k][id]; });
  if (!Object.keys(S.moves[k]).length) delete S.moves[k];
  save();
}
function openRunningLate(){
  const d = viewDate, k = keyOf(d), done = S.done[k] || {}, cur = keyOf(d) === today() ? nowMin() : 0;
  const list = blocksFor(d).filter(b => !b.fixed && !done[b.id]);
  if (!list.length){ toast("Nothing left to move today"); return; }
  const def = list.find(b => mins(b.e) > cur) || list[list.length - 1];
  openSheet(`
    <h2 style="margin-bottom:4px">Shift the rest of the day</h2>
    <p class="small" style="margin-bottom:14px">Moves this block and everything after it. Your evening, church, and your own events stay put.</p>
    <label class="f" for="rlFrom" style="margin-top:0">Starting with</label>
    <select id="rlFrom">${list.map(b => `<option value="${esc(b.id)}"${b.id === def.id ? " selected" : ""}>${fmt(b.s)}  ${esc(b.title)}</option>`).join("")}</select>
    <label class="f">Move by</label>
    <div class="row" style="flex-wrap:wrap;gap:8px">${[-30,-15,15,30,45,60,90].map(n => `<button class="chip" data-shift="${n}" style="flex:1 0 auto;justify-content:center">${n > 0 ? "+" : "−"}${Math.abs(n) >= 60 ? (Math.abs(n)/60) + "h" : Math.abs(n) + "m"}</button>`).join("")}</div>
    ${S.moves[k] ? `<button class="btn ghost" id="rlReset" style="margin-top:14px">Back to the planned times</button>` : ""}
  `);
  document.querySelectorAll("[data-shift]").forEach(btn => btn.onclick = () => {
    const id = $("#rlFrom").value, b = list.find(x => x.id === id), n = Number(btn.dataset.shift);
    shiftFrom(d, b, n, true); closeSheet(); renderToday();
    toast((n > 0 ? "Pushed " : "Pulled ") + Math.abs(n) + " min from " + b.title);
  });
  if ($("#rlReset")) $("#rlReset").onclick = () => { delete S.moves[k]; save(); closeSheet(); renderToday(); toast("Back to plan"); };
}
function eventsOn(d){
  const k = keyOf(d);
  return S.events.filter(ev => ev.repeat === "weekly" ? (ev.dow === d.getDay() && k >= ev.date && !(ev.off || {})[k]) : ev.date === k);
}
const EV_CATS = [
  {id:"life", label:"Personal"}, {id:"admin", label:"Work"}, {id:"us", label:"Us"},
  {id:"faith", label:"Faith"}, {id:"body", label:"Body"}, {id:"grow", label:"Growth"}
];
function openEventSheet(ev){
  const isNew = !ev;
  const e = ev || {title:"", s:"16:00", e:"17:00", cat:"us", date:keyOf(viewDate), repeat:"none", note:""};
  openSheet(`
    <h2 style="margin-bottom:12px">${isNew ? "Add to your day" : "Edit event"}</h2>
    <label class="f" for="et" style="margin-top:0">What</label><input id="et" value="${esc(e.title)}" placeholder="e.g. Couples counseling">
    <div class="row">
      <div><label class="f" for="es">Starts</label><input id="es" type="time" value="${esc(e.s)}"></div>
      <div><label class="f" for="ee">Ends</label><input id="ee" type="time" value="${esc(e.e)}"></div>
    </div>
    <div class="row">
      <div><label class="f" for="ed">Date</label><input id="ed" type="date" value="${esc(e.date)}"></div>
      <div><label class="f" for="er">Repeats</label><select id="er"><option value="none"${e.repeat !== "weekly" ? " selected" : ""}>Just this day</option><option value="weekly"${e.repeat === "weekly" ? " selected" : ""}>Every week</option></select></div>
    </div>
    <label class="f">Type</label>
    <div class="row" style="flex-wrap:wrap;gap:8px" id="ecats">${EV_CATS.map(c => `<button class="chip${c.id === e.cat ? " on" : ""}" data-cat="${c.id}" style="flex:0 0 auto;${c.id === e.cat ? "background:#f6f3ff;color:#1b1840" : ""}"><i style="background:${TYPES[c.id] ? TYPES[c.id].color : CAT[c.id]}"></i>${c.label}</button>`).join("")}</div>
    <label class="f" for="en">Note</label><textarea id="en" rows="2" placeholder="Optional">${esc(e.note)}</textarea>
    <div class="row" style="margin-top:16px">
      ${isNew ? "" : `<button class="btn ghost" id="delEv">Delete</button>`}
      <button class="btn primary" id="saveEv">${isNew ? "Add" : "Save changes"}</button>
    </div>
    ${!isNew && e.repeat === "weekly" ? `<button class="btn ghost" id="skipEv" style="margin-top:10px">Skip it just on ${parseKey(keyOf(viewDate)).toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}</button>` : ""}
  `);
  let cat = e.cat;
  document.querySelectorAll("#ecats [data-cat]").forEach(b => b.onclick = () => {
    cat = b.dataset.cat;
    document.querySelectorAll("#ecats [data-cat]").forEach(x => { const on = x.dataset.cat === cat; x.style.background = on ? "#f6f3ff" : ""; x.style.color = on ? "#1b1840" : ""; });
  });
  $("#saveEv").onclick = () => {
    const title = $("#et").value.trim(), s = $("#es").value, en = $("#ee").value, date = $("#ed").value;
    if (!title){ $("#et").focus(); toast("Add a name"); return; }
    if (!s || !en || mins(en) <= mins(s)){ toast("End time has to be after the start"); return; }
    if (!date){ toast("Pick a date"); return; }
    const data = {title, s, e:en, date, cat, repeat:$("#er").value, dow:parseKey(date).getDay(), note:$("#en").value.trim()};
    if (isNew) S.events.push(Object.assign({id:Date.now().toString(36)}, data)); else Object.assign(ev, data);
    save(); closeSheet(); refresh(); toast(isNew ? "Added" : "Saved");
  };
  if (!isNew){
    $("#delEv").onclick = () => { S.events = S.events.filter(x => x.id !== ev.id); save(); closeSheet(); refresh(); toast("Deleted"); };
    if ($("#skipEv")) $("#skipEv").onclick = () => { ev.off = ev.off || {}; ev.off[keyOf(viewDate)] = true; save(); closeSheet(); refresh(); toast("Skipped for that day"); };
  }
}
function openWorkoutSheet(dateKey){
  const k = dateKey || today();
  const ex = S.workouts.find(w => w.d === k);
  const parts = ["Back","Chest","Legs","Shoulders","Arms","Core","Full body","Stretching","Run","Walk","Bike"];
  const picked = new Set(ex ? ex.parts || [] : []);
  openSheet(`
    <h2 style="margin-bottom:4px">${ex ? "Edit workout" : "Log a workout"}</h2>
    <p class="small" style="margin-bottom:12px">For days you trained differently from the plan. It checks off the gym block.</p>
    <div class="row" style="flex-wrap:wrap;gap:8px" id="wparts">${parts.map(p => `<button class="chip" data-p="${p}" style="flex:0 0 auto;padding:8px 14px;${picked.has(p) ? "background:#f6f3ff;color:#1b1840" : ""}">${p}</button>`).join("")}</div>
    <div class="row">
      <div><label class="f" for="wm">Minutes</label><input id="wm" inputmode="numeric" value="${ex && ex.mins ? ex.mins : ""}" placeholder="e.g. 60"></div>
      <div><label class="f" for="wdt">Date</label><input id="wdt" type="date" value="${k}"></div>
    </div>
    <label class="f" for="wn">Notes</label><textarea id="wn" rows="2" placeholder="Weights, how the shoulder felt…">${esc(ex ? ex.note : "")}</textarea>
    <div class="row" style="margin-top:16px">${ex ? `<button class="btn ghost" id="wdel">Delete</button>` : ""}<button class="btn primary" id="wsave">Save workout</button></div>
  `);
  document.querySelectorAll("#wparts [data-p]").forEach(b => b.onclick = () => {
    const p = b.dataset.p; if (picked.has(p)) picked.delete(p); else picked.add(p);
    b.style.background = picked.has(p) ? "#f6f3ff" : ""; b.style.color = picked.has(p) ? "#1b1840" : "";
  });
  $("#wsave").onclick = () => {
    const note = $("#wn").value.trim(), d = $("#wdt").value || k;
    if (!picked.size && !note){ toast("Pick what you trained or add a note"); return; }
    const list = [...picked];
    const what = list.length ? list.join(" + ").toLowerCase().replace(/^./, c => c.toUpperCase()) : note;
    S.workouts = S.workouts.filter(w => w.d !== d && w.d !== k);
    S.workouts.push({d, parts:list, what, mins:parseInt($("#wm").value,10) || null, note});
    S.workouts.sort((a,b) => a.d.localeCompare(b.d));
    S.done[d] = S.done[d] || {};
    blocksFor(parseKey(d)).filter(b => b.gym).forEach(b => S.done[d][b.id] = true);
    save(); closeSheet(); refresh(); toast("Workout logged");
  };
  if (ex) $("#wdel").onclick = () => { S.workouts = S.workouts.filter(w => w.d !== k); save(); closeSheet(); refresh(); toast("Deleted"); };
}
function colorOf(b){ return TYPES[b.cat] ? TYPES[b.cat].color : CAT[b.cat] || "var(--life)"; }

/* ── TODAY ── */
function renderToday(){
  const d = viewDate, k = keyOf(d), isToday = k === today();
  const t = dayType(d), info = typeInfo(t);
  const blocks = blocksFor(d);
  const done = S.done[k] || {};
  const cur = isToday ? nowMin() : -1;
  const curB = blocks.find(b => cur >= mins(b.s) && cur < mins(b.e));
  const nextB = blocks.find(b => mins(b.s) > cur);
  const doneCount = blocks.filter(b => done[b.id]).length;
  const pct = blocks.length ? doneCount / blocks.length : 0;

  let hero;
  if (!isToday){
    hero = `<div class="lead">${DOWL[d.getDay()]}, ${d.toLocaleDateString("en-US",{month:"long",day:"numeric"})}</div><h1>${esc(info.label)} day</h1><div class="remain">${esc(info.desc)}</div>`;
  } else if (curB){
    const left = mins(curB.e) - cur;
    hero = `<div class="lead">Right now</div><h1>${esc(curB.title)}</h1><div class="remain">${left >= 60 ? Math.floor(left/60) + "h " + (left%60) + "m" : left + " min"} left · next: ${nextB ? esc(nextB.title) + " at " + fmt(nextB.s) : "rest"}</div>`;
  } else if (nextB){
    hero = `<div class="lead">Up next at ${fmt(nextB.s)}</div><h1>${esc(nextB.title)}</h1><div class="remain">${esc(nextB.sub)}</div>`;
  } else {
    hero = `<div class="lead">Day's done</div><h1>Rest well</h1><div class="remain">Tomorrow starts at 5:45.</div>`;
  }

  /* ribbon */
  const start = Math.min(...blocks.map(b => mins(b.s))), end = Math.max(...blocks.map(b => mins(b.e)));
  const span = end - start || 1;
  const segs = blocks.map(b => {
    const l = (mins(b.s)-start)/span*100, w = Math.max((mins(b.e)-mins(b.s))/span*100, .9);
    return `<div class="seg${done[b.id] ? " done" : ""}" style="left:${l}%;width:${w}%;background:${colorOf(b)}"></div>`;
  }).join("");
  const sunPos = isToday && cur >= start && cur <= end ? `<div class="sun" style="left:${(cur-start)/span*100}%"></div>` : "";

  /* groups */
  const groups = [
    {name:"Morning", list: blocks.filter(b => b.ps < mins("08:30"))},
    {name:"Day", list: blocks.filter(b => b.ps >= mins("08:30") && b.ps < mins("17:45"))},
    {name:"Evening", list: blocks.filter(b => b.ps >= mins("17:45"))}
  ].filter(g => g.list.length);

  const blockHtml = b => {
    const isNow = curB && curB.id === b.id;
    return `<div class="blk${done[b.id] ? " done" : ""}${isNow ? " now" : ""}" data-blk="${esc(b.id)}">
      <div class="bar" style="background:${colorOf(b)}"></div>
      <div class="t"${b.moved ? ' style="color:#ffe2a8"' : ""}>${fmt(b.s)}</div>
      <div class="body"><div class="ttl">${esc(b.title)}${isNow ? '<span class="now-tag">Now</span>' : ""}</div><div class="sub">${esc(b.sub)}</div></div>
      <button class="check${done[b.id] ? " on" : ""}" data-done="${esc(b.id)}" aria-label="Mark ${esc(b.title)} done">${CHECK}</button>
    </div>`;
  };

  const work = ["admin","shoot","edit"].includes(t);
  const circ = 2*Math.PI*24;

  $("#s-today").innerHTML = `
    <div class="top">
      <div class="brand">Carl<span>OS</span></div>
      <div class="row" style="flex:0;gap:6px">
        <button class="chip" id="prevDay" aria-label="Previous day" style="padding:8px 12px">‹</button>
        <button class="chip" id="nextDay" aria-label="Next day" style="padding:8px 12px">›</button>
      </div>
    </div>
    <div class="hero">${hero}
      <div class="meta" style="margin-top:14px">
        <button class="chip" id="typeBtn"><i style="background:${info.color}"></i>${esc(info.label)} day<span class="tiny" style="margin-left:2px">change</span></button>
        ${work ? `<button class="chip" id="gymBtn">${S.eveGym[k] ? "Gym: evening" : "Gym: morning"}</button>` : ""}
        <button class="chip" id="shiftBtn">${S.moves[k] ? "Times shifted · edit" : "Shift my day"}</button>
        <button class="chip" id="addEv">+ Add event</button>
        ${!isToday ? `<button class="chip" id="backToday">Back to today</button>` : ""}
      </div>
    </div>
    <div class="ribbon" aria-hidden="true"><div class="track">${segs}</div>${sunPos}<div class="ends"><span>${fmt(blocks[0].s)}</span><span>${fmt(blocks[blocks.length-1].s)}</span></div></div>

    <div class="glass panel prog" style="margin-top:10px">
      <svg class="ring" viewBox="0 0 54 54"><circle class="bg" cx="27" cy="27" r="24"/><circle class="fg" cx="27" cy="27" r="24" transform="rotate(-90 27 27)" stroke-dasharray="${circ}" stroke-dashoffset="${circ*(1-pct)}"/></svg>
      <div><h3>${doneCount} of ${blocks.length} done</h3>${blocks.overrun ? `<div class="small" style="color:#ffb4a2">Work now runs ${blocks.overrun.mins} min into ${esc(blocks.overrun.into).toLowerCase()}. Hide or shorten a block.</div>` : ""}${S.workouts.find(w => w.d === k) ? `<div class="small" style="color:var(--body)">Workout: ${esc(S.workouts.find(w => w.d === k).what)}</div>` : ""}<div class="small">${pct >= 1 ? "Full day. Well done." : isFirstFriday(d) ? "Date night tonight." : esc(info.desc)}</div></div>
    </div>

    ${groups.map(g => `<div class="glass group"><div class="group-head"><span>${g.name}</span><span>${fmt(g.list[0].s)}–${fmt(g.list[g.list.length-1].s)}</span></div>${g.list.map(blockHtml).join("")}</div>`).join("")}

    ${S.skips[k] && Object.keys(S.skips[k]).length ? `<button class="link" id="restoreSkips" style="display:block;margin:2px auto 0">Show ${Object.keys(S.skips[k]).length} hidden block${Object.keys(S.skips[k]).length > 1 ? "s" : ""}</button>` : ""}
    <div class="section-title"><h2>Jobs for ${isToday ? "today" : DOW[d.getDay()]}</h2><button class="link" id="allJobs">All jobs</button></div>
    <div class="glass group" id="jobsToday">${jobsFor(d)}</div>
    <button class="btn" id="addJob" style="margin-top:4px">Add a job</button>
  `;

  $("#prevDay").onclick = () => { viewDate = new Date(viewDate.getTime() - 864e5); renderToday(); };
  $("#nextDay").onclick = () => { viewDate = new Date(viewDate.getTime() + 864e5); renderToday(); };
  if ($("#backToday")) $("#backToday").onclick = () => { viewDate = new Date(); renderToday(); };
  $("#typeBtn").onclick = openTypeSheet;
  $("#addEv").onclick = () => openEventSheet();
  $("#shiftBtn").onclick = openRunningLate;
  if ($("#restoreSkips")) $("#restoreSkips").onclick = () => { delete S.skips[k]; save(); renderToday(); toast("Blocks restored"); };
  if ($("#gymBtn")) $("#gymBtn").onclick = () => { S.eveGym[k] = !S.eveGym[k]; save(); renderToday(); toast(S.eveGym[k] ? "Gym moved to 5:45p" : "Gym back to 6:30a"); };
  $("#addJob").onclick = () => openJobSheet();
  $("#allJobs").onclick = openAllJobs;
  document.querySelectorAll("#s-today [data-done]").forEach(btn => btn.onclick = e => {
    e.stopPropagation();
    const id = btn.dataset.done;
    S.done[k] = S.done[k] || {};
    S.done[k][id] = !S.done[k][id];
    save(); renderToday();
  });
  document.querySelectorAll("#s-today [data-blk]").forEach(el => el.onclick = () => {
    const b = blocks.find(x => x.id === el.dataset.blk);
    openBlockSheet(b);
  });
  bindJobButtons($("#jobsToday"));
}

function courseHtml(){
  const C = S.course, left = Math.max(C.total - C.done, 0);
  const pct = C.total ? Math.min(C.done / C.total, 1) : 0;
  let finish = "";
  if (C.total && left){
    const weeks = Math.ceil(left / 3);
    const f = new Date(Date.now() + weeks * 7 * 864e5);
    finish = "At 3 lessons a week you finish around " + f.toLocaleDateString("en-US",{month:"long",day:"numeric"}) + ".";
  } else if (C.total && !left) finish = "Course finished. Keep applying it.";
  return `<div class="glass panel" style="background:rgba(255,255,255,.07)">
    <input id="cname" value="${esc(C.name)}" style="font-weight:650;margin-bottom:10px" aria-label="Course name">
    <div style="height:10px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden;margin:4px 0 8px"><div style="height:100%;width:${pct*100}%;background:var(--grow);border-radius:999px"></div></div>
    <div class="row" style="align-items:center"><div class="small">${C.total ? C.done + " of " + C.total + " lessons" : "Set the total number of lessons"}</div>
      <input id="ctotal" inputmode="numeric" value="${C.total || ""}" placeholder="Total" style="max-width:96px;flex:0 0 96px;padding:8px 12px" aria-label="Total lessons"></div>
    ${finish ? `<div class="tiny" style="margin-top:8px">${finish}</div>` : ""}
    <label class="f" for="capply">What I'll apply from this lesson</label>
    <textarea id="capply" rows="3" placeholder="A hook, a story beat, a change to how you introduce yourself…"></textarea>
    <button class="btn primary" id="clesson" style="margin-top:12px">Lesson done</button>
    ${C.notes.length ? `<details style="margin-top:12px"><summary><span class="small">Past takeaways (${C.notes.length})</span></summary>${C.notes.slice().reverse().map(n => `<div style="padding:10px 0;border-top:1px solid var(--line2)"><div class="tiny">Lesson ${n.n} · ${parseKey(n.d).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div><div class="small" style="color:var(--ink)">${esc(n.t)}</div></div>`).join("")}</details>` : ""}
  </div>`;
}
function bindCourse(b){
  $("#cname").onchange = e => { S.course.name = e.target.value.trim() || "Origin story course"; save(); };
  $("#ctotal").onchange = e => { S.course.total = parseInt(e.target.value, 10) || 0; save(); openBlockSheet(b); };
  $("#clesson").onclick = () => {
    const t = $("#capply").value.trim();
    if (!t){ $("#capply").focus(); toast("Write one takeaway first"); return; }
    S.course.done += 1;
    S.course.notes.push({n:S.course.done, d:today(), t});
    const k = keyOf(viewDate); S.done[k] = S.done[k] || {}; S.done[k][b.id] = true;
    save(); closeSheet(); refresh(); toast("Lesson " + S.course.done + " done");
  };
}
function openBlockSheet(b){
  if (b.event){ openEventSheet(S.events.find(x => x.id === b.event)); return; }
  openSheet(`
    <div class="small" style="margin-bottom:6px">${fmt(b.s)} – ${fmt(b.e)}</div>
    <h2 style="font-size:28px;margin-bottom:12px">${esc(b.title)}</h2>
    <p style="font-size:16px;line-height:1.6;color:var(--ink2);margin-bottom:20px">${esc(b.detail || b.sub)}</p>
    ${b.course ? courseHtml() : ""}
    ${b.gym ? `<button class="btn" id="logWo" style="margin-bottom:10px">Trained something different? Log it</button>` : ""}
    ${!b.fixed ? `<div class="glass panel" style="background:rgba(255,255,255,.07)">
      <h3 style="margin-bottom:10px">Move this block</h3>
      <div class="row" style="align-items:center"><input id="mvAt" type="time" value="${esc(b.s)}" aria-label="New start time"><button class="btn primary" id="mvGo" style="flex:0 0 auto;width:auto">Move</button></div>
      <div class="row" style="gap:8px;margin-top:10px">${[-15,15,30,60].map(n => `<button class="chip" data-mv="${n}" style="justify-content:center">${n > 0 ? "+" : "−"}${Math.abs(n) >= 60 ? "1h" : Math.abs(n) + "m"}</button>`).join("")}</div>
      <label style="display:flex;gap:10px;align-items:center;margin-top:12px;font-size:15px"><input type="checkbox" id="mvAll" checked style="width:22px;height:22px;accent-color:var(--ok)">Move everything after it too</label>
      ${b.moved ? `<div class="tiny" style="margin-top:8px">Planned for ${fmt(hm(b.ps))}.</div>` : ""}
    </div>` : `<p class="tiny" style="margin-bottom:10px">This one stays at its set time when you shift your day.</p>`}
    ${b.link ? `<button class="btn primary" id="goLink">Open ${b.link === "word" ? "the Word" : b.link === "train" ? "today's session" : "Us"}</button>` : ""}
  `);
  if (b.link) $("#goLink").onclick = () => { closeSheet(); go(b.link); };
  if (b.course) bindCourse(b);
  if (b.gym) $("#logWo").onclick = () => openWorkoutSheet(keyOf(viewDate));
  if (!b.fixed){
    const doMove = delta => { shiftFrom(viewDate, b, delta, $("#mvAll").checked); closeSheet(); renderToday(); toast(b.title + " moved to " + fmt(blocksFor(viewDate).find(x => x.id === b.id).s)); };
    document.querySelectorAll("[data-mv]").forEach(x => x.onclick = () => doMove(Number(x.dataset.mv)));
    $("#mvGo").onclick = () => { const v = $("#mvAt").value; if (!v) return; doMove(mins(v) - mins(b.s)); };
  }
  const sk = document.createElement("button");
  sk.className = "btn ghost"; sk.style.marginTop = "10px"; sk.textContent = "Hide this block on " + DOWL[viewDate.getDay()];
  sk.onclick = () => { const k = keyOf(viewDate); S.skips[k] = S.skips[k] || {}; S.skips[k][b.id] = true; save(); closeSheet(); refresh(); toast("Hidden for that day"); };
  $("#sheet-body").appendChild(sk);
}

function openTypeSheet(){
  const k = keyOf(viewDate), cur = dayType(viewDate);
  const opts = ["admin","shoot","edit","rest"];
  const def = DEFAULT_WEEK[viewDate.getDay()];
  openSheet(`
    <h2 style="margin-bottom:4px">What kind of day is ${DOWL[viewDate.getDay()]}?</h2>
    <p class="small" style="margin-bottom:14px">Swap it when a client moves a shoot. The blocks change to match.</p>
    ${opts.map(o => `<div class="type-opt${cur === o || (o === "rest" && (cur === "sat" || cur === "sun")) ? " on" : ""}" data-t="${o}"><i style="background:${TYPES[o].color}"></i><div><h3>${TYPES[o].label}</h3><div class="small">${TYPES[o].desc}</div></div></div>`).join("")}
    ${S.overrides[k] ? `<button class="btn ghost" id="resetType" style="margin-top:12px">Reset to the usual ${DOW[viewDate.getDay()]}</button>` : ""}
  `);
  document.querySelectorAll(".type-opt").forEach(el => el.onclick = () => {
    let v = el.dataset.t;
    if (v === "rest" && (def === "sat" || def === "sun")) v = def;
    if (v === def) delete S.overrides[k]; else S.overrides[k] = v;
    save(); closeSheet(); renderToday(); toast(typeInfo(v).label + " day set");
  });
  if ($("#resetType")) $("#resetType").onclick = () => { delete S.overrides[k]; save(); closeSheet(); renderToday(); };
}

/* ── JOBS ── */
const STAGES = [
  {id:"shoot", label:"To shoot"},
  {id:"edit", label:"To edit"},
  {id:"deliver", label:"To deliver"},
  {id:"invoice", label:"To invoice"},
  {id:"paid", label:"Awaiting payment"}
];
const stageLabel = id => (STAGES.find(s => s.id === id) || {label:"Done"}).label;
function relevantStages(t){
  if (t === "shoot") return ["shoot"];
  if (t === "edit") return ["edit","deliver"];
  if (t === "admin") return ["invoice","paid"];
  return [];
}
function dueText(due){
  if (!due) return {txt:"No due date", late:false};
  const diff = Math.round((parseKey(due) - parseKey(today())) / 864e5);
  if (diff < 0) return {txt: Math.abs(diff) + (diff === -1 ? " day" : " days") + " overdue", late:true};
  if (diff === 0) return {txt:"Due today", late:false};
  if (diff === 1) return {txt:"Due tomorrow", late:false};
  return {txt:"Due " + parseKey(due).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}), late:false};
}
function jobRow(j){
  const dt = dueText(j.due);
  return `<div class="job"><div class="body"><div class="ttl">${esc(j.client)}${j.what ? " · " + esc(j.what) : ""}</div><div class="due${dt.late ? " late" : ""}">${dt.txt}</div></div>
    <button class="stage" data-job="${j.id}">${stageLabel(j.stage)}</button></div>`;
}
function jobsFor(d){
  const t = dayType(d), rel = relevantStages(t), k = keyOf(d);
  const active = S.jobs.filter(j => j.stage !== "done");
  let list = active.filter(j => rel.includes(j.stage) || (j.due && j.due <= k && j.stage !== "paid"));
  if (t === "admin") list = list.concat(active.filter(j => j.due && !list.includes(j) && (parseKey(j.due) - d)/864e5 <= 7));
  list.sort((a,b) => (a.due || "9999").localeCompare(b.due || "9999"));
  if (!list.length){
    if (!["admin","shoot","edit"].includes(t)) return `<div class="empty">Off day. Jobs can wait until tomorrow.</div>`;
    return `<div class="empty">${active.length ? "Nothing here for a " + typeInfo(t).label.toLowerCase() + " day." : "No jobs yet. Add your client work so it shows up on the right day."}</div>`;
  }
  return list.map(jobRow).join("");
}
function bindJobButtons(root){
  root.querySelectorAll("[data-job]").forEach(btn => btn.onclick = () => openJobSheet(S.jobs.find(j => j.id === btn.dataset.job)));
}
function openJobSheet(job){
  const j = job || {id:"", client:"", what:"", stage:"shoot", due:"", notes:""};
  const i = STAGES.findIndex(s => s.id === j.stage);
  const next = STAGES[i+1];
  openSheet(`
    <h2 style="margin-bottom:6px">${job ? esc(j.client) : "Add a job"}</h2>
    ${job ? `<p class="small">${stageLabel(j.stage)} · ${dueText(j.due).txt}</p>
      <button class="btn primary" id="advance" style="margin:14px 0 6px">${next ? "Mark as " + next.label.toLowerCase() : "Mark as paid"}</button>` : ""}
    <label class="f" for="jc">Client</label><input id="jc" value="${esc(j.client)}" placeholder="e.g. DTCo">
    <label class="f" for="jw">What</label><input id="jw" value="${esc(j.what)}" placeholder="e.g. 3 UGC videos">
    <div class="row">
      <div><label class="f" for="js">Stage</label><select id="js">${STAGES.map(s => `<option value="${s.id}"${s.id === j.stage ? " selected" : ""}>${s.label}</option>`).join("")}</select></div>
      <div><label class="f" for="jd">Due</label><input id="jd" type="date" value="${esc(j.due)}"></div>
    </div>
    <label class="f" for="jn">Notes</label><textarea id="jn" rows="2" placeholder="Shot list, rate, contact…">${esc(j.notes)}</textarea>
    <div class="row" style="margin-top:16px">
      ${job ? `<button class="btn ghost" id="delJob">Delete</button>` : ""}
      <button class="btn${job ? "" : " primary"}" id="saveJob">${job ? "Save changes" : "Add job"}</button>
    </div>
  `);
  if (job) $("#advance").onclick = () => {
    job.stage = next ? next.id : "done";
    save(); closeSheet(); refresh(); toast(next ? next.label : "Paid. Job closed.");
  };
  $("#saveJob").onclick = () => {
    const c = $("#jc").value.trim();
    if (!c){ $("#jc").focus(); toast("Add a client name"); return; }
    const data = {client:c, what:$("#jw").value.trim(), stage:$("#js").value, due:$("#jd").value, notes:$("#jn").value.trim()};
    if (job) Object.assign(job, data); else S.jobs.push(Object.assign({id: Date.now().toString(36)}, data));
    save(); closeSheet(); refresh(); toast(job ? "Saved" : "Job added");
  };
  if (job) $("#delJob").onclick = () => { S.jobs = S.jobs.filter(x => x.id !== job.id); save(); closeSheet(); refresh(); toast("Deleted"); };
}
function openAllJobs(){
  const active = S.jobs.filter(j => j.stage !== "done").sort((a,b) => (a.due || "9999").localeCompare(b.due || "9999"));
  const closed = S.jobs.filter(j => j.stage === "done").slice(-5).reverse();
  openSheet(`
    <h2 style="margin-bottom:12px">All jobs</h2>
    ${STAGES.map(s => {
      const l = active.filter(j => j.stage === s.id);
      return l.length ? `<div class="small" style="margin:14px 4px 4px">${s.label}</div><div class="glass group" style="background:rgba(255,255,255,.06)">${l.map(jobRow).join("")}</div>` : "";
    }).join("") || `<p class="small">No open jobs.</p>`}
    ${closed.length ? `<div class="small" style="margin:18px 4px 6px">Recently paid</div>${closed.map(j => `<div class="tiny" style="padding:4px">${esc(j.client)}${j.what ? " · " + esc(j.what) : ""}</div>`).join("")}` : ""}
    <button class="btn primary" id="addFromAll" style="margin-top:16px">Add a job</button>
  `);
  bindJobButtons($("#sheet-body"));
  $("#addFromAll").onclick = () => openJobSheet();
}

/* ── WORD ── */
function planIndex(d){
  const start = new Date(d.getFullYear(), 0, 1);
  const doy = Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - start) / 864e5);
  return doy % 364;
}
function verseFor(d){ const i = planIndex(d); return {week: Math.floor(i/7), day: i % 7}; }
const VKEY = "carlos2-verses";
let vcache; try { vcache = JSON.parse(localStorage.getItem(VKEY) || "{}"); } catch(e){ vcache = {}; }
async function getVerse(ref){
  if (typeof VERSES !== "undefined" && VERSES[ref]) return VERSES[ref];
  if (vcache[ref]) return vcache[ref];
  const url = "https://bible-api.com/" + encodeURIComponent(ref).replace(/%20/g,"+") + "?translation=web";
  const r = await fetch(url);
  if (!r.ok) throw new Error("fetch");
  const j = await r.json();
  const txt = (j.text || "").replace(/\s+/g, " ").trim();
  vcache[ref] = txt;
  try { localStorage.setItem(VKEY, JSON.stringify(vcache)); } catch(e){}
  return txt;
}
let wordDay = null;
function renderWord(){
  const d = new Date(), {week, day} = verseFor(d);
  const th = THEMES[week];
  const sel = wordDay == null ? day : wordDay;
  const ref = th.r[sel];
  const k = today();
  const J = S.journal[k] || {grat:"", i1:"", i2:"", i3:"", notes:""};
  const weekStart = new Date(d.getTime() - day*864e5);

  $("#s-word").innerHTML = `
    <div class="top"><div class="brand">Carl<span>OS</span></div><div class="date">${d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div></div>
    <div class="glass verse">
      <div class="ref">${esc(ref)}</div>
      <div class="txt loading" id="vtxt">Loading…</div>
      <div class="theme-line">Week ${week+1} of 52 · ${esc(th.t)}</div>
    </div>
    <div class="glass panel">
      <div class="small">This week's question</div>
      <div class="q">${esc(th.q)}</div>
      <div class="days">${th.r.map((r,i) => {
        const dd = new Date(weekStart.getTime() + i*864e5);
        return `<button data-wd="${i}" class="${i === sel ? "on" : ""}${S.read[keyOf(dd)] ? " read" : ""}" aria-label="${esc(r)}">${DOW[dd.getDay()]}</button>`;
      }).join("")}</div>
    </div>

    <div class="section-title"><h2>Journal</h2><span class="tiny" id="saved"></span></div>
    <div class="glass panel">
      <label class="f" for="jg" style="margin-top:0">Grateful for</label>
      <textarea id="jg" rows="2" placeholder="One or two things">${esc(J.grat)}</textarea>
      <label class="f">Three intentions for today</label>
      <input id="j1" value="${esc(J.i1)}" placeholder="Who I want to be today" style="margin-bottom:8px">
      <input id="j2" value="${esc(J.i2)}" placeholder="What matters most at work" style="margin-bottom:8px">
      <input id="j3" value="${esc(J.i3)}" placeholder="How I'll show up at home">
      <label class="f" for="jn2">Prayer and notes</label>
      <textarea id="jn2" rows="4" placeholder="Write freely">${esc(J.notes)}</textarea>
      <button class="btn primary" id="readDone" style="margin-top:14px">${S.read[k] ? "Read today ✓" : "Mark today's Word done"}</button>
    </div>
    ${pastEntries()}
    <p class="tiny" style="text-align:center;margin-top:18px">Scripture from the World English Bible (public domain).</p>
  `;
  const v = $("#vtxt");
  getVerse(ref).then(t => { v.textContent = t; v.classList.remove("loading"); })
    .catch(() => { v.innerHTML = `Couldn't load the verse. <a style="color:var(--ink)" href="https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}&version=WEB" target="_blank" rel="noopener">Open ${esc(ref)}</a>`; v.classList.remove("loading"); });

  document.querySelectorAll("[data-wd]").forEach(b => b.onclick = () => { wordDay = Number(b.dataset.wd); renderWord(); });
  const fields = {jg:"grat", j1:"i1", j2:"i2", j3:"i3", jn2:"notes"};
  Object.keys(fields).forEach(id => $("#"+id).addEventListener("input", e => {
    S.journal[k] = Object.assign({grat:"",i1:"",i2:"",i3:"",notes:""}, S.journal[k] || {});
    S.journal[k][fields[id]] = e.target.value; save();
    $("#saved").textContent = "Saved";
  }));
  $("#readDone").onclick = () => {
    S.read[k] = true;
    S.done[k] = S.done[k] || {};
    blocksFor(new Date()).filter(b => b.link === "word").forEach(b => S.done[k][b.id] = true);
    save(); renderWord(); toast("Word marked done");
  };
}
function pastEntries(){
  const keys = Object.keys(S.journal).filter(k => k !== today()).sort().reverse().slice(0, 7)
    .filter(k => { const j = S.journal[k]; return j.grat || j.i1 || j.notes; });
  if (!keys.length) return "";
  return `<details class="glass panel"><summary><h3>Past entries</h3></summary><div style="margin-top:10px">${keys.map(k => {
    const j = S.journal[k];
    return `<div style="padding:10px 0;border-top:1px solid var(--line2)"><div class="small">${parseKey(k).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</div>${j.grat ? `<div style="margin-top:4px">${esc(j.grat)}</div>` : ""}${[j.i1,j.i2,j.i3].filter(Boolean).length ? `<div class="small" style="margin-top:4px">${[j.i1,j.i2,j.i3].filter(Boolean).map(esc).join(" / ")}</div>` : ""}</div>`;
  }).join("")}</div></details>`;
}

/* ── TRAIN ── */
let trainDow = null;
function programWeek(){
  if (!S.train.phaseStart) return 1;
  return Math.max(1, Math.floor((parseKey(today()) - parseKey(S.train.phaseStart)) / (7*864e5)) + 1);
}
function demoUrl(name){ return "https://www.youtube.com/results?search_query=" + encodeURIComponent(name + " proper form tutorial"); }
function exRow(ex, k, idx){
  const id = idx === "prep" ? "prep:" + ex.n : ex.n;
  const done = (S.train.exDone[k] || {})[id];
  const load = S.train.loads[id] || "";
  return `<div class="ex">
    <div class="ex-head">
      <div style="flex:1"><div class="name">${esc(ex.n)}</div><div class="sets">${esc(ex.s)}</div></div>
      <button class="check${done ? " on" : ""}" data-ex="${esc(id)}" aria-label="Mark ${esc(ex.n)} done">${CHECK}</button>
    </div>
    <div class="cue">${esc(ex.c)}</div>
    <div class="tools">
      <a href="${demoUrl(ex.n)}" target="_blank" rel="noopener"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>Watch demo</a>
      ${idx !== "prep" ? `<input data-load="${esc(id)}" value="${esc(load)}" placeholder="Weight used" inputmode="text" aria-label="Weight used for ${esc(ex.n)}">` : ""}
    </div>
  </div>`;
}
function renderTrain(){
  const ph = S.train.phase, P = PHASES[ph];
  const d = new Date(), dow = trainDow == null ? d.getDay() : trainDow;
  const key = WEEK_SESSIONS[dow];
  const k = today();
  let sess;
  if (key === "rest") sess = REST_SESSION;
  else if (key === "walk") sess = WALK_SESSION;
  else sess = SESSIONS[ph][key];
  const wk = programWeek();
  const runIdx = Math.min(wk - 1, (sess.run || []).length - 1);
  const exDone = S.train.exDone[k] || {};
  const doneN = sess.ex.filter(e => exDone[e.n]).length;
  const gate = S.train.gate[ph] || {};
  const gateDone = P.gate.length && P.gate.every((_, i) => gate[i]);
  const body = S.body.slice(-6);
  const first = S.body[0], last = S.body[S.body.length - 1];

  $("#s-train").innerHTML = `
    <div class="top"><div class="brand">Carl<span>OS</span></div><div class="date">${S.train.phaseStart ? "Week " + wk + " of " + P.name : "Not started"}</div></div>
    <div class="hero" style="margin-bottom:14px">
      <div class="lead">${P.weeks}</div>
      <h1>${esc(P.name)}</h1>
      <div class="remain">${esc(P.goal)}</div>
    </div>
    <div class="glass seg-ctl" role="tablist">${PHASES.map((p,i) => `<button data-ph="${i}" class="${i === ph ? "on" : ""}">${p.name}</button>`).join("")}</div>
    ${!S.train.phaseStart ? `<button class="btn primary" id="startPh" style="margin-bottom:14px">Start ${P.name} today</button>` : ""}

    <div class="days" style="margin-bottom:12px">${DOW.map((n,i) => `<button data-tdow="${i}" class="${i === dow ? "on" : ""}">${n}</button>`).join("")}</div>

    <div class="glass group">
      <div class="group-head"><h3 style="color:var(--ink)">${esc(sess.title)}</h3><span>${doneN}/${sess.ex.length}</span></div>
      ${sess.run ? `<div class="runplan" style="padding:4px 6px 10px">${sess.run.map((r,i) => `<div class="${ph < 2 && i === runIdx ? "cur" : ""}">${esc(r)}</div>`).join("")}</div>` : ""}
      ${sess.ex.map(e => exRow(e, k, (key === "walk" || key === "rest") ? "prep" : "")).join("")}
    </div>

    <button class="btn" id="logWorkoutTop" style="margin-bottom:14px">${S.workouts.find(w => w.d === k) ? "Logged today: " + esc(S.workouts.find(w => w.d === k).what) + " · edit" : "Trained something different today? Log it"}</button>
    ${key !== "rest" && key !== "walk" ? `<details class="glass panel"><summary><div><h3>10-minute prep</h3><div class="small">Before every session. Loosens hips, back, and shoulder.</div></div></summary><div style="margin:8px -14px -6px">${PREP.map(e => exRow(e, k, "prep")).join("")}</div></details>` : ""}

    <div class="glass panel">
      <h3>Rules that keep you healthy</h3>
      <div class="small" style="margin-top:8px;line-height:1.6">Add weight when every set reaches the top of the rep range with 1–2 reps to spare. Shoulder pain above 3 out of 10 or any pinching: stop that movement, swap to the neutral-grip or landmine version, and get it checked if it lasts.</div>
    </div>

    ${P.gate.length ? `<div class="section-title"><h2>Ready for ${PHASES[ph+1].name}?</h2></div>
    <div class="glass panel gate">${P.gate.map((g,i) => `<label><input type="checkbox" data-gate="${i}"${gate[i] ? " checked" : ""}>${esc(g)}</label>`).join("")}
      ${gateDone ? `<button class="btn primary" id="nextPh" style="margin-top:10px">Move to ${PHASES[ph+1].name}</button>` : `<div class="tiny" style="margin-top:6px">Check all of these before moving up.</div>`}
    </div>` : ""}

    <div class="section-title"><h2>Workouts</h2><span class="tiny">${weekWorkouts()} this week</span></div>
    <div class="glass panel">
      ${S.workouts.length ? S.workouts.slice(-5).reverse().map(w => `<button class="wo" data-wo="${w.d}"><span><b>${esc(w.what)}</b><span class="tiny" style="display:block">${parseKey(w.d).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}${w.mins ? " · " + w.mins + " min" : ""}${w.note ? " · " + esc(w.note) : ""}</span></span><span class="tiny">Edit</span></button>`).join("") : `<p class="small" style="margin-bottom:12px">Trained something other than today's plan? Log it here so the week still counts.</p>`}
      <button class="btn" id="logWorkout" style="margin-top:10px">Log a workout</button>
    </div>

    <div class="section-title"><h2>Body check-in</h2><span class="tiny">Once a week, same morning</span></div>
    <div class="glass panel">
      ${S.body.length ? `<div class="stat" style="margin-bottom:14px">
        <div><span class="small">Weight</span><b>${esc(last.w)} lb</b><span class="tiny">${first !== last && first.w && last.w ? ((last.w - first.w) > 0 ? "+" : "") + (last.w - first.w).toFixed(1) + " since start" : "Starting point"}</span></div>
        <div><span class="small">Waist</span><b>${last.waist ? esc(last.waist) + " in" : "–"}</b><span class="tiny">${first.waist && last.waist && first !== last ? ((last.waist - first.waist) > 0 ? "+" : "") + (last.waist - first.waist).toFixed(1) + " since start" : "Best fat-loss signal"}</span></div>
      </div>` : `<p class="small" style="margin-bottom:12px">Log weight and waist once a week. Waist at the belly button tracks fat loss better than the scale alone.</p>`}
      <div class="row"><input id="bw" inputmode="decimal" placeholder="Weight (lb)"><input id="bwa" inputmode="decimal" placeholder="Waist (in)"></div>
      <button class="btn" id="logBody" style="margin-top:10px">Log check-in</button>
      ${body.length > 1 ? `<div style="margin-top:12px">${body.slice().reverse().map(b => `<div class="tiny" style="padding:4px 2px;display:flex;justify-content:space-between"><span>${parseKey(b.d).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span><span>${esc(b.w)} lb${b.waist ? " · " + esc(b.waist) + " in" : ""}</span></div>`).join("")}</div>` : ""}
    </div>
  `;

  document.querySelectorAll("[data-ph]").forEach(b => b.onclick = () => {
    const v = Number(b.dataset.ph);
    if (v === S.train.phase) return;
    S.train.phase = v; S.train.phaseStart = S.train.phaseStart ? today() : null; save(); renderTrain();
  });
  if ($("#startPh")) $("#startPh").onclick = () => { S.train.phaseStart = today(); save(); renderTrain(); toast(P.name + " started"); };
  document.querySelectorAll("[data-tdow]").forEach(b => b.onclick = () => { trainDow = Number(b.dataset.tdow); renderTrain(); });
  document.querySelectorAll("[data-ex]").forEach(b => b.onclick = () => {
    S.train.exDone[k] = S.train.exDone[k] || {};
    S.train.exDone[k][b.dataset.ex] = !S.train.exDone[k][b.dataset.ex];
    const all = sess.ex.every(e => S.train.exDone[k][e.n]);
    if (all && dow === d.getDay()){
      S.done[k] = S.done[k] || {};
      blocksFor(d).filter(x => x.gym || x.link === "train").forEach(x => S.done[k][x.id] = true);
      toast("Session done");
    }
    save(); renderTrain();
  });
  document.querySelectorAll("[data-load]").forEach(inp => inp.addEventListener("change", () => { S.train.loads[inp.dataset.load] = inp.value.trim(); save(); }));
  document.querySelectorAll("[data-gate]").forEach(c => c.onchange = () => {
    S.train.gate[ph] = S.train.gate[ph] || {}; S.train.gate[ph][c.dataset.gate] = c.checked; save(); renderTrain();
  });
  if ($("#nextPh")) $("#nextPh").onclick = () => { S.train.phase = ph + 1; S.train.phaseStart = today(); save(); renderTrain(); toast(PHASES[ph+1].name + " started"); };
  $("#logWorkout").onclick = () => openWorkoutSheet();
  $("#logWorkoutTop").onclick = () => openWorkoutSheet(S.workouts.find(w => w.d === k) ? k : undefined);
  document.querySelectorAll("[data-wo]").forEach(b => b.onclick = () => openWorkoutSheet(b.dataset.wo));
  $("#logBody").onclick = () => {
    const w = parseFloat($("#bw").value), wa = parseFloat($("#bwa").value);
    if (!w){ $("#bw").focus(); toast("Add your weight"); return; }
    S.body = S.body.filter(b => b.d !== today());
    S.body.push({d:today(), w, waist: wa || null});
    save(); renderTrain(); toast("Logged");
  };
}

function weekWorkouts(){
  const d = new Date(); const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
  return S.workouts.filter(w => parseKey(w.d) >= start).length;
}

/* ── US ── */
function nextFirstFriday(from){
  const f = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  for (let m = 0; m < 3; m++){
    const base = new Date(f.getFullYear(), f.getMonth() + m, 1);
    const off = (5 - base.getDay() + 7) % 7;
    const ff = new Date(base.getFullYear(), base.getMonth(), 1 + off);
    if (ff >= f) return ff;
  }
}
let ideaIdx = null, qShown = null;
function renderUs(){
  const d = new Date();
  const ff = nextFirstFriday(d);
  const days = Math.round((ff - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5);
  const mk = ff.getFullYear() + "-" + pad(ff.getMonth()+1);
  const chk = S.dateCheck[mk] || {};
  if (ideaIdx == null) ideaIdx = (ff.getMonth() + ff.getFullYear()) % DATE_IDEAS.length;
  if (qShown == null) qShown = S.qIndex % QUESTIONS.length;
  const tonight = TONIGHT[planIndex(d) % TONIGHT.length];
  const isSun = d.getDay() === 0;
  const items = ["Pick the idea together or plan a surprise","Book it or put it on both calendars","Plan the evening start time","Phone in your pocket the whole night"];

  $("#s-us").innerHTML = `
    <div class="top"><div class="brand">Carl<span>OS</span></div><div class="date">You and your wife</div></div>
    <div class="date-hero">
      <div class="small" style="color:var(--ink)">Date night · ${ff.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
      <div class="big" style="margin:10px 0 2px">${days === 0 ? "Tonight" : days + (days === 1 ? " day" : " days")}</div>
      <div class="small">${days === 0 ? "Enjoy it." : "First Friday of every month."}</div>
      <div class="idea" style="margin-top:16px">${esc(DATE_IDEAS[ideaIdx])}</div>
      <div class="row"><button class="btn" id="shuffle">Another idea</button></div>
      <div class="list-check" style="margin-top:14px">${items.map((t,i) => `<label><input type="checkbox" data-dc="${i}"${chk[i] ? " checked" : ""}>${t}</label>`).join("")}</div>
    </div>

    <div class="section-title"><h2>Tonight, 9pm</h2></div>
    <div class="glass panel"><div class="idea" style="margin:0">${esc(tonight)}</div></div>

    <div class="section-title"><h2>Ask her</h2><button class="link" id="nextQ">Next question</button></div>
    <div class="glass panel"><div class="qcard">${esc(QUESTIONS[qShown])}</div></div>

    <div class="section-title"><h2>State of Us</h2><span class="tiny">${isSun ? "Tonight at 6" : "Sundays at 6"}</span></div>
    <div class="glass panel">
      <p class="small" style="margin-bottom:6px">Fifteen minutes. Each of you finishes these four. Listen first, fix nothing.</p>
      ${STATE_OF_US.map(p => `<div class="prompt">${esc(p)}</div>`).join("")}
    </div>

    <div class="section-title"><h2>Every evening</h2></div>
    <div class="glass group">${EVENING.map(b => `<div class="blk" style="cursor:default"><div class="bar" style="background:${CAT[b.cat]}"></div><div class="t">${fmt(b.s)}</div><div class="body"><div class="ttl">${esc(b.title)}</div><div class="sub">${esc(b.sub)}</div></div></div>`).join("")}</div>
    <p class="tiny" style="padding:4px 6px">Same bedtime every night is the most reliable way to fall asleep faster. Lights out at 10 gets you 7h45 before the alarm.</p>
  `;
  $("#shuffle").onclick = () => { ideaIdx = (ideaIdx + 1) % DATE_IDEAS.length; renderUs(); };
  $("#nextQ").onclick = () => { S.qIndex = (S.qIndex + 1) % QUESTIONS.length; qShown = S.qIndex; save(); renderUs(); };
  document.querySelectorAll("[data-dc]").forEach(c => c.onchange = () => { S.dateCheck[mk] = S.dateCheck[mk] || {}; S.dateCheck[mk][c.dataset.dc] = c.checked; save(); });
}

/* ── COACH ── */
function contextText(){
  const d = new Date(), k = today(), t = dayType(d), info = typeInfo(t);
  const blocks = blocksFor(d), done = S.done[k] || {};
  const {week, day} = verseFor(d), th = THEMES[week];
  const J = S.journal[k] || {};
  const open = S.jobs.filter(j => j.stage !== "done");
  const lines = [
    "Today's context from CarlOS — " + d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}) + ", " + d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}),
    "Day type: " + info.label + (S.eveGym[k] ? " (gym moved to evening)" : "") + (isFirstFriday(d) ? " — date night tonight" : ""),
    "Done: " + (blocks.filter(b => done[b.id]).map(b => b.title).join(", ") || "nothing yet"),
    "Still ahead: " + (blocks.filter(b => !done[b.id] && mins(b.e) > nowMin()).map(b => fmt(b.s) + " " + b.title).join(", ") || "nothing"),
    "Word: " + th.r[day] + " (theme: " + th.t + ")",
    [J.i1, J.i2, J.i3].filter(Boolean).length ? "My intentions: " + [J.i1, J.i2, J.i3].filter(Boolean).join(" / ") : "Intentions: not written yet",
    "Brand course: " + S.course.name + " — " + S.course.done + (S.course.total ? " of " + S.course.total : "") + " lessons done" + (S.course.notes.length ? "; last takeaway: " + S.course.notes[S.course.notes.length-1].t : ""),
    S.workouts.find(w => w.d === k) ? "Workout logged today: " + S.workouts.find(w => w.d === k).what + (S.workouts.find(w => w.d === k).note ? " (" + S.workouts.find(w => w.d === k).note + ")" : "") : "",
    eventsOn(d).length ? "Events today: " + eventsOn(d).map(ev => fmt(ev.s) + " " + ev.title).join(", ") : "",
    "Training: " + PHASES[S.train.phase].name + (S.train.phaseStart ? ", week " + programWeek() : ", not started"),
    S.body.length ? "Last check-in: " + S.body[S.body.length-1].w + " lb" + (S.body[S.body.length-1].waist ? ", waist " + S.body[S.body.length-1].waist + " in" : "") : "",
    open.length ? "Open jobs: " + open.map(j => j.client + (j.what ? " (" + j.what + ")" : "") + " — " + stageLabel(j.stage).toLowerCase() + ", " + dueText(j.due).txt.toLowerCase()).join("; ") : "Open jobs: none logged"
  ].filter(Boolean);
  return lines.join("\n");
}
async function copy(text){
  try { await navigator.clipboard.writeText(text); return true; }
  catch(e){
    const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand("copy"); } catch(_){}
    ta.remove(); return ok;
  }
}
function renderCoach(){
  const has = !!S.coachLink;
  $("#s-coach").innerHTML = `
    <div class="top"><div class="brand">Carl<span>OS</span></div><div class="date">Coach</div></div>
    <div class="hero">
      <div class="lead">Your coach lives in a Claude project</div>
      <h1>${has ? "Talk it through" : "Set up your coach"}</h1>
      <div class="remain">${has ? "Tap below. Today's context is copied first, so paste it as your opening message." : "Three steps, about two minutes. You only do this once."}</div>
    </div>
    ${has ? `<a class="btn primary" id="openCoach" href="${esc(S.coachLink)}" target="_blank" rel="noopener" style="display:block;text-align:center;text-decoration:none;margin-bottom:10px">Copy today's context and open coach</a>
      <div class="section-title"><h2>What gets copied</h2></div>
      <pre class="ctx">${esc(contextText())}</pre>` : ""}

    <details class="glass panel" ${has ? "" : "open"} style="margin-top:14px">
      <summary><h3>${has ? "Coach setup" : "Setup"}</h3></summary>
      <div style="margin-top:8px">
        <div class="step"><div class="n">1</div><div><h3>Create the project</h3><div class="small">In the Claude app, start a new project and name it "CarlOS Coach".</div></div></div>
        <div class="step"><div class="n">2</div><div style="flex:1"><h3>Add the instructions</h3><div class="small" style="margin-bottom:10px">Copy these and paste them into the project's instructions.</div><button class="btn" id="copyInstr">Copy coach instructions</button></div></div>
        <div class="step"><div class="n">3</div><div style="flex:1"><h3>Paste the project link here</h3><div class="small" style="margin-bottom:10px">Open the project, tap Share or copy the link from your browser, then paste it.</div>
          <input id="clink" value="${esc(S.coachLink)}" placeholder="https://claude.ai/project/…"><button class="btn" id="saveLink" style="margin-top:8px">Save link</button></div></div>
      </div>
    </details>

    <details class="glass panel">
      <summary><h3>Back up your data</h3></summary>
      <p class="small" style="margin:8px 0 12px">Everything is stored on this phone. Copy a backup now and then, and paste it back if you ever reinstall.</p>
      <div class="row"><button class="btn" id="exportData">Copy backup</button><button class="btn ghost" id="importData">Restore</button></div>
    </details>
  `;
  if (has) $("#openCoach").addEventListener("click", () => { try { navigator.clipboard.writeText(contextText()).catch(() => {}); } catch(e){} toast("Context copied. Paste it as your first message."); });
  $("#copyInstr").onclick = async () => { toast(await copy(COACH_INSTRUCTIONS) ? "Instructions copied" : "Couldn't copy"); };
  $("#saveLink").onclick = () => {
    const v = $("#clink").value.trim();
    if (v && !/^https?:\/\//.test(v)){ toast("Paste the full link starting with https"); return; }
    S.coachLink = v; save(); renderCoach(); toast(v ? "Link saved" : "Link removed");
  };
  $("#exportData").onclick = async () => { toast(await copy(JSON.stringify(S)) ? "Backup copied" : "Couldn't copy"); };
  $("#importData").onclick = () => {
    openSheet(`<h2 style="margin-bottom:10px">Restore a backup</h2><p class="small" style="margin-bottom:10px">Paste the backup text. This replaces what's on this phone.</p>
      <textarea id="imp" rows="6"></textarea><button class="btn primary" id="doImp" style="margin-top:12px">Restore</button>`);
    $("#doImp").onclick = () => {
      try { const v = JSON.parse($("#imp").value); S = Object.assign({}, DEF, v); S.moves = v.moves || {}; S.course = Object.assign({}, DEF.course, v.course || {}); S.train = Object.assign({}, DEF.train, v.train || {}); save(); closeSheet(); refresh(); toast("Restored"); }
      catch(e){ toast("That backup text isn't valid"); }
    };
  };
}

/* ── sheet + nav ── */
function openSheet(html){ $("#sheet-body").innerHTML = html; $("#scrim").classList.add("on"); }
function closeSheet(){ $("#scrim").classList.remove("on"); }
$("#scrim").addEventListener("click", e => { if (e.target.id === "scrim") closeSheet(); });

let tab = "today";
const RENDER = {today:renderToday, word:renderWord, train:renderTrain, us:renderUs, coach:renderCoach};
function go(name){
  tab = name;
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === "s-" + name));
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("on", b.dataset.tab === name));
  if (name === "train") trainDow = null;
  if (name === "word") wordDay = null;
  RENDER[name]();
  $("#s-" + name).scrollTop = 0;
}
function refresh(){ RENDER[tab](); }
document.querySelectorAll("#nav button").forEach(b => b.onclick = () => go(b.dataset.tab));

paintSky();
renderToday();
setInterval(() => { paintSky(); if (tab === "today" && keyOf(viewDate) === today()) renderToday(); }, 60000);
document.addEventListener("visibilitychange", () => { if (!document.hidden){ paintSky(); if (keyOf(viewDate) !== today() && tab === "today") viewDate = new Date(); refresh(); } });

if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
})();
