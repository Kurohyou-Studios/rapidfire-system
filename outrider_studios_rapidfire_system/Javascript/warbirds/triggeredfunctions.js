/**
 * Toggles the collapse state of all skills for an npc so they can be edited or not.
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const editNPCSkills = function({trigger,attributes,sections,casc}){
  let collapseSwitch;
  sections.repeating_skill.forEach(id => {
    collapseSwitch = collapseSwitch ||
      (attributes[`repeating_skill_${id}_collapse`] - 1) * -1;
    attributes[`repeating_skill_${id}_collapse`] = collapseSwitch;
  });
  setNPCSkillJustify({attributes,sections})
};
k.registerFuncs({editNPCSkills});

/**
 * Sets the justification method for the NPC skills repcontainer
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const setNPCSkillJustify = function({attributes,sections}){
  const firstRow = `repeating_skill_${sections.repeating_skill[0]}`;
  const collapseSwitch = attributes[`${firstRow}_collapse`];
  const headerAction = collapseSwitch ? 
    'removeClass' :
    'addClass';
  $20('#npc-skill-header')[headerAction]('expand-toggle');

  const action = collapseSwitch ?
    'removeClass' :
    'addClass';
  $20('#npc .skill-container span.inline-fieldset')[action]('expanded-inline-fieldset');
};
k.registerFuncs({setNPCSkillJustify},{type:['opener']});