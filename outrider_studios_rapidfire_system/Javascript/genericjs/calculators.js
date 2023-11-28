const determinePenalty = function(type,attributes,sections){
  let damageID = sections[`repeating_${type}`].find((id)=> attributes[`repeating_${type}_${id}_damaged`] === 1);
  return damageID ?  attributes[`repeating_${type}_${damageID}_penalty`] : 0;
};

const calcInitiative = function({trigger,attributes,sections}){
  if(attributes.sheet_type === 'npc'){
    return attributes.initiative;
  }
  let awarenessID = sections.repeating_skill.find((id)=>attributes[`repeating_skill_${id}_name`] === 'awareness');
  let awareness = attributes[`repeating_skill_${awarenessID}_level`];
  return awareness + attributes.mind + attributes.initiative_mod;
};
k.registerFuncs({calcInitiative});

const calcDefence = function({trigger,attributes,sections}){
  if(attributes.sheet_type === 'npc'){
    return attributes.defence;
  }
  const defenceSkillID = sections.repeating_skill.find((id)=>attributes[`repeating_skill_${id}_name`] === systemDefaults._defence_skill);
  const defenceSkill = attributes[`repeating_skill_${defenceSkillID}_level`];
  const damagePenalty = determinePenalty('health',attributes,sections);
  const actionPenalty = attributes.action_penalty_automation === 'use input' ?
    attributes.action_penalty :
    0;
  const total =  3 + attributes.body + defenceSkill + (attributes.shield_bonus || 0) + damagePenalty + attributes.defence_mod + actionPenalty;
  return Math.max(total,0);
};
k.registerFuncs({calcDefence});

const totalHealth = function({trigger,attributes,sections}){
  const type = trigger.name.replace(/_max/,'');
  k.debug(`calculating total ${type}`);
  return sections[`repeating_${type}`].reduce((total,id)=>{
    total -= attributes[`repeating_${type}_${id}_damaged`] + attributes[`repeating_${type}_${id}_fill`];
    return total;
  },attributes[`${type}_max`]);
};
k.registerFuncs({totalHealth});

const calcResist = function({attributes}){
  if(attributes.sheet_type === 'npc'){
    return attributes.resist;
  }
  return Math.max(attributes.spirit + attributes.armour_bonus + attributes.resist_mod,0);
};
k.registerFuncs({calcResist});

const calcSA = function({attributes}){
  if(attributes.sheet_type === 'npc'){
    return attributes.situational_awareness;
  }
  const tot =  ['body','mind','spirit'].reduce((m,attr)=>{
    return m + attributes[attr];
  },0);
  return tot;
};
k.registerFuncs({calcSA});