// Public, read-only preview. No requests, uploads or browser storage.
const previewParams=new URLSearchParams(location.search);
document.querySelectorAll('[data-preview-form]').forEach(form=>{
  const extended=form.querySelector('[name="mode"][value="extended"]');
  if(extended&&previewParams.get('mode')==='extended')extended.checked=true;
  const kind=form.querySelector('[name="kind"]');
  if(kind&&[...kind.options].some(option=>option.value===previewParams.get('kind')))kind.value=previewParams.get('kind');
  form.addEventListener('submit',event=>{event.preventDefault();event.stopImmediatePropagation()},true);
});

const search=document.querySelector('.search-form');
if(search){
  const input=search.querySelector('[name="q"]');
  const region=search.querySelector('[name="region"]');
  const records=[...document.querySelectorAll('.registry-list>article')];
  const questions=[...document.querySelectorAll('.faq-list>details')];
  const items=records.length?records:questions;
  const empty=document.createElement('p');
  empty.className='notice';empty.setAttribute('role','status');empty.hidden=true;
  empty.textContent='Совпадений нет. Измените запрос или сбросьте фильтры.';
  search.after(empty);
  const reset=document.createElement('button');
  reset.type='button';reset.className='button button-secondary';reset.textContent='Сбросить';
  search.append(reset);
  input.value=previewParams.get('q')||'';
  if(region&&[...region.options].some(option=>option.value===previewParams.get('region')))region.value=previewParams.get('region');
  const filter=()=>{
    const q=input.value.trim().toLocaleLowerCase('ru-RU');let visible=0;
    items.forEach(item=>{
      const matches=item.textContent.toLocaleLowerCase('ru-RU').includes(q)&&(!region?.value||item.querySelector('.expert-meta span')?.textContent===region.value);
      item.hidden=!matches;if(matches)visible++;
      if(item.tagName==='DETAILS')item.open=Boolean(q&&matches);
    });
    empty.hidden=visible>0;
    const count=document.querySelector('.results-count');
    if(count)count.textContent=`Найдено экспертов: ${visible}`;
    const url=new URL(location.href);url.searchParams.delete('page');
    for(const [key,value] of [['q',input.value.trim()],['region',region?.value||'']]){
      if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);
    }
    history.replaceState(null,'',url);
  };
  search.addEventListener('submit',event=>{event.preventDefault();filter()});
  reset.addEventListener('click',()=>{input.value='';if(region)region.value='';filter()});
  filter();
}
