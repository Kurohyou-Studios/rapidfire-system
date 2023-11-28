/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Expands/collapses the sections
const expandHeader = function(jEvent){
  k.debug('entering expandHeader');
  const name = jEvent.htmlAttributes.name.replace(/act_/,'');
  const target = `.${name}.expandable-header`;
  k.getAttrs({props:['collapsed'],
    callback:(attributes)=>{
      attributes.collapsed = attributes.collapsed.split(/\s*,\s*/).filter(b => b!==name && !/^\s*$/.test(b) );
      if(!/collapse/.test(jEvent.htmlAttributes.class)){
        attributes.collapsed.push(name);
      }
      attributes.collapsed = attributes.collapsed.join(',');
      $20(target).toggleClass('collapse');
      attributes.set();
    }});
};
k.registerFuncs({expandHeader});

const clearTracker = function(event){
  k.debug('clearing tracker');
  let [section,rowID,field] = k.parseClickTrigger(event.triggerName);
  k.getAllAttrs({callback:(attributes,sections,casc)=>{
    sections[section].forEach((id)=>{
      attributes[`${section}_${id}_damaged`] = 0;
      attributes[`${section}_${id}_fill`] = 0;
    });
    let attr = section.replace(/repeating_/,'');
    attributes[attr] = attributes[`${attr}_max`];
    k.debug({attr});
    let trigger = casc[`attr_${attr}`];
    attributes.processChange({trigger,attributes,sections,casc});
  }});
};
k.registerFuncs({clearTracker});

const addItem = function(event){
  let [,,section] = k.parseClickTrigger(event.triggerName);
  section = section.replace(/add-/,'');
  let rowID = generateRowID();
  const setObj = {};
  setObj[`repeating_${section}_${rowID}_name`] = '';
  k.setAttrs(setObj);
};
k.registerFuncs({addItem});

const editSection = function(event){
  let [,,section] = k.parseClickTrigger(event.triggerName);
  section = section.replace(/edit-/,'');
  let target = `fieldset.repeating_${section} + .repcontainer`;
  $20(target).toggleClass('editmode');
};
k.registerFuncs({editSection});

const toggleImageInput = function(jEvent){
  let field = k.parseHTMLName(jEvent.htmlAttributes.name);
  $20(`.${field.replace(/_/g,'-')} .image-container__input`).toggleClass('active');
};
k.registerFuncs({toggleImageInput});



//Calls the appropriate dynamic query function for the event
const dynamicSelect = function(event){
  let[section,rowID,field] = k.parseClickTrigger(event.triggerName);

  const dynamicQueries = {
    skill: skillQuery
  };

  field = field.replace(/-action$/,'');
  k.getAllAttrs({
    callback:async (attributes,sections)=>{
      let selection = await dynamicQueries[field]({section,rowID,field},attributes,sections);
      attributes[`${section}_${rowID}_${field}`] = selection;
      attributes[`${section}_${rowID}_translate_${field}`] = getTranslationByKey(selection) ? 1 : 0;
      attributes.set();
    }
  });
};
k.registerFuncs({dynamicSelect});

const skillQuery = ({section,rowID,field},attributes,sections) => {
  const skillQuery = sections.repeating_skill.reduce((memo,id) => {
    const row = `repeating_skill_${id}`;
    const name = attributes[`${row}_name`];
    const optionText = `|${
      attributes[`${row}_raw`] ?
        k.capitalize(getTranslationByKey(name)) :
        name
    },${name}`;
    memo += optionText;
    return memo;
  },getTranslationByKey('skill query'));
  return k.extractQueryResult(skillQuery);
}