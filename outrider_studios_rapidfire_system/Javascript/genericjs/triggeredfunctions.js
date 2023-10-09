const checkHealth = function({trigger,attributes,sections}){
  k.debug('checking current health trackers')
  let [section,rowID] = k.parseRepeatName(trigger.name);
  let currDamage = sections[section].indexOf(rowID);
  sections[section].forEach((id,index)=>{
    if(index !== currDamage){
      attributes[`${section}_${id}_damaged`] =  0;
    }
    attributes[`${section}_${id}_fill`] = index < currDamage ? 1 : 0;
  });
};
k.registerFuncs({checkHealth});

const updateTrack = function({section,attributes,sections}){
  let newTracks = attributes[`${section}_max`] - sections[`repeating_${section}`].length;
  if(newTracks > 0){
    _.range(newTracks).forEach((n)=>{
      let newID = generateRowID();
      let priorPenalties = sections[`repeating_${section}`].slice(Math.max(0,sections[`repeating_${section}`].length - 2))
        .map((id)=>{
          return attributes[`repeating_${section}_${id}_penalty`];
        });
      let newPenalty;
      if(priorPenalties[0] !== priorPenalties[1]){
        newPenalty = priorPenalties[1] || priorPenalties[0];
      }else{
        let penStart = priorPenalties[1] || priorPenalties[0];
        newPenalty = Math.max(Math.min(-3,penStart),penStart - 1);
      }
      attributes[`repeating_${section}_${newID}_damaged`] = 0;
      attributes[`repeating_${section}_${newID}_penalty`] = newPenalty;
      sections[`repeating_${section}`].push(newID);
    });
  }else if(newTracks < 0){
    let slicePoint = Math.max(0,sections[`repeating_${section}`].length + newTracks);
    let extraTracks = sections[`repeating_${section}`].slice(slicePoint);
    extraTracks.forEach((id)=>{
      k.removeRepeatingRow(`repeating_${section}_${id}`,attributes,sections);
    });
  }
};
k.registerFuncs({updateTrack});

const maxHealth = function({type,attributes}){
  if(attributes.sheet_type === 'npc' && type !== 'structure') return;
  const typeSwitch = {
    structure:()=> attributes.structure_base,
    health:()=> 3 + attributes.body + attributes.body_mod + attributes.spirit + attributes.spirit_mod + attributes.health_mod
  }
  return Math.max(typeSwitch[type](),1);
};
k.registerFuncs({maxHealth});

const calcHealth = function({trigger,attributes,sections}){
  const type = trigger.name.replace(/_max/,'');
  k.debug(`calculating ${type}`);
  attributes[`${type}_max`] = maxHealth({type,attributes});
  let healthDiff = attributes[`${type}_max`] - k.value(attributes.attributes[`${type}_max`]);
  updateTrack({section:type,attributes,sections});
  attributes[type] = attributes[type] + healthDiff;
  syncHealth({trigger,attributes,sections});
};
k.registerFuncs({calcHealth});

const skillEffects = function({trigger,attributes,sections}){
  let [section,rowID,field] = k.parseRepeatName(trigger.name);
  let skillName = attributes[`${section}_${rowID}_name`];
  const skillSwitch = {
    awareness:['initiative']
  };
  skillSwitch[systemDefaults._defence_skill] = ['defence'];
  if(skillSwitch[skillName]){
    trigger.affects = [...trigger.affects,...skillSwitch[skillName]];
  }
};
k.registerFuncs({skillEffects});

const validateActionPenalty = function({attributes}){
  if(attributes.action_penalty > 0){
    attributes.action_penalty = attributes.action_penalty * -1;
  }
};
k.registerFuncs({validateActionPenalty});

const imageInput = function({trigger,attributes}){
  k.debug('setting image input');
  let [section,rowID,field] = k.parseTriggerName(trigger.name);
  if(!field) return;
  if(!attributes[field]){
    attributes[field] = 'https://s3.amazonaws.com/files.d20.io/images/259054779/OzN3yQwg7MbfXNtMYs-iOg/original.png';
  }
  $20(`.${field.replace(/_/g,'-')} .image-container__input`).removeClass('active');
};
k.registerFuncs({imageInput});

const displayCharacterTypeSections = function({attributes}){
  let typeObj = typeTabs[attributes.sheet_type];
  Object.entries(typeObj).forEach(([action,targetArray])=>{
    k.debug({action,targetArray});
    const targetString = targetArray.map(t => `.${t}`).join(',');
    $20(targetString)[`${action}Class`]('inactive');
  });
};
k.registerFuncs({displayCharacterTypeSections},{type:['opener']});