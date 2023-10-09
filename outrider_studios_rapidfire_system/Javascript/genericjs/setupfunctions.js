/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/*
  Sheet Styling
*/
const styleOnOpen = function({attributes,sections,casc}){
  navigateSheet({triggerName:attributes.sheet_state});
  k.setActionCalls({attributes,sections});
};
k.registerFuncs({styleOnOpen},{type:['opener']});

const navigateSheet = function(event){
  k.debug('navigating sheet');
  const setObj = {};
  let [,,page] = k.parseClickTrigger(event.triggerName);
  page = page.replace(/^nav-|-action$/g,'');
  $20('.nav__button').removeClass('active');
  $20('.navigable-section').removeClass('active');
  $20(`.${page}`).addClass('active')
  setObj.sheet_state = page;
  k.debug({setObj});
  k.setAttrs(setObj);
};
k.registerFuncs({navigateSheet});

const setupSystem = function({attributes,sections}){
  setupAttributes(attributes,sections);
};
k.registerFuncs({setupSystem},{type:['new']});

const setupAttributes = function(attributes,sections){
  Object.entries(systemDefaults)
    .forEach(([section,properties])=>{
      k.debug({section});
      if(section.startsWith('_')){
        return;
      }
      if(/^repeating_/.test(section)){
        properties
          .fields
          .filter((fieldObj)=>
            (
              properties.alternate ?
                !sections[section].length :
                true
            ) &&
            rowMissing(attributes,section,sections[section],fieldObj,))
          .forEach((fieldObj)=>{
            let row = k.generateRowID(section,sections);
            Object.entries(fieldObj).forEach(([field,val])=>{
              attributes[`${row}_${field}`] = val;
            });
          })
      }else{
        attributes[section] = attributes[section] || properties;
      }
    });
};

/**
 * Checks if a given row is missing 
 * @param {object} attributes - The attributes object
 * @param {string} section - The name of the section
 * @param {string[]} sectionArr - Array of row IDs
 * @param {object} fieldObj - Object with the details on what fields to look 
 */
const rowMissing = function(attributes,section,sectionArr,fieldObj){
  return !sectionArr.find(id => attributes[`${section}_${id}_name`] === fieldObj.name);
};