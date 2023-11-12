/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Calculation Functions
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
  const [mod,baseValue,performance,sa] = attributes.sheet_type === 'npc' ?
    [ 0, attributes[selected],attributes.performance,0 ] :
    [ attributes[`warbird_initiative_mod`], attributes[`${selected}_level`],attributes.performance,attributes.situational_awareness + attributes.situational_awareness_mod ];
  return mod + baseValue + performance + sa;
};
k.registerFuncs({calcWarbirdInitiative});

/**
 * calculates the warbird defense stats
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcWarbirdDefence = function({trigger,attributes,sections,casc}){
  return attributes.performance + attributes.piloting_level + attributes.situational_awareness + attributes.situational_awareness_mod;
};
k.registerFuncs({calcWarbirdDefence});

/**
 * Calculates the escape defense of the warbird
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcDependentDefence = function({trigger,attributes,sections,casc}){
  const def = trigger.name.replace(/_defense/,'');
  const mod = def === 'shoot' ?
    -2 :
    2;
  return attributes.break_defence + mod + attributes[`${trigger.name}_bonus`]
};
k.registerFuncs({calcDependentDefence});

/**
 * Calculates the plane's stunt defence modifer
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcWarbirdStunt = function({trigger,attributes,sections,casc}){
  return attributes.piloting_level + attributes.situational_awareness;
};
k.registerFuncs({calcWarbirdStunt});