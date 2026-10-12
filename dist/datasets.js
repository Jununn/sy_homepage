(() => {
  const library = window.datasetLibrary;
  const lang = () => document.documentElement.lang === 'en' ? 'en' : 'zh';
  const t = key => window.siteContent[lang()][key];
  const localized = value => value[lang()];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const original = value => typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  const field = (label, value, code = false) => `<div class="data-field"><p class="field-label">${esc(label)}</p><${code ? 'pre' : 'p'} class="field-content">${esc(original(value))}</${code ? 'pre' : 'p'}></div>`;
  const metric = (label, value) => `<div class="metric"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`;
  const details = (label, value) => `<details class="field-details"><summary>${esc(label)}</summary><p class="field-content">${esc(original(value))}</p></details>`;
  const roundTitle = n => t('roundLabel').replace('{n}', n);
  const imageCompare = (record, compact = false) => `<div class="comparison"${!compact ? ` style="aspect-ratio:${esc(record.aspect_ratio.replace(':','/'))}"` : ''}><img src="${esc(record.after)}" alt="${esc(t('after'))}" loading="lazy" width="600" height="400"><img class="compare-before" src="${esc(record.before)}" alt="${esc(t('before'))}" loading="lazy" width="600" height="400"><span class="compare-label before-label">${esc(t('before'))}</span><span class="compare-label after-label">${esc(t('after'))}</span><span class="compare-seam"><span class="compare-grip">↔</span></span><input type="range" min="0" max="100" value="50" aria-label="${esc(t('compareLabel'))}"></div>`;
  document.addEventListener('input', event => {
    if (!event.target.matches('.comparison input')) return;
    const parent = event.target.closest('.comparison');
    parent.querySelector('.compare-before').style.clipPath = `inset(0 ${100 - Number(event.target.value)}% 0 0)`;
    parent.querySelector('.compare-seam').style.left = `${event.target.value}%`;
  });

  if (document.getElementById('home-comparison')) {
    function renderHome() { document.getElementById('home-comparison').innerHTML = imageCompare(library.items[0].record, true); }
    renderHome(); window.addEventListener('dataverse:language', renderHome);
    return;
  }
  if (!document.getElementById('sample-detail')) return;
  let currentId = library.items.some(x => x.id === location.hash.slice(1)) ? location.hash.slice(1) : library.items[0].id;
  let activeRound = 0;
  const current = () => library.items.find(x => x.id === currentId);
  function choose(id, updateHistory = true) {
    if (!library.items.some(x => x.id === id)) return;
    currentId = id; activeRound = 0;
    if (updateHistory) history.pushState(null, '', `#${id}`);
    render();
  }
  function multiContent(r) {
    const round = r.rounds[activeRound];
    let reference = r.reference;
    const prior = round.source_ref.match(/^round_(\d+)$/);
    if (round.source_ref === 'prev' && activeRound > 0) reference = r.rounds[activeRound - 1].image;
    else if (prior) reference = r.rounds[Number(prior[1])-1].image;
    const references = round.source_ref.split('+').map(ref => {
      const match=ref.match(/^round_(\d+)$/);
      if (match) return {image:r.rounds[Number(match[1])-1].image,label:roundTitle(match[1])};
      return {image:reference,label:round.source_ref==='reference' ? t('referenceImage') : roundTitle(activeRound)};
    });
    const images = [...references, {image:round.image,label:`${roundTitle(round.idx)} · ${t('referenceCaption')}`}];
    return `<div class="round-list" aria-label="${esc(t('chooseSample'))}">${r.rounds.map((x,i) => `<button class="round-button${i === activeRound ? ' active' : ''}" data-round="${i}" aria-pressed="${i === activeRound}">${esc(roundTitle(x.idx))}</button>`).join('')}</div><div class="round-pair${images.length>2 ? ' round-combination' : ''}">${images.map(x=>`<figure class="round-image"><img src="${esc(x.image)}" alt="${esc(x.label)}" width="600" height="600"><figcaption>${esc(x.label)}</figcaption></figure>`).join('')}</div>${field(t('originalPrompt'), lang()==='zh' ? round.prompt_zh : round.prompt_en)}<p class="round-meta">${esc(round.edit_type)} · ${esc(t('sourceReference'))}: ${esc(round.source_ref)}</p>${details(t('originalMetadata'),r)}`;
  }
  function sampleContent(item) {
    const r = item.record;
    if (item.category === 'single') return imageCompare(r) + `<p class="compare-help">${esc(t('compareTip'))} · ${esc(t('fileSizeNote'))}</p>` + field(t('originalPrompt'),r.edit_prompt) + details(t('preservation'),r.edit_prompt_full);
    if (item.category === 'multi') return multiContent(r);
    if (item.category === 'sft') return `<dl class="metrics">${metric('SuperFiltering',r.SuperfilteringScore.toFixed(4))}${metric('Deita',r.DeitaQualityScore.toFixed(4))}${metric(t('metricDifficulty'),r.difficulty)}</dl><p class="metric-note">${esc(t('qualitySource'))}</p>`+field(t('originalInstruction'),r.instruction)+field(t('originalAnswer'),r.output);
    if (item.category === 'sql') return `<p class="mono-label">DB / ${esc(r.db_id)} · ${esc(r.question_style)}</p>`+field(t('fieldQuestion'),r.question)+field('SQL',r.sql,true)+details(t('fieldReasoning'),r.cot);
    if (item.category === 'code') return field(t('originalInstruction'),r.generated_instruction)+field(t('fieldCode'),r.generated_code,true);
    if (item.category === 'agent') return `<dl class="metrics">${metric(t('metricScore'),r.overall_score.toFixed(2)+' / 1')}${metric(t('metricSteps'),r.num_steps)}</dl><p class="metric-note">${esc(t('agentScoreSource'))}</p>`+field(t('fieldTask'),r.task)+`<div class="trajectory">${r.steps.map((step,i)=>`<details class="trajectory-step"${i===0 ? ' open' : ''}><summary>${esc(t('stepLabel').replace('{n}',step.step))}<span class="step-tool">${esc(step.tool)}</span></summary>${field(t('fieldThought'),step.thought)}${field(t('fieldArgs'),step.args,true)}${field(t('fieldObservation'),step.observation === null ? t('noObservation') : step.observation,true)}</details>`).join('')}</div>`+field(t('fieldResult'),r.final_answer)+details(t('fieldJudge'),r.judge_rationale);
    return '';
  }
  function render() {
    const item = current();
    document.title = `DataVerse · ${lang()==='zh' ? '数据样本库' : 'Data Library'}`;
    const description = t('libraryDescription');
    document.querySelector('meta[name="description"]').content = description;
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[property="og:description"]').content = description;
    document.getElementById('category-list').innerHTML = Object.entries(library.categories).map(([key,cat])=>`<button class="category-button${key===item.category?' active':''}" data-category="${key}" aria-pressed="${key===item.category}">${esc(localized(cat))}<span class="category-count">${library.items.filter(x=>x.category===key).length}</span></button>`).join('');
    document.getElementById('category-description').textContent = localized(library.categories[item.category].note);
    document.getElementById('sample-list').innerHTML=library.items.filter(x=>x.category===item.category).map((x,i)=>`<button class="sample-button${x.id===item.id?' active':''}" data-sample="${x.id}" aria-pressed="${x.id===item.id}"><span class="sample-number">${String(i+1).padStart(2,'0')}</span><span>${esc(localized(x.title))}</span></button>`).join('');
    document.getElementById('sample-detail').innerHTML=`<div class="detail-heading"><h2>${esc(localized(item.title))}</h2><span class="sample-id">${esc(item.record.id || item.id.toUpperCase())}</span></div>`+sampleContent(item)+(item.validation?`<p class="validation-note">${esc(t('validationLabel'))} / ${esc(localized(item.validation))}</p>`:'')+`<div class="sample-footer"><button type="button" id="download-sample">${esc(t('downloadSample'))} ↓</button><a href="${esc(library.source.data_url)}" target="_blank" rel="noopener noreferrer">${esc(t('viewSource'))} ↗</a></div>`;
  }
  document.addEventListener('click',event=>{
    const category=event.target.closest('[data-category]');
    if(category) {choose(library.items.find(x=>x.category===category.dataset.category).id);document.querySelector(`[data-category="${category.dataset.category}"]`).focus();}
    const sample=event.target.closest('[data-sample]');
    if(sample) {choose(sample.dataset.sample);document.querySelector(`[data-sample="${sample.dataset.sample}"]`).focus();}
    const round=event.target.closest('[data-round]');
    if(round) {activeRound=Number(round.dataset.round);render();document.querySelector(`[data-round="${activeRound}"]`).focus();}
    if(event.target.closest('#download-sample')){
      const item=current();const blob=new Blob([JSON.stringify({source:library.source,source_key:item.source_key,source_index:item.source_index,record:item.record},null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`dataverse-${item.id}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
  });
  window.addEventListener('popstate',()=>choose(location.hash.slice(1)||library.items[0].id,false));
  window.addEventListener('hashchange',()=>choose(location.hash.slice(1)||library.items[0].id,false));
  window.addEventListener('dataverse:language',render);
  render();
})();
