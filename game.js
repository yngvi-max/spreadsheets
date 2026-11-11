(function(){
  'use strict';
  // ---- Deck -------------------------------------------------------------
  // effects: v velocity, d debt (up is bad), s sanity, t trust, fn [function names]
  const DECK = [
    {who:"Rakel, Support", chan:"support@ · ticket #4471", av:"RS",
     text:'Customer says their model shows <code>43466</code> where a date should be. Is that a bug?',
     a:{l:"Explain that dates have been integers since 1900. Attach a diagram.", v:5, s:5, t:-10, r:"They read the diagram. They did not enjoy the diagram."},
     b:{l:"Implement date serials and number formats properly.", v:-10, d:5, t:10, fn:["DATE","YEAR","TEXT"], r:"Dates work. Except the ones before 1900. And times. And the 1904 Mac date system."}},
    {who:"Bjarki, QA", chan:"#engine-bugs", av:"BQ",
     text:'Why does <code>29 February 1900</code> exist in our engine? That day never happened.',
     a:{l:"Because Excel has it. Keep the bug for compatibility.", d:10, t:5, s:-5, r:"Compatible with a 1983 Lotus 1-2-3 bug. You have become the thing you swore to replace."},
     b:{l:"Remove it. We are better than Lotus 1-2-3.", t:-10, s:5, v:-5, r:"Every date after Feb 1900 in every customer sheet is now off by one. Support has stopped answering your DMs."}},
    {who:"Dagur, Sales", chan:"#sales-wins", av:"DS",
     text:'Prospect asked if we support <code>VLOOKUP</code>. I said yes. Then they asked about <code>XLOOKUP</code>, <code>INDEX</code> and <code>MATCH</code>. I said yes again.',
     a:{l:"Implement VLOOKUP only. Hide the rest behind 'coming soon'.", v:-5, t:-5, fn:["VLOOKUP"], r:"VLOOKUP ships. Approximate match mode is 'approximately' correct."},
     b:{l:"Implement all four. Properly.", v:-15, s:-10, t:10, fn:["VLOOKUP","XLOOKUP","INDEX","MATCH"], r:"Four functions. Three weeks. One engineer asking about the sabbatical policy."}},
    {who:"Herr Müller", chan:"support@ · Frankfurt", av:"HM",
     text:'Your CSV import is broken. Our numbers use <code>1.234,56</code> and our separator is <code>;</code>, as is normal.',
     a:{l:"Support one locale. Ours.", v:5, t:-10, r:"Frankfurt churns. So does Paris, Madrid and, oddly, Reykjavík."},
     b:{l:"Support every locale. Decimals, separators, date orders, all of it.", v:-15, d:10, t:10, r:"Locales work. You now know what a 'buddhist calendar' is and wish you didn't."}},
    {who:"PagerDuty", chan:"#ops-alerts · 03:14", av:"!!",
     text:'A user typed <code>=A1</code> into cell <code>A1</code>. The server has been at 100% CPU for six minutes.',
     a:{l:"Add a timeout. Ship it.", v:5, d:10, t:-5, r:"Recalc now gives up after 5 seconds. Silently. Customers get half a model and no error."},
     b:{l:"Build proper cycle detection in the dependency graph.", v:-15, d:-10, s:-5, t:5, r:"Cycles caught. You learned what Tarjan's algorithm is at 4am."}},
    {who:"Finance team, Nordfin", chan:"support@ · priority", av:"NF",
     text:'Attached is our monthly model. 40 MB, 14 sheets, 3 pivot tables and a macro named <code>DO_NOT_RUN</code>. It needs to load in under a second.',
     a:{l:"Load it lazily and hope nobody scrolls down.", v:5, d:10, t:-5, r:"Somebody scrolled down."},
     b:{l:"Rewrite the parser in Rust.", v:-20, s:10, d:-5, r:"It's fast now. The team is thrilled. The roadmap is not."}},
    {who:"Rakel, Support", chan:"support@ · ticket #4502", av:"RS",
     text:'Customer says <code>0.1 + 0.2</code> returns <code>0.30000000000000004</code>. Their exact words: "Excel doesn’t do this."',
     a:{l:"Explain IEEE 754 floating point in a 900-word email.", s:5, t:-10, r:"The customer replied 'ok' and then never again."},
     b:{l:"Copy Excel's 15-significant-digit display rounding.", v:-5, d:5, t:10, r:"Numbers look right. They are still wrong underneath, just like in Excel. Compatibility achieved."}},
    {who:"Sindri, Junior dev", chan:"#engine", av:"SJ",
     text:'Someone merged cells across a filtered range. Half the team has gone quiet.',
     a:{l:"Ban merged cells in the product entirely.", s:10, t:-10, r:"Peace in the codebase. War in the customer forum."},
     b:{l:"Support merged cells. All the edge cases.", v:-10, s:-10, d:10, t:5, r:"Merged cells work. Copy-paste of merged cells does not. Nobody knows what it should do."}},
    {who:"Gunnar, CTO", chan:"DM", av:"GC",
     text:'Why is the formula parser taking so long? Just parse it with a regex.',
     a:{l:"Respect the CTO.", v:10, d:20, s:-5, r:"The regex is 1,400 characters long. It has a name now. Its name is Kevin."},
     b:{l:"Write a real tokenizer and recursive-descent parser.", v:-15, d:-10, s:5, fn:["IF","AND","OR"], r:"You have a parser. It even handles <code>=--++-A1</code>. Nobody asked, but it does."}},
    {who:"Katrín, Product", chan:"#planning", av:"PM",
     text:'The roadmap wants dynamic arrays. Spill ranges, <code>FILTER</code>, <code>UNIQUE</code>, <code>SORT</code>, the works.',
     a:{l:"Spill? Into the next quarter.", v:5, t:-10, r:"Deferred. The roadmap now has a section called 'Q5'."},
     b:{l:"Implement dynamic arrays.", v:-20, s:-10, t:15, fn:["FILTER","UNIQUE","SORT","SEQUENCE"], r:"Arrays spill. So does the intern's coffee, onto the one laptop with the working build."}},
    {who:"Finance team, Nordfin", chan:"support@", av:"NF",
     text:'Why does our <code>IRR</code> return <code>#NUM!</code>? It works in Excel.',
     a:{l:"Because Newton-Raphson did not converge. Neither did I.", s:-5, t:-10, r:"Ticket closed as 'won't fix'. Ticket reopened as 'escalated'."},
     b:{l:"Match Excel's guess and iteration behaviour exactly.", v:-10, t:10, fn:["IRR","XIRR","NPV"], r:"IRR converges. You have read a 2003 forum thread about it 11 times."}},
    {who:"Sindri, Junior dev", chan:"#engine", av:"SJ",
     text:'Empty cells: are they 0, or <code>""</code>, or null? <code>SUM</code> treats them as 0, <code>COUNTA</code> skips them, <code>=A1=""</code> is TRUE and <code>=A1=0</code> is also TRUE.',
     a:{l:"Special-case it wherever it breaks.", v:5, d:10, r:"There are now 34 special cases. They are not consistent with each other."},
     b:{l:"Model the blank cell as a proper first-class type.", v:-10, d:-10, s:5, r:"Blank is a type now. It has a spec. The spec is longer than the parser."}},
    {who:"Dagur, Sales", chan:"#sales-wins", av:"DS",
     text:'Prospect’s sheet has <code>=TEXT(A1,"[$-409]dddd, mmmm dd, yyyy")</code> in it. What does that do? Also I said we support it.',
     a:{l:"What.", s:-10, t:-10, r:"You stared at the format string for a long time. It stared back."},
     b:{l:"Implement number format codes. All of them.", v:-20, d:5, t:15, fn:["TEXT"], r:"Format codes work. Including the ones for Thai numerals and elapsed hours. You are tired."}},
    {who:"Sindri, Junior dev", chan:"#engine · PR #212", av:"SJ",
     text:'I wrote a <code>SUM</code> function! It takes two numbers and adds them.',
     a:{l:"Merge it. Progress is progress.", d:10, t:-5, fn:["SUM"], r:"SUM ships. SUM(A1:A10) crashes. It's on the list."},
     b:{l:"Explain ranges, variadic args, nested arrays, booleans, and text that looks like numbers.", v:-5, s:-5, d:-5, fn:["SUM"], r:"Sindri understands SUM now. Sindri would like to talk about the sabbatical policy."}},
    {who:"Rakel, Support", chan:"support@ · ticket #4533", av:"RS",
     text:'Customer sheet references <code>[Budget2019.xlsx]Sheet1!A1</code>. The file is on someone’s laptop. In Akureyri.',
     a:{l:"External references are out of scope.", s:5, t:-10, r:"Out of scope. Also out of a customer."},
     b:{l:"Implement external links with a cache and a 'refresh' prompt.", v:-15, d:10, t:5, r:"Works, as long as the laptop in Akureyri is switched on."}},
    {who:"PagerDuty", chan:"#ops-alerts", av:"!!",
     text:'Full recalculation of a 200,000-cell sheet takes 40 seconds. Every keystroke triggers a full recalc.',
     a:{l:"Cache everything. Invalidate nothing.", v:5, d:15, t:-5, r:"Blazing fast. Occasionally shows last Tuesday's numbers."},
     b:{l:"Build a dependency graph with incremental recalc.", v:-20, d:-15, s:-5, t:10, r:"Recalc is instant. You now have opinions about topological sorting."}},
    {who:"Katrín, Product", chan:"#planning", av:"PM",
     text:'Investor demo Thursday. They want to upload their own cap table. Live.',
     a:{l:"Demo on a sheet we built ourselves. Steer them away from the upload button.", s:-5, t:5, r:"Demo went great. The investor asked to try their own file. You changed the subject to the weather."},
     b:{l:"Stay up all night and hard-code their cap table.", s:-15, d:10, t:10, r:"It worked. Their cap table is now in your source code. Legal has questions."}},
    {who:"Bjarki, QA", chan:"#engine-bugs", av:"BQ",
     text:'<code>=1/0</code> correctly shows <code>#DIV/0!</code>. But <code>=IFERROR(1/0,"ok")</code> crashes the whole recalc.',
     a:{l:"Wrap everything in try/catch.", v:5, d:10, r:"Nothing crashes any more. Nothing reports errors either. Serenity."},
     b:{l:"Make errors first-class values that flow through formulas.", v:-10, d:-10, fn:["IFERROR","ISERROR","IFNA"], r:"Errors propagate like Excel's. You've written a taxonomy of seven error types and one of them is <code>#SPILL!</code>."}},
    {who:"Rakel, Support", chan:"support@ · ticket #4561", av:"RS",
     text:'Customer typed <code>5%</code> and got <code>5</code>. Also typed <code>1/2</code> and got January 2nd.',
     a:{l:"It's 0.05. You're welcome.", t:-5, r:"Customer has started typing 0.05 manually. Customer is unhappy about it."},
     b:{l:"Implement input parsing for percentages, currency, dates, times, fractions and scientific notation.", v:-15, d:5, t:10, r:"Typing works like Excel now. Including the part where <code>MAR1</code> becomes a date. Biologists hate it."}},
    {who:"Hrönn, HR", chan:"DM", av:"HR",
     text:'The engineer who understood the formula parser has resigned. Their last commit message was "good luck".',
     a:{l:"Promote the intern.", v:-10, s:-10, d:10, r:"Sindri owns the parser now. Sindri has opened a ticket titled 'what is a parser'."},
     b:{l:"Open a hiring search. Three months, minimum.", v:-20, s:5, r:"The job ad says 'must love spreadsheets'. Applicants: two. One is a spreadsheet."}},
    {who:"Finance team, Nordfin", chan:"support@", av:"NF",
     text:'Conditional formatting isn’t rendering. Red cells are meant to be red.',
     a:{l:"That's a rendering problem, not an engine problem.", s:5, t:-5, r:"Correct. Also, nobody else is building the renderer."},
     b:{l:"So now we also need a renderer. Fine.", v:-20, d:10, t:5, r:"You are building a spreadsheet UI now. Column widths are in 'character units'. Nobody knows what a character unit is."}},
    {who:"Sindri, Junior dev", chan:"#engine", av:"SJ",
     text:'<code>=TRUE+1</code> is 2. <code>="TRUE"+1</code> is <code>#VALUE!</code>. <code>="1"+1</code> is 2. <code>=SUM("1")</code> is 1 but <code>=SUM(A1)</code> where A1 is "1" is 0. Help.',
     a:{l:"Coerce everything to numbers. What could go wrong.", v:5, d:15, t:-5, r:"Everything is a number now. Including the customer's names column."},
     b:{l:"Implement Excel's type coercion rules exactly.", v:-15, s:-10, d:-5, t:10, r:"Coercion matches Excel. You have a 40-row truth table on the wall and you dream about it."}},
    {who:"Rakel, Support", chan:"support@ · ticket #4590", av:"RS",
     text:'Customer wants iterative calculation enabled so their circular reference "works". On purpose. For a bonus pool.',
     a:{l:"No.", s:10, t:-10, r:"Firm boundary. Customer has switched to doing the bonus pool 'by feel'."},
     b:{l:"Add max-iterations and max-change settings like Excel.", v:-10, d:5, t:5, r:"Circular references now converge. Occasionally. The bonus pool is 'approximately' allocated."}},
    {who:"Finance team, Nordfin", chan:"support@ · priority", av:"NF",
     text:'Can we get <code>NPV</code>, <code>PMT</code> and something called <code>XNPV</code> by Friday?',
     a:{l:"Copy the formulas off Wikipedia.", d:10, t:-5, fn:["PMT","PV","FV"], r:"Shipped Friday. The sign convention is backwards. Their mortgage is now paying them."},
     b:{l:"Match Excel's day-count and sign conventions.", v:-10, t:10, fn:["PMT","PV","FV","XNPV"], r:"Shipped the Friday after. Correct to the cent. Nobody noticed, which is the point."}},
    {who:"Katrín, Product", chan:"#planning", av:"PM",
     text:'Customer uses Google Sheets AND Excel. Sheets has <code>ARRAYFORMULA</code>, Excel doesn’t. Excel has <code>XLOOKUP</code>, old Sheets didn’t.',
     a:{l:"Pick Excel. It's the standard.", v:5, t:-5, r:"Chose Excel. Half the customer's sheets are now 'legacy'."},
     b:{l:"Support both dialects.", v:-10, d:15, t:5, r:"Both dialects work. Mostly. There is a function that means two different things depending on who saved the file."}},
    {who:"Rakel, Support", chan:"support@ · ticket #4611", av:"RS",
     text:'<code>=TODAY()</code> gives a different answer for our Reykjavík office and our Sydney office. They are arguing about what day it is.',
     a:{l:"Use the server clock. The server is in Frankfurt.", d:5, t:-5, r:"Everyone is now on Frankfurt time. Frankfurt is delighted."},
     b:{l:"Timezone-aware volatile functions with correct recalc.", v:-10, t:5, fn:["TODAY","NOW"], r:"Everyone gets their own today. Volatile functions recalc on every change. CPU is warm."}},
    {who:"Ásta, Marketing", chan:"#website", av:"AM",
     text:'Can we write "Excel-compatible" on the website? It tests well.',
     a:{l:"Yes.", t:10, d:10, s:-10, r:"Sign-ups doubled. So did support tickets. Each one begins 'you said Excel-compatible'."},
     b:{l:"Say 'inspired by spreadsheets'.", t:-5, s:5, r:"Honest. Nobody clicked."}},
    {who:"PagerDuty", chan:"#ops-alerts", av:"!!",
     text:'Two users edited the same cell at the same moment. The cell now contains both values, concatenated.',
     a:{l:"Last write wins.", v:5, d:10, t:-5, r:"Simple. Somebody's quarterly forecast lost. Not yours, thankfully."},
     b:{l:"Build a proper multiplayer sync layer with conflict resolution.", v:-20, s:-10, t:5, r:"Real-time collaboration works. Your engine is now also a distributed system. Congratulations?"}},
    {who:"Finance team, Nordfin", chan:"support@", av:"NF",
     text:'Our sheet has 1,048,576 rows. It is mostly empty, but it has to open.',
     a:{l:"Allocate a two-dimensional array. It's fine.", v:5, d:10, t:-10, r:"Out of memory. The server has opinions about 'mostly empty'."},
     b:{l:"Sparse storage with a proper cell index.", v:-10, d:-5, t:5, r:"Opens instantly. Turns out most of a spreadsheet is nothing. Deep."}},
    {who:"Bjarki, QA", chan:"#engine-bugs", av:"BQ",
     text:'A sheet is literally named <code>TRUE</code>. Another is called <code>Q1 Budget (final) v2</code>. The formula <code>=\'Q1 Budget (final) v2\'!A1+TRUE!B2</code> parses as nonsense.',
     a:{l:"Tell customers to rename their sheets.", t:-10, r:"They did not rename their sheets."},
     b:{l:"Fix the tokenizer to handle quoted names and keyword collisions.", v:-5, d:-5, t:5, r:"Sheet names can be anything now. Somebody has named one <code>=</code>. It works."}},
    {who:"Rakel, Support", chan:"support@ · ticket #4640", av:"RS",
     text:'Customer wants <code>SUMIFS</code> with wildcards, and criteria like <code>">="&amp;B2</code>, and criteria ranges of different sizes.',
     a:{l:"Different-sized ranges return #VALUE!, same as Excel. Ship it.", s:5, t:5, fn:["SUMIFS","COUNTIFS"], r:"Compatible, including the error. The customer accepts this because Excel does it too."},
     b:{l:"Make different-sized ranges 'just work'.", d:15, t:-5, fn:["SUMIFS","COUNTIFS"], r:"It works here and errors in Excel. The customer's numbers now disagree with themselves."}},
    {who:"Gunnar, CTO", chan:"DM", av:"GC",
     text:'I saw a demo of an AI agent building a financial model. Can ours do that? The board is asking.',
     a:{l:"Say yes and wire the model to the half-finished engine.", t:5, d:15, s:-10, r:"The agent wrote a formula the engine can't evaluate. The board saw <code>#NAME?</code> on the big screen."},
     b:{l:"Say 'not yet'. Finish the engine first.", t:-5, v:-5, r:"Honest. The board nodded slowly. Slow nods are not great."}},
    {who:"Bjarki, QA", chan:"#engine-bugs", av:"BQ",
     text:'<code>=ROUND(2.5,0)</code> gives 3 in Excel, 2 in Python, and 2.5 in our engine because ROUND isn’t implemented.',
     a:{l:"Use the language's built-in rounding.", v:5, d:5, t:-5, fn:["ROUND"], r:"Banker's rounding. Every accountant is off by a króna somewhere."},
     b:{l:"Implement Excel's round-half-away-from-zero, plus ROUNDUP, ROUNDDOWN, MROUND, CEILING, FLOOR.", v:-10, t:10, fn:["ROUND","ROUNDUP","ROUNDDOWN","MROUND","CEILING","FLOOR"], r:"Six rounding functions. There are more. There are always more."}},
    {who:"Katrín, Product", chan:"#planning", av:"PM",
     text:'Nordfin asked for a Q2 progress update. What do I tell them?',
     a:{l:"'On track.'", t:5, s:-10, d:5, r:"Katrín believed you. That's the problem."},
     b:{l:"Show them the actual function count.", t:-10, s:5, r:"Silence on the call. Then someone asked whether you had 'considered licensing an engine'."}},
  ];

  const TOTAL_FUNCS = 500;
  const PER_Q = 10;
  const MAX_Q = 4;

  // ---- State -------------------------------------------------------------
  let S;
  function reset(){
    S = {velocity:60, debt:30, sanity:60, trust:60, fns:new Set(), q:1, sprint:0, log:[], deck:shuffle(DECK.slice()), card:null, qlog:[]};
  }
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

  const $=id=>document.getElementById(id);
  const intro=$('intro'), play=$('play'), review=$('review'), licenseBtn=$('licenseBtn'), licenseTip=$('licenseTip');

  // ---- Meters ------------------------------------------------------------
  function clamp(x){return Math.max(0,Math.min(100,x));}
  function paintMeters(deltas){
    for(const m of ['velocity','debt','sanity','trust']){
      const el=document.querySelector(`.meter[data-m="${m}"]`);
      const v=S[m];
      el.querySelector('.num').textContent=v;
      const bar=el.querySelector('.bar i');
      bar.style.width=v+'%';
      const badness = m==='debt' ? v : 100-v;
      bar.className = badness>=75 ? 'bad' : badness>=50 ? 'warn' : '';
      const d=el.querySelector('.delta');
      if(deltas && deltas[m]){
        const n=deltas[m];
        d.textContent=(n>0?'+':'')+n;
        const goodDir = m==='debt' ? n<0 : n>0;
        d.className='delta show '+(goodDir?'up':'down');
        clearTimeout(d._t); d._t=setTimeout(()=>d.classList.remove('show'),1600);
      }
    }
    $('fncount').textContent=S.fns.size;
    $('sprint').innerHTML=`<b>Q${S.q}</b>sprint ${Math.min(S.sprint+1,PER_Q)} of ${PER_Q}`;
  }

  // ---- Cards -------------------------------------------------------------
  function draw(){
    if(S.deck.length===0) S.deck=shuffle(DECK.slice());
    S.card=S.deck.pop();
    const c=S.card;
    $('av').textContent=c.av; $('who').textContent=c.who; $('chan').textContent=c.chan;
    $('text').innerHTML=c.text; $('labA').innerHTML=c.a.l; $('labB').innerHTML=c.b.l;
  }
  function choose(k){
    if(S.busy) return;
    const o=S.card[k];
    const deltas={};
    for(const m of ['velocity','debt','sanity','trust']){
      const key={velocity:'v',debt:'d',sanity:'s',trust:'t'}[m];
      if(o[key]){ deltas[m]=o[key]; S[m]=clamp(S[m]+o[key]); }
    }
    let newFns=[];
    if(o.fn){ for(const f of o.fn){ if(!S.fns.has(f)){S.fns.add(f);newFns.push(f);} } }
    S.log.push({card:S.card, opt:o, newFns});
    S.qlog.push({card:S.card, opt:o, newFns});
    $('result').innerHTML=`<b>${strip(o.l)}</b> ${o.r}`;
    paintMeters(deltas);

    const fail=checkFail();
    if(fail){ S.busy=true; setTimeout(()=>ending(fail),700); return; }
    S.sprint++;
    if(S.sprint>=PER_Q){ S.busy=true; setTimeout(quarterReview,700); return; }
    paintMeters();
    draw();
  }
  function strip(h){return h.replace(/<[^>]+>/g,'');}
  function checkFail(){
    if(S.velocity<=0) return 'velocity';
    if(S.debt>=100) return 'debt';
    if(S.sanity<=0) return 'sanity';
    if(S.trust<=0) return 'trust';
    return null;
  }

  // ---- Review doc ----------------------------------------------------------
  function fnChips(){
    if(S.fns.size===0) return '<div class="fnlist"><span class="none">none yet</span></div>';
    return '<div class="fnlist">'+[...S.fns].sort().map(f=>`<span>${f}</span>`).join('')+'</div>';
  }
  function eta(){
    const done=S.fns.size, quarters=S.q;
    if(done===0) return '<span class="big">#DIV/0!</span> <small>rate of zero functions per quarter</small>';
    const rate=done/quarters;
    const remainingQ=(TOTAL_FUNCS-done)/rate;
    const year=new Date().getFullYear()+Math.ceil(remainingQ/4);
    return `<span class="big">${year} <small>at ${rate.toFixed(1)} functions per quarter</small></span>`;
  }
  function verdict(){
    const worst=Math.min(S.velocity,S.sanity,S.trust,100-S.debt);
    if(worst>=55) return ['ok','On track (allegedly)'];
    if(worst>=35) return ['','At risk'];
    return ['','Red. Very red.'];
  }
  function quarterReview(){
    const [cls,label]=verdict();
    const decisions=S.qlog.slice(-4).map(e=>`<li>${strip(e.opt.l)} <span class="muted">, ${e.card.who.split(',')[0]}</span></li>`).join('');
    const isLast = S.q>=MAX_Q;
    review.innerHTML=`
      <div class="doc">
        <div class="stamp ${cls}">${label}</div>
        <h2>Q${S.q} Roadmap Review</h2>
        <div class="sub">Project "Grid of Numbers" · auto-generated from sprint data</div>
        <h3>Excel compatibility</h3>
        <p><span class="big">${S.fns.size} <small>of ${TOTAL_FUNCS}+ functions</small></span></p>
        ${fnChips()}
        <h3>Estimated completion</h3>
        <p>${eta()}</p>
        <h3>Notable decisions this quarter</h3>
        <ul>${decisions}</ul>
        <h3>Health</h3>
        <p>Velocity ${S.velocity} · Tech debt ${S.debt} · Sanity ${S.sanity} · Trust ${S.trust}</p>
        <h3>Recommendation</h3>
        <p>${recommend()}</p>
      </div>
      <div class="actions">
        <button class="btn primary" id="cont">${isLast?'See the annual report':'Continue to Q'+(S.q+1)+'. We’re almost done.'}</button>
      </div>`;
    play.hidden=true; review.hidden=false;
    $('cont').onclick=()=>{ if(isLast){ending('year');} else {S.q++; S.sprint=0; S.qlog=[]; S.busy=false; review.hidden=true; play.hidden=false; paintMeters(); draw();} };
    unlockLicense();
  }
  function recommend(){
    if(S.debt>=70) return 'Pause feature work and address technical debt. (This recommendation also appeared last quarter.)';
    if(S.trust<=35) return 'Rebuild customer confidence by shipping the functions they asked for in Q1.';
    if(S.sanity<=35) return 'Consider team wellbeing. Consider it quickly.';
    if(S.fns.size<10) return 'Accelerate function coverage. Current trajectory places completion after the heat death of the universe.';
    return 'Continue. The remaining '+(TOTAL_FUNCS-S.fns.size)+'+ functions are expected to be easier than the first '+S.fns.size+'.';
  }
  function unlockLicense(){
    licenseBtn.disabled=false; licenseBtn.classList.add('ready');
    licenseTip.textContent='Now available. Someone should have mentioned this earlier.';
  }

  // ---- Endings --------------------------------------------------------------
  const ENDINGS={
    velocity:{h:'Velocity hit zero.', p:'The project has been quietly renamed "Phase 2". Nobody knows when Phase 2 starts. There is no Phase 1.'},
    debt:{h:'The tech debt collector has arrived.', p:'The codebase has been declared a superfund site. The regex named Kevin is now load-bearing.'},
    sanity:{h:'The team has left to start a bakery.', p:'Their menu is in a spreadsheet. It uses XLOOKUP. It works fine.'},
    trust:{h:'The customer has gone.', p:'They switched to a competitor who, it turns out, licenses a spreadsheet engine and spent the year building product instead.'},
    year:{h:'Twelve months. You made it.', p:'You survived a year of building a spreadsheet engine. This is the good ending, in the sense that the other endings are worse.'},
    license:{h:'You licensed an engine.', p:'500+ functions, Excel-exact behaviour, dynamic arrays, dates, locales, the lot. Before lunch. Your own functions have been archived in a folder called "old".'},
  };
  function ending(kind){
    const e=ENDINGS[kind];
    const isWin=kind==='license';
    review.innerHTML=`
      <div class="doc">
        <div class="stamp ${isWin?'ok':''}">${isWin?'Resolved':'Post-mortem'}</div>
        <h2>${e.h}</h2>
        <div class="sub">Project "Grid of Numbers" · Q${S.q}, sprint ${S.sprint+1}</div>
        <p class="lede">${e.p}</p>
        <h3>Functions you implemented</h3>
        <p><span class="big">${S.fns.size} <small>of ${TOTAL_FUNCS}+</small></span></p>
        ${fnChips()}
        ${isWin?'':`<h3>Estimated completion</h3><p>${eta()}</p>`}
        <h3>Decisions made</h3>
        <p>${S.log.length} · of which ${S.log.filter(x=>x.opt.d>0).length} added tech debt</p>
      </div>
      <div class="actions">
        ${isWin
          ? `<a class="btn primary" href="https://grid.is" target="_blank" rel="noopener noreferrer">See what you skipped: GRID Engine</a>`
          : `<a class="btn primary" href="https://grid.is" target="_blank" rel="noopener noreferrer">Skip all of this: license GRID Engine</a>`}
        <button class="btn" id="again">Play again</button>
      </div>
      <p class="hint">Every card in this game is a real spreadsheet problem.</p>`;
    play.hidden=true; review.hidden=false; $('licenseWrap').hidden=true;
    $('again').onclick=()=>{ reset(); paintMeters(); review.hidden=true; play.hidden=false; $('licenseWrap').hidden=false; licenseBtn.disabled=true; licenseBtn.classList.remove('ready'); licenseTip.textContent='Not now. We’re almost done.'; $('result').textContent='Every message is real. Nothing here needed inventing.'; draw(); };
  }

  // ---- Wire up --------------------------------------------------------------
  reset(); paintMeters();
  $('start').onclick=()=>{ intro.hidden=true; play.hidden=false; draw(); };
  $('optA').onclick=()=>choose('a');
  $('optB').onclick=()=>choose('b');
  licenseBtn.onclick=()=>{ if(!licenseBtn.disabled) ending('license'); };
  document.addEventListener('keydown',e=>{
    if(!intro.hidden && e.key==='Enter'){ $('start').click(); return; }
    if(play.hidden) return;
    if(e.key==='1') choose('a'); else if(e.key==='2') choose('b');
  });
})();
