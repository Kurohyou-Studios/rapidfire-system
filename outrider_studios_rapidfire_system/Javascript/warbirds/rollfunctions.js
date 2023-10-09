/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Roll Functions
//Begins the parsing of a roll
const skillRollDetails = function({section,rowID,sections,attributes,rollObj,actionPenalty}){
  rollObj.header = attributes[`${section}_${rowID}_name`];
  rollObj.header = attributes[`${section}_${rowID}_raw`] ? `^{${rollObj.header}}` : rollObj.header;
  let skill = attributes[`${section}_${rowID}_level`];
  let stat = attributes[`${section}_${rowID}_stat`];
  let penalty = determinePenalty('health',attributes,sections);
  if(stat === 'query'){
    stat = `?{${getTranslationByKey('stat query')}|${['body','mind','spirit'].map((s)=>`${getTranslationByKey(s)},@{${s}}[${s}]`).join('|')}}`;
  }else{
    stat = `[[0@{${stat}}]][${stat}]`;
  }
  rollObj.roll = `[[1d6 + ${stat} + [[0${skill}]][${rollObj.header}] + ${penalty}[Damage Penalty]${actionPenalty}]]`;
};

//determines which health track's penalties should affect an attribute
const determineHealthType = function(section,field){
  const attrCharacterLookup = {
    'situational-awareness':'structure',
    'remnant-initiative':'structure',
    'assault-roll':'structure',
    'strike-roll':'structure',
    'motion-roll':'structure',
    'warbird-initiative':'structure',
    repeating_drone:'structure',
    'repeating_remnant-weapon':'structure'
  };
  return attrCharacterLookup[section] || attrCharacterLookup[field] || 'health';
};

const weaponRollDetails = function({section,rowID,field,sections,attributes,rollObj,actionPenalty}){
  rollObj.header = attributes[`${section}_${rowID}_name`];
  let skill;
  let stat;
  let healthType = determineHealthType(section,field);
  let penalty = determinePenalty(healthType,attributes,sections);
  const row = `${section}_${rowID}`;
  if(section === 'repeating_weapon'){
    if(attributes.sheet_type === 'npc'){
      rollObj.roll = `[[1d6 + ${attributes[`${row}_accuracy`]}]]`;
    }else{
      let skillID = sections.repeating_skill.find((id)=>attributes[`repeating_skill_${id}_name`] === attributes[`${section}_${rowID}_skill`]);
      let skillRef = `repeating_skill_${skillID}`;
      skill = attributes[`${skillRef}_level`];
      stat = attributes[`${skillRef}_stat`];
      if(stat === 'query'){
        stat = `?{${getTranslationByKey('stat query')}|${['body','mind','spirit'].map((s)=>`${getTranslationByKey(s)},@{${s}}[${s}]`).join('|')}}`;
      }else{
        stat = `@{${stat}}[${stat}]`;
      }
      rollObj.roll = `[[1d6 + ${stat} + ${skill}[${attributes[`${skillRef}_name`]}] + ${penalty}[Damage Penalty]${actionPenalty}]]`;
    }
    rollObj.damage = `[[${attributes[`${row}_damage`]} + Lead]]`;
  }
  
  rollObj.description = `@{${row}_notes}`;
};

const initiateRoll = function(event){
  let [section,rowID,field] = k.parseTriggerName(event.triggerName);
  field = field.replace(/-action/,'');
  const rollSwitch = {
    repeating_weapon:weaponRollDetails,
    repeating_skill:skillRollDetails,
    'repeating_remnant-weapon':weaponRollDetails
  };
  k.getAllAttrs({props:['difficulty','action_penalty_automation',...k.baseGet],callback:async (attributes,sections)=>{
    let rollObj = {status:'[[0[computed value]]]'};
    let actionPenalty = determineActionPenalty(attributes);
    if(!section){
      //Base rolling for simple stats
      let healthType = determineHealthType(section,field);
      let penalty = determinePenalty(healthType,attributes,sections);
      rollObj.header = `^{${field.replace(/-/g,' ')}}`;//output translation of name
      rollObj.roll = `[[1d6 + [[0@{${field.replace(/-/g,'_')}}]][${field.replace(/-/g,' ')}] + ${penalty}[Damage Penalty]${actionPenalty}${/initiative/.test(field) ? '&{tracker}' : ''}]]`;
    }else{
      //rolling for more complex fields. These are typically repeating sections
      if(section === 'repeating_drone'){
        await rollSwitch[section]({section,rowID,field,sections,attributes,rollObj,actionPenalty});
      }else{
        rollSwitch[section]({section,rowID,field,sections,attributes,rollObj,actionPenalty});
      }
    }
    if(attributes.difficulty && !/initiative/.test(field)){
      rollObj.difficulty = `[[?{${getTranslationByKey('difficulty query')}|0}]]`;
      rollObj.damage_label = rollObj.damage ? undefined : '[[0[computed value]]]';
      rollObj.damage = rollObj.damage || `[[0[computed value]]]`;
    }
    if(!rollObj.damage && !rollObj.difficulty){
      rollObj.singleroll = 'true';
    }
    executeRoll(rollObj);
  }});
};
k.registerFuncs({initiateRoll});

const determineActionPenalty = function(attributes){
  const stateSwitch = {
    disabled:'',
    ask:`+ [[abs(0?{${getTranslationByKey('action penalty query')}|0}) * -1]][Action Penalty]`,
    'use input':`+ ${attributes.action_penalty}[Action Penalty]`
  };
  return stateSwitch[attributes.action_penalty_automation];
};

const executeRoll = async function(rollObj){
  let rollText = Object.entries(rollObj).reduce((text,[field,content])=>{
    if(content){
      text += `{{${field}=${content}}}`;
    }
    return text;
  },'@{template_start}');
  let roll = await startRoll(rollText);
  const computeObj = {};
  if(roll.results.roll1){
    computeMultipleRolls(roll.results,computeObj,rollObj);
  }else{
    computeSingleRoll(roll.results,computeObj,rollObj);
  }
  finishRoll(roll.rollId,computeObj);
};

const computeMultipleRolls = function(results,computeObj,rollObj){
  let rollNums = [6,5,4,3,2,1].find((num)=>results.hasOwnProperty(`roll${num}`));
  computeObj[`damage`] = rollObj[`damage`] && rollObj.difficulty ? 0 : undefined;
  _.range(rollNums).forEach((n)=>{
    let num = n + 1;
    if(rollObj[`damage`] && rollObj.difficulty){
      let damage = results[`damage`].result + (results[`roll${num}`].result - results.difficulty.result);
      if(damage < results[`damage`].result){
        damage = 0;
      }
      computeObj.damage += damage;
    }
    if(rollObj.difficulty){
      computeObj[`status`] = checkResult(results[`roll${num}`],results.difficulty);
    }
  });
};

const computeSingleRoll = function(results,computeObj,rollObj){
  if(rollObj.damage && rollObj.difficulty){
    computeObj.damage = results.damage.result + (results.roll.result - results.difficulty.result);
  }
  if(results.damage_label){
    computeObj.damage_label = getTranslationByKey(computeObj.damage < 0 ? 'trail' : 'lead');
  }
  if(rollObj.difficulty){
    computeObj[`status`] = checkResult(results[`roll`],results.difficulty);
  }
};

const checkResult = function(roll,difficulty){
  return roll.result - difficulty.result;
};

/**
 * Rolls an attack for an NPC (gunnery or ordinance)
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const npcAttack = function({trigger,attributes,sections,casc}){
  const attackName = trigger.name.replace(/npc-|-action/g,'').replace(/-/g,' ');
  const stat = attributes[`npc_${attackName}`];
  const damageStat = attributes[`npc_${attackName}_damage`];
  const rollObj = {status:'[[0[computed value]]]'};
  let actionPenalty = determineActionPenalty(attributes);
  let healthType = 'structure';
  let damagePenalty = determinePenalty(healthType,attributes,sections);
  rollObj.header = `^{${attackName}}`;//output translation of name
  if(attributes.difficulty){
    rollObj.difficulty = `[[?{${getTranslationByKey('difficulty query')}|0}]]`;
  }
  rollObj.roll = `[[1d6 + ${stat}[${k.capitalize(getTranslationByKey(attackName))}] + ${damagePenalty}[${k.capitalize(getTranslationByKey('damage penalty'))}]${actionPenalty}]]`;
  rollObj.damage = `[[${damageStat} + ${k.capitalize(getTranslationByKey('lead'))}]]`;
  executeRoll(rollObj);
};
k.registerFuncs({npcAttack});