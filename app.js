(() => {
  const app=document.querySelector('#app'), dialog=document.querySelector('#aboutDialog'), cards=window.CARD_DATA;
  const state={step:'home',deck:[],revealed:0,focus:null,action:'',customAction:''};
  let summaryCardGeneration=0;
  const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cardImage=c=>'./cards/'+encodeURIComponent(c.previewImage);
  const cardDownload=c=>'./cards/'+encodeURIComponent(c.image);
  const currentFocus=()=>cards.find(c=>c.id===state.focus);
  function progress(i){return '<nav class="progress-wrap" aria-label="探索進度"><div class="progress-meta"><span>'+['01 翻開美食守護符','02 嚐一口暖心','03 帶走小確幸'][i]+'</span><span>'+(i+1)+' / 3</span></div><div class="progress"><i style="width:'+((i+1)/3*100)+'%"></i></div></nav>';}
  function panel(title,lead,content,i=0){return progress(i)+'<section class="panel"><div class="eyebrow">選舉的心事，讓台灣味抱一抱</div><h1>'+title+'</h1><p class="lead">'+lead+'</p>'+content+'</section>';}
  function home(){return '<section class="hero"><div class="hero-copy"><span class="eyebrow">台灣美食 × 選舉情緒</span><h1><span>選舉有點煩，</span><span class="warm-ink">吃一口，心就暖了。</span></h1><p class="hero-tag">唯有美食，可以退散煩躁</p><p class="lead">嘴上說沒差的逞強，交給包心粉圓；<br>等開票的焦躁，讓小籠湯包陪你慢慢等。<br>翻開三張守護符，看看哪一口台灣味最懂你。</p><button class="button button-primary" data-action="start">'+(state.deck.length===3?'繼續這份幸福滋味':'抽一份幸福的滋味')+' <span aria-hidden="true">→</span></button></div><div class="hero-art talisman-art" aria-label="三張粉彩刺繡美食守護符"><div class="hero-halo" aria-hidden="true"></div><img class="hero-left" src="./cards/05.jpg" alt="自疑退散，紫金蓮與擔仔麵守護符" width="1024" height="1758"/><img class="hero-right" src="./cards/18.jpg" alt="焦躁退散，鳳仙花與小籠湯包守護符" width="1024" height="1758"/><img class="hero-center" src="./cards/01.jpg" alt="逞強退散，龍芽草與包心粉圓守護符" width="1024" height="1758" fetchpriority="high"/></div></section>';}
  function draw(){const visible=state.deck.map(id=>cards.find(c=>c.id===id));return panel('今天，哪一口最懂你的心？','輕觸任一張守護符，三張一起翻開。看看哪一份心情像你，哪一道台灣味，讓你想先對自己好一點。','<div class="card-spread">'+visible.map((c,i)=>'<article class="draw-card '+(state.focus===c.id?'selected':'')+'">'+(state.revealed===3?'<button class="card-image-button" data-action="enlarge-card" data-id="'+c.id+'" aria-label="放大'+esc(c.zh)+'牌卡"><img class="card-image" src="'+cardImage(c)+'" alt="'+esc(c.title+'，'+c.zh+'，'+c.food)+'" width="'+c.width+'" height="'+c.height+'"/></button><div class="card-text"><small>守護符 '+c.id+' · '+esc(c.food)+'</small><strong>'+esc(c.title)+'</strong><span>'+esc(c.topic)+'</span></div><button class="button button-outline choose-feeling '+(state.focus===c.id?'selected':'')+'" data-focus="'+c.id+'" aria-pressed="'+(state.focus===c.id)+'">'+(state.focus===c.id?'✓ 我比較有感覺':'我比較有感覺')+'</button><button class="text-button small" data-action="show-card" data-id="'+c.id+'">閱讀文字版</button>':'<button class="card-back" data-action="reveal" aria-label="翻開第 '+(i+1)+' 張牌，三張一起出現"><img src="'+cardImage(c)+'" alt="" hidden/><span class="back-flower" aria-hidden="true">❀</span><strong>小確幸<br>守護符</strong><span class="back-food" aria-hidden="true">✧</span><small>輕觸，三張一起開</small></button>')+'</article>').join('')+'</div><div class="button-row"><button class="button button-quiet" data-action="back-home">返回首頁</button>'+(state.revealed===3?'<button class="button button-primary" data-action="to-support" '+(state.focus?'':'disabled')+'>嚐一口暖心 →</button>':'')+'</div><p class="tiny-note">'+(state.revealed===3?'點牌面可放大或下載牌卡，也可以閱讀文字版。':'任選一張輕觸即可，三份幸福滋味一起出現。')+'</p>',0);}
  function support(){const c=currentFocus();return panel('把心情，交給這一口。','用熟悉的香氣、喜歡的滋味，安慰選舉裡有點累的心。先在心裡嚐一口，想吃的時候再好好犒賞自己。','<div class="support-intro"><button class="summary-card-image" data-action="enlarge-card" data-id="'+c.id+'" aria-label="放大'+esc(c.zh)+'牌卡"><img src="'+cardImage(c)+'" alt="'+esc(c.title)+'" /></button><div><span class="eyebrow">'+c.id+' '+esc(c.zh)+' · '+esc(c.en)+'</span><h2>'+esc(c.title)+' <small>'+esc(c.blessing)+'</small></h2><p class="support-topic">'+esc(c.topic)+'</p><p class="inner-voice">「'+esc(c.description)+'」</p></div></div><div class="food-note"><strong>'+esc(c.comfortLine)+'</strong><p>'+esc(c.foodReading)+'</p></div><p class="question">'+esc(c.question)+'</p><p class="muted">選一份今天想給自己的小確幸，也可以寫下你喜歡的吃法。</p><div class="suggestions">'+c.supports.map((text,i)=>'<button class="suggestion '+(state.action===text?'selected':'')+'" data-action-choice="'+esc(text)+'" aria-pressed="'+(state.action===text)+'"><span class="suggestion-icon" aria-hidden="true">'+['◦','↗','♡'][i]+'</span>'+esc(text)+'</button>').join('')+'</div><label class="edit-summary">或寫一個自己的小行動（選填）<input id="customAction" value="'+esc(state.customAction)+'" maxlength="1000" placeholder="例如：今晚放下手機，慢慢吃一碗喜歡的麵" /></label><label class="edit-summary">今天，我想給自己的暖心一口<input id="actionInput" value="'+esc(state.action)+'" maxlength="1000" placeholder="選上方建議後，也可以在這裡修改" /></label><button class="text-button" data-action="remember-need">今天先記住這個感受</button><div class="button-row"><button class="button button-quiet" data-action="back-need">返回三張牌</button><button class="button button-primary" data-action="to-story">帶走小確幸 →</button></div><button class="text-button skip-link" data-action="skip-action">先略過行動，回看自己</button><p class="tiny-note">你的文字只留在本次頁面；下載的小卡會包含你留下的行動。</p>',1);}
  function finalSummary(){const c=currentFocus();return {overview:c.comfortLine+' '+c.foodReading,suggestion:state.action.trim()||c.supports[0]};}
  function finish(){const c=currentFocus(),{overview,suggestion}=finalSummary();return panel('帶一口台灣味，讓心鬆一點。','選舉的喧鬧先放一邊，喜歡的滋味留給自己。願這份小確幸，陪你把心裡的結慢慢鬆開。','<div class="final-card final-summary"><span class="eyebrow">此刻的守護 · '+esc(c.title)+'</span><h2>總結</h2><p>'+esc(overview)+'</p><h2>給自己的建議</h2><p>'+esc(suggestion)+'</p></div><div class="finish-drawn-cards"><p class="question">這次選擇的守護符</p><div class="finish-card-grid"><button class="finish-card-button" data-action="download-card" data-id="'+c.id+'" aria-label="放大並下載'+esc(c.zh)+'牌卡"><img src="'+cardImage(c)+'" alt="'+esc(c.title+' · '+c.food)+'"/><span>'+esc(c.zh)+' · 點擊放大與下載</span></button></div></div><div class="summary-image-section"><h2>留給自己的圖片小卡</h2><p class="muted">把懂你的美食守護符、暖心的話和小確幸，留在同一張圖裡。</p><div class="summary-image-frame"><img id="summaryCardPreview" alt="含所選守護符、總結與建議的圖片小卡預覽" /></div><a class="button button-primary summary-download disabled" id="downloadSummaryCard" download="小確幸守護符-此刻的回看.png" aria-disabled="true">下載圖片小卡 PNG</a><p id="summaryCardStatus" class="muted" role="status">正在製作圖片小卡…</p></div><details class="gentle-reminder"><summary>準備好時，再慢慢判斷</summary><p>先休息，再選一項在意的議題，找原始出處、日期與完整脈絡，分清事實、評論與猜測。比較時使用相同標準，未知的地方可以先留白。</p><p>牌卡不替你決定選票，也不評分你的情緒。</p></details><div class="button-row"><button class="button button-quiet" data-action="back-support">返回支持頁</button><button class="button button-primary" data-action="finish-session">再抽一次 ↻</button></div>',2);}
  function showCard(id){const c=cards.find(c=>c.id===id);if(!c)return;document.querySelector('#cardDialog')?.remove();const d=document.createElement('dialog');d.id='cardDialog';d.setAttribute('aria-labelledby','cardTextTitle');d.innerHTML='<div class="dialog-head"><h2 id="cardTextTitle">'+esc(c.title)+' · '+esc(c.zh)+'</h2><button class="icon-button" aria-label="關閉文字版">×</button></div><div class="card-dialog-content"><img src="'+cardImage(c)+'" alt="'+esc(c.title)+'"/><div><p class="card-topic">'+esc(c.topic)+'</p><p>「'+esc(c.description)+'」</p><h3>'+esc(c.comfortLine)+'</h3><p>'+esc(c.foodReading)+'</p><h3>探索問題</h3><p>'+esc(c.question)+'</p><h3>可以留意的需要</h3><p>'+esc(c.needs.join('、'))+'</p><h3>支持方向</h3><ul>'+c.supports.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul><p class="tiny-note">'+esc(c.source.label)+'。食物為創意比喻。</p><a href="'+c.source.url+'" target="_blank" rel="noreferrer">巴赫傳統情緒主題參考 ↗</a></div></div>';document.body.append(d);d.addEventListener('close',()=>d.remove(),{once:true});d.querySelector('button').addEventListener('click',()=>d.close());d.showModal();}
  function enlargeCard(id){const c=cards.find(c=>c.id===id);if(!c)return;document.querySelector('#imageDialog')?.remove();const d=document.createElement('dialog');d.id='imageDialog';d.className='image-dialog';d.setAttribute('aria-labelledby','imageTitle');d.innerHTML='<div class="dialog-head"><h2 id="imageTitle">'+esc(c.title)+' · '+esc(c.zh)+'</h2><button class="icon-button" aria-label="關閉牌卡預覽">×</button></div><img class="enlarged-card" src="'+cardImage(c)+'" alt="'+esc(c.title+'，'+c.blessing+'，'+c.food)+'"/><a class="button button-primary card-download" href="'+cardDownload(c)+'" download="'+esc(c.id+'-'+c.title+'-'+c.zh)+'.jpg">下載這張牌卡 JPG</a><p class="tiny-note">清晰輕量版，每張小於 1 MB；手機可長按圖片儲存。</p>';document.body.append(d);d.addEventListener('close',()=>d.remove(),{once:true});d.querySelector('button').addEventListener('click',()=>d.close());d.showModal();}
  function beginSession(){Object.assign(state,{step:'draw',deck:shuffle(cards).slice(0,3).map(c=>c.id),revealed:0,feelings:{},contexts:[{}, {}, {}],contextIndex:0,focus:null,needs:[],customNeed:'',needConfirm:'',summaryEdit:'',innerSaid:'',innerWanted:'',action:'',customAction:'',story:null,seenStories:[],storyResponse:'',storySkipped:false,actionReview:'',closing:''});}

  function wrapCanvasText(ctx,text,maxWidth){
    const lines=[];
    for(const paragraph of String(text).split('\n')){
      let line='';
      for(const char of paragraph){
        if(line&&ctx.measureText(line+char).width>maxWidth){lines.push(line);line=char;}
        else line+=char;
      }
      lines.push(line);
    }
    return lines;
  }
  async function buildSummaryCard(generation){
    try{
      await document.fonts.ready;
      const drawn=cards.filter(c=>c.id===state.focus);
      const images=await Promise.all(drawn.map(c=>new Promise(resolve=>{
        const image=new Image();
        image.onload=()=>resolve(image);
        image.onerror=()=>resolve(null);
        image.src=cardImage(c);
      })));
      if(generation!==summaryCardGeneration||state.step!=='finish')return;
      const {overview,suggestion}=finalSummary();
      const canvas=document.createElement('canvas');
      const ctx=canvas.getContext('2d');
      if(!ctx)throw new Error('Canvas unavailable');
      canvas.width=1080;
      ctx.font='32px "Noto Serif TC", serif';
      const overviewLines=wrapCanvasText(ctx,overview,850);
      const suggestionLines=wrapCanvasText(ctx,suggestion,850);
      const overviewTop=770;
      const overviewHeight=130+overviewLines.length*48;
      const suggestionTop=overviewTop+overviewHeight+24;
      const suggestionHeight=130+suggestionLines.length*48;
      canvas.height=suggestionTop+suggestionHeight+145;
      ctx.fillStyle='#faf6ed';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.strokeStyle='#cbb591';ctx.lineWidth=3;ctx.strokeRect(32,32,canvas.width-64,canvas.height-64);
      ctx.fillStyle='#a55359';ctx.font='bold 26px "Noto Serif TC", serif';ctx.fillText('小確幸守護符  ·  此刻的回看',76,102);
      ctx.fillStyle='#4b3d2d';ctx.font='44px "Noto Serif TC", serif';ctx.fillText('唯有美食，可以退散煩躁',76,178);
      ctx.strokeStyle='#d6c3a6';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(76,210);ctx.lineTo(1004,210);ctx.stroke();
      const cardWidth=260,cardHeight=445,gap=0,startX=410,cardY=230;
      drawn.forEach((card,i)=>{
        const x=startX+i*(cardWidth+gap);
        ctx.fillStyle='#ece2d2';ctx.fillRect(x,cardY,cardWidth,cardHeight);
        if(!images[i])throw new Error('Card image did not load'); const fit=Math.min(cardWidth/images[i].width,cardHeight/images[i].height); const iw=images[i].width*fit,ih=images[i].height*fit; ctx.drawImage(images[i],x+(cardWidth-iw)/2,cardY+(cardHeight-ih)/2,iw,ih);
        ctx.strokeStyle=state.focus===card.id?'#a55359':'#cbb591';
        ctx.lineWidth=state.focus===card.id?6:2;
        ctx.strokeRect(x,cardY,cardWidth,cardHeight);
        ctx.fillStyle='#4b3d2d';ctx.font='28px "Noto Serif TC", serif';
        ctx.textAlign='center';ctx.fillText(card.zh,x+cardWidth/2,cardY+cardHeight+42);ctx.textAlign='left';
      });
      const drawSection=(top,height,title,lines)=>{
        ctx.fillStyle='#f0e7d8';ctx.fillRect(76,top,928,height);
        ctx.strokeStyle='#d6c3a6';ctx.lineWidth=2;ctx.strokeRect(76,top,928,height);
        ctx.fillStyle='#a55359';ctx.font='bold 30px "Noto Serif TC", serif';ctx.fillText(title,108,top+58);
        ctx.fillStyle='#4b3d2d';ctx.font='32px "Noto Serif TC", serif';
        lines.forEach((line,i)=>ctx.fillText(line,108,top+112+i*48));
      };
      drawSection(overviewTop,overviewHeight,'總結',overviewLines);
      drawSection(suggestionTop,suggestionHeight,'給自己的建議',suggestionLines);
      ctx.fillStyle='#80725f';ctx.font='24px "Noto Serif TC", serif';
      ctx.fillText('讓喜歡的滋味，陪心裡的風雨慢慢退散。',76,canvas.height-75);
      const url=canvas.toDataURL('image/png');
      if(generation!==summaryCardGeneration||state.step!=='finish')return;
      document.querySelector('#summaryCardPreview').src=url;
      const downloadLink=document.querySelector('#downloadSummaryCard');
      downloadLink.href=url;
      downloadLink.classList.remove('disabled');
      downloadLink.removeAttribute('aria-disabled');
      document.querySelector('#summaryCardStatus').textContent='圖片小卡已完成。';
    }catch(e){
      if(generation===summaryCardGeneration&&state.step==='finish')document.querySelector('#summaryCardStatus').textContent='圖片小卡暫時無法產生，請重新整理後再試。';
    }
  }

  function render(){if(state.step==='draw')return draw();if(state.step==='support')return support();if(state.step==='finish')return finish();return home();}
  function renderApp(){const changed=app.dataset.step!==state.step;app.dataset.step=state.step;document.body.dataset.view=state.step;app.innerHTML=render();app.focus({preventScroll:true});if(changed)window.scrollTo({top:0,behavior:'instant'});summaryCardGeneration++;if(state.step==='finish')buildSummaryCard(summaryCardGeneration);}
  function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;}
  document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();state.step='home';renderApp();});
  document.querySelector('#aboutBtn').addEventListener('click',()=>dialog.showModal());
  document.querySelector('[data-close="aboutDialog"]').addEventListener('click',()=>dialog.close());
  app.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.focus){if(state.focus!==b.dataset.focus){state.action='';state.customAction='';}state.focus=b.dataset.focus;renderApp();return;}
    if(b.dataset.actionChoice){state.action=b.dataset.actionChoice;state.customAction='';renderApp();return;}
    const a=b.dataset.action;
    if(a==='start'){if(state.deck.length===3)state.step='draw';else beginSession();}
    else if(a==='back-home')state.step='home';
    else if(a==='reveal')state.revealed=3;
    else if(a==='show-card'){showCard(b.dataset.id);return;}
    else if(a==='enlarge-card'||a==='download-card'){enlargeCard(b.dataset.id);return;}
    else if(a==='to-support'){if(state.focus&&state.revealed===3)state.step='support';}
    else if(a==='back-need')state.step='draw';
    else if(a==='back-support')state.step='support';
    else if(a==='remember-need'){state.action='今天先記住：我值得一口喜歡的滋味，也值得被好好照顧。';state.customAction='';}
    else if(a==='to-story'){state.action=document.querySelector('#actionInput')?.value||state.action;state.customAction=document.querySelector('#customAction')?.value||'';if(state.customAction)state.action=state.customAction;state.step='finish';}
    else if(a==='skip-action'){state.action='今天先記住：我值得一口喜歡的滋味，也值得被好好照顧。';state.customAction='';state.step='finish';}
    else if(a==='finish-session')beginSession();
    renderApp();
  });
  app.addEventListener('input',e=>{if(e.target.id==='customAction')state.customAction=e.target.value;if(e.target.id==='actionInput'){state.action=e.target.value;state.customAction='';const own=document.querySelector('#customAction');if(own)own.value='';}});
  renderApp();
})();