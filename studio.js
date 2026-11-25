(() => {
 const $ = id => document.getElementById(id);
 let bgUrl='',voiceUrl='',musicUrl='',videoUrl='',resultBlob=null,resultMime='',busy=false;
 const say = text => { $('status').textContent=text; };
 const toast = text => { const t=$('toast');t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500); };
 $('imageFile').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;if(bgUrl)URL.revokeObjectURL(bgUrl);bgUrl=URL.createObjectURL(f);$('backdrop').src=bgUrl;$('backdrop').style.display='block';});
 $('voiceFile').addEventListener('change',e=>{const f=e.target.files[0];if(f){voiceUrl=URL.createObjectURL(f);toast('Hlasová stopa přidána.');}});
 $('musicFile').addEventListener('change',e=>{const f=e.target.files[0];if(f){musicUrl=URL.createObjectURL(f);toast('Hudba přidána.');}});
 function scriptFor(subject){return [
  'Vítej u dnešního videa. Tématem je '+subject+'. Dnes se na něj podíváme z několika stran a společně objevíme, co na něm stojí za pozornost.',
  'Začněme tím nejdůležitějším. Když se zamyslíme nad tématem '+subject+', zjistíme, že první dojem často neukazuje celý příběh. Právě souvislosti nám pomáhají pochopit, proč je toto téma zajímavé.',
  'Další pohled odhaluje detail, který je snadné přehlédnout. Zkus se na chvíli zastavit a položit si otázku: co dalšího může toto téma ovlivňovat? Někdy i malá změna úhlu pohledu přinese nový nápad.',
  'Teď si spojme jednotlivé myšlenky dohromady. Každá část přispívá k širšímu obrazu a pomáhá nám porozumět tomu, jak věci fungují. Téma '+subject+' tak můžeme vnímat v novém kontextu.',
  'Co si z toho odnést? Zvědavost a chuť ověřovat si souvislosti se hodí každý den. Napiš do komentářů, co tě zaujalo a jaké téma chceš probrat příště. Díky za sledování a brzy zase na viděnou.'
 ]; }
 function cuesFor(lines,total){const chunks=[];for(const block of lines){const words=block.split(/\s+/);for(let i=0;i<words.length;i+=12)chunks.push(words.slice(i,i+12).join(' '));}const unit=total/chunks.length;return chunks.map((text,i)=>({text,start:i*unit,end:(i+1)*unit}));}
 function drawCover(ctx,w,h,subject,elapsed,cues,progress,img){
   if(img.complete&&img.naturalWidth){const zoom=1.05+Math.sin(progress*Math.PI)*.12,s=Math.max(w/img.naturalWidth,h/img.naturalHeight)*zoom,iw=img.naturalWidth*s,ih=img.naturalHeight*s,pan=Math.sin(progress*Math.PI*2)*w*.035;ctx.drawImage(img,(w-iw)/2+pan,(h-ih)/2,iw,ih);}
   else{const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#161735');g.addColorStop(.52,'#12515c');g.addColorStop(1,'#351954');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);const isPyramid=/pyramid|egypt|egyptsk|egyptské|egyptské/i.test(subject);ctx.fillStyle=isPyramid?'#d49a50':'#456b80';ctx.beginPath();ctx.moveTo(0,h*.76);ctx.quadraticCurveTo(w*.27,h*(.68+Math.sin(progress*6)*.012),w*.52,h*.76);ctx.quadraticCurveTo(w*.78,h*.82,w,h*.72);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fill();if(isPyramid){ctx.fillStyle='#f0c879';for(const p of [.32,.66]){const x=w*p+Math.sin(progress*4)*w*.012,y=h*.75,b=w*.19;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-b*.55,h*.91);ctx.lineTo(x+b*.55,h*.91);ctx.closePath();ctx.fill();ctx.fillStyle='#c88743';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+b*.55,h*.91);ctx.lineTo(x+b*.34,h*.91);ctx.closePath();ctx.fill();ctx.fillStyle='#f0c879';}}else{ctx.fillStyle='#f4c86d';ctx.beginPath();ctx.arc(w*.77,h*.27+Math.sin(progress*4)*h*.015,h*.07,0,Math.PI*2);ctx.fill();}for(let i=0;i<90;i++){const x=(i*197+elapsed*4)%w,y=(i*83)%h*.64;ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x,y,2,2);}}
   const shade=ctx.createLinearGradient(0,h*.45,0,h);shade.addColorStop(0,'rgba(4,5,18,.05)');shade.addColorStop(1,'rgba(4,5,18,.82)');ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
   ctx.textAlign='center';ctx.fillStyle='#fff';ctx.shadowColor='#000';ctx.shadowBlur=18;ctx.font='700 '+Math.round(w*.033)+'px Segoe UI,sans-serif';ctx.fillText(subject.slice(0,70),w/2,h*.17);ctx.shadowBlur=0;
   const c=cues.find(x=>elapsed>=x.start&&elapsed<x.end);if(c){ctx.font='700 '+Math.round(w*.021)+'px Segoe UI,sans-serif';const maxW=w*.84,parts=c.text.split(/\s+/),rows=[];let row='';for(const word of parts){const test=row?row+' '+word:word;if(row&&ctx.measureText(test).width>maxW){rows.push(row);row=word;}else row=test;}if(row)rows.push(row);const lineH=h*.035,boxH=Math.max(h*.09,rows.length*lineH+h*.035),boxW=Math.min(w*.9,Math.max(...rows.map(x=>ctx.measureText(x).width))+w*.035),top=h*.77;ctx.fillStyle='rgba(4,5,16,.82)';ctx.beginPath();ctx.roundRect((w-boxW)/2,top,boxW,boxH,10);ctx.fill();ctx.fillStyle='#fff';ctx.shadowColor='#000';ctx.shadowBlur=4;rows.forEach((line,i)=>ctx.fillText(line,w/2,top+boxH/2+(i-(rows.length-1)/2)*lineH+lineH*.32));ctx.shadowBlur=0;}
   ctx.fillStyle='rgba(255,255,255,.6)';ctx.font='600 '+Math.round(w*.011)+'px Segoe UI,sans-serif';ctx.fillText('AI STUDIO ANIMO',w/2,h*.96);ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(w*.06,h*.985,w*.88,h*.006);ctx.fillStyle='#72e6f1';ctx.fillRect(w*.06,h*.985,w*.88*progress,h*.006);
 }
 async function generate(){
  const subject=$('topic').value.trim();if(!subject){$('topic').focus();return toast('Nejdřív napiš téma videa.');}
  if(busy)return;if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)return toast('Otevři studio v aktuálním Chrome nebo Edge.');
  const seconds=Number($('duration').value)*60,quality=Number($('quality').value),w=quality===1080?1920:1280,h=quality===1080?1080:720;
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d'),lines=scriptFor(subject),cues=cuesFor(lines,seconds),stream=canvas.captureStream(12);
  const tracks=[voiceUrl,musicUrl].filter(Boolean).map(u=>new Audio(u));tracks.forEach((a,i)=>{a.loop=i===tracks.length-1&&!!musicUrl&&uIsMusic(a);});
  let audioCtx;
  if(tracks.length){try{audioCtx=new AudioContext();const dest=audioCtx.createMediaStreamDestination();tracks.forEach(a=>audioCtx.createMediaElementSource(a).connect(dest));dest.stream.getAudioTracks().forEach(t=>stream.addTrack(t));}catch(e){console.warn(e);}}
  const formats=['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'],mime=formats.find(x=>MediaRecorder.isTypeSupported(x))||'';
  let rec;try{rec=new MediaRecorder(stream,mime?{mimeType:mime,videoBitsPerSecond:quality===1080?3500000:1900000}:undefined);}catch{return toast('Prohlížeč nepodporuje export videa.');}
  resultBlob=null;resultMime='';$('rendered').hidden=true;$('rendered').pause();$('export').disabled=true;$('youtube').disabled=true;$('generate').disabled=true;busy=true;$('meter').style.width='0%';say('Připravuji video. Nezavírej tuto kartu…');$('previewTitle').textContent=subject;
  const chunks=[];rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
  rec.onstop=()=>{resultMime=rec.mimeType||mime||'video/webm';resultBlob=new Blob(chunks,{type:resultMime});if(videoUrl)URL.revokeObjectURL(videoUrl);videoUrl=URL.createObjectURL(resultBlob);$('rendered').src=videoUrl;$('rendered').hidden=false;$('caption').hidden=true;busy=false;for(const a of tracks)a.pause();if(audioCtx)audioCtx.close();stream.getTracks().forEach(t=>t.stop());$('generate').disabled=false;$('export').disabled=false;$('youtube').disabled=false;$('progressLabel').textContent='Video je vygenerované — přehraj náhled';say('Hotovo. Náhled přehraješ v okně videa. Pak ho exportuj.');toast('Video je hotové. Zkontroluj náhled.');};
  rec.start(1000);for(const a of tracks){a.currentTime=0;a.play().catch(()=>{});}
  $('progressLabel').textContent='Generování 0 %';const start=performance.now();
  function frame(now){const elapsed=Math.min(seconds,(now-start)/1000),progress=elapsed/seconds;drawCover(ctx,w,h,subject,elapsed,cues,progress,$('backdrop'));$('meter').style.width=(progress*100)+'%';$('progressLabel').textContent='Generování '+Math.floor(progress*100)+' %';$('caption').hidden=false;$('caption').textContent=(cues.find(c=>elapsed>=c.start&&elapsed<c.end)||cues[0]).text;
   if(elapsed<seconds)requestAnimationFrame(frame);else rec.stop();}
  requestAnimationFrame(frame);
 }
 function uIsMusic(a){return !!musicUrl&&a.src===musicUrl;}
 $('generate').addEventListener('click',generate);
 $('export').addEventListener('click',()=>{if(!resultBlob)return;const ext=resultMime.includes('mp4')?'mp4':'webm',a=document.createElement('a');a.href=URL.createObjectURL(resultBlob);a.download='youtube-video-'+$('duration').value+'min.'+ext;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),60000);say(ext==='mp4'?'MP4 staženo.':'Stažen soubor WebM; v tomto prohlížeči není dostupný export MP4.');});
 $('youtube').addEventListener('click',()=>window.open('https://studio.youtube.com/','_blank','noopener'));
 $('listen').addEventListener('click',()=>{if(!('speechSynthesis'in window))return toast('Hlasový náhled tento prohlížeč nepodporuje.');const subject=$('topic').value.trim();if(!subject)return toast('Napiš nejdřív téma.');speechSynthesis.cancel();const u=new SpeechSynthesisUtterance('Dnešní video: '+subject+'. '+scriptFor(subject)[0]);u.lang='cs-CZ';const v=speechSynthesis.getVoices().find(x=>x.lang.toLowerCase().startsWith('cs'));if(v)u.voice=v;speechSynthesis.speak(u);});
 $('quality').addEventListener('change',()=>{$('resolution').textContent=Number($('quality').value)===1080?'1920 × 1080':'1280 × 720';});
})();

