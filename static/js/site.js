document.querySelector('.menu-toggle')?.addEventListener('click',function(){const open=this.getAttribute('aria-expanded')!=='true';this.setAttribute('aria-expanded',String(open));document.querySelector('#main-nav').classList.toggle('open',open)});
document.querySelectorAll('[data-inquiry]').forEach(form=>{const area=form.querySelector('.extended-fields');const toggle=()=>{const value=form.querySelector('[name=mode]:checked')?.value;area.hidden=value!=='extended'};form.querySelectorAll('[name=mode]').forEach(input=>input.addEventListener('change',toggle));toggle();const files=form.querySelector('input[type=file]');files?.addEventListener('change',()=>{const selected=[...files.files];const error=selected.length>5||selected.some(f=>f.size>10*1024*1024)||selected.reduce((n,f)=>n+f.size,0)>40*1024*1024;form.querySelector('.file-feedback').textContent=error?'Превышен лимит: 5 файлов, до 10 МБ каждый, 40 МБ всего.':selected.map(f=>`${f.name} (${(f.size/1024).toFixed(0)} КБ)`).join(', ');files.setCustomValidity(error?'Проверьте размер и количество файлов.':'')})});
document.querySelectorAll('form[data-confirm]').forEach(form=>form.addEventListener('submit',event=>{if(!confirm(form.dataset.confirm))event.preventDefault()}));
document.querySelectorAll('.inquiry-form').forEach(form=>form.addEventListener('submit',()=>{if(form.checkValidity()){const button=form.querySelector('button[type=submit]');button.disabled=true;button.textContent='Отправляем…'}}));

const decisionSubmit=document.querySelector('[data-decision-submit]');
if(decisionSubmit){
  const decision=decisionSubmit.form.querySelector('[name="action"]');
  const updateDecisionLabel=()=>{decisionSubmit.textContent=({approve:'Одобрить заявку',rejected:'Отклонить'})[decision.value]||'Сохранить решение'};
  decision.addEventListener('change',updateDecisionLabel);updateDecisionLabel();
}
