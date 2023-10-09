/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Calculation Functions
const calcRemnantInitiative = function({trigger,attributes,sections}){
  k.debug('calculating remnant initiative');
  let awarenessID = sections.repeating_skill.find((id)=>attributes[`repeating_skill_${id}_name`] === 'awareness');
  let awareness = attributes[`repeating_skill_${awarenessID}_level`];
  let penalty = determinePenalty('structure',attributes,sections);
  return attributes.situational_awareness + awareness + penalty;
};
k.registerFuncs({calcRemnantInitiative});

const calcRemnantDefence = function({trigger,attributes,sections}){
  k.debug('calculating remnant defence');
  let damagePenalty = determinePenalty('structure',attributes,sections);
  k.debug({damagePenalty});
  return Math.max(attributes.speed + attributes.situational_awareness + attributes.motion_level + damagePenalty,0);
};
k.registerFuncs({calcRemnantDefence});

const calcStrikeRange = function({trigger,attributes,sections}){
  k.debug('calculating strike range');
  const [section,rowID,field] = k.parseTriggerName(trigger.name);
  let strike = section ? `${section}_${rowID}_strike` : 'strike_level';
  return attributes[strike] * 100;
};
k.registerFuncs({calcStrikeRange});

const calcRemnantDamage = function({trigger,attributes,sections}){
  k.debug('calculating remnant damage');
  let [section,rowID,field] = k.parseTriggerName(trigger.name);
  let skill = attributes[`${section}_${rowID}_skill`];
  return attributes[`${skill}_damage`] + attributes[`${section}_${rowID}_damage_bonus`];
};
k.registerFuncs({calcRemnantDamage});

/**
 * Calculates the initiative for a warbird.
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcWarbirdInitiative = function({trigger,attributes,sections,casc}){
  const selected = attributes.warbird_initiative_skill;
  if(selected === 'ask') return '??';
  // Otherwise do full calculation
  const [mod,baseValue] = attributes.sheet_type === 'npc' ?
    [ 0, attributes[selected] ] :
    [ attributes[`warbird_initiative_mod`], attributes[`${selected}_level`] ];

  return mod + baseValue;
};
k.registerFuncs({calcWarbirdInitiative});