// This code adapted from Nic Bradley's R20 test framework from the WFRP4e official sheet.
import { vi } from 'vitest';
import { _ } from 'underscore';
/**
 * @namespace {object} mock20
 */
/**
 * @memberof mock20
 * @var
 * A mock environment variable for keeping track of triggers, other character information, and predefined query results.
 * @property {array} triggers - The triggers that have been registered by `on`
 * @property {object} queryResponses - Pre defined results you want the roll parser to use for a given roll query. Keys in the objects are roll query prompts. Values are what the user input should be for that query.
 */
const environment = {
  attributes:{"collapsed":"","system":"remnants","sheet_state":"settings","difficulty":"1","action_penalty_automation":"disabled","sheet_type":"character","whisper":" ","character_name":"","player_name":"","nationality":"","organization_affiliations":"","appearance/mannerisms":"","health_max":"0","stat_points":"","reserve":"","body_action":"","body":"0","body_mod":"","mind_action":"","mind":"0","mind_mod":"","spirit_action":"","spirit":"0","spirit_mod":"","easy_living":"","fame":"2","fame_points":"","initiative_action":"","initiative":"0","initiative_mod":"","defence":"3","defence_mod":"","resist":"0","resist_mod":"","health":"","health_mod":"","armour_bonus":"","action_penalty":"","structure_max":"0","warbird_nose":"https://s3.amazonaws.com/files.d20.io/images/270598775/-4fyt16JZqo_JLLhKpGeCQ/original.jpg","situational_awareness_action":"","situational_awareness":"","situational_awareness_mod":"","warbird_initiative_action":"","warbird_initiative_skill":"piloting","warbird_initiative":"","warbird_initiative_mod":"","piloting_action":"","piloting_level":"","piloting_experience":"","strafing_action":"","strafing_level":"","strafing_experience":"","gunnery_action":"","gunnery_level":"","gunnery_experience":"","ordinance_action":"","ordinance_level":"","ordinance_experience":"","performance":"","armour":"","break_defence":"","break_defence_bonus":"","shoot_defence":"","shoot_defence_bonus":"","escape_defence":"","escape_defence_bonus":"","stunt_action":"","stunt":"","stunt_bonus":"","structure":"","structure_base":"5","threat":"","threat_max":"","large-structure_max":"0","character_description":"","dogfighting":"","strafing":"","npc_gunnery_action":"","npc_gunnery":"2","npc_gunnery_damage":"","npc_ordinance_action":"","npc_ordinance":"2","npc_ordinance_damage":"","template_start":"&{template:rapidfire} {{character_name=@{character_name}}} {{character_id=@{character_id}}} {{system=@{system}}}"},
  triggers: [],
  otherCharacters: {
    // Attribute information of other test characters indexed by character name
  },
  queryResponses:{
    // object defining which value to use for roll queries, indexed by prompt text
  }
};
global.environment = environment;

const on = vi.fn((trigger, func) => {
  environment.triggers.push({ trigger, func });
});
global.on = on;
const getAttrs = vi.fn((query, callback) => {
  let values = {};
  for (const attr of query) {
    if (attr in environment.attributes) values[attr] = environment.attributes[attr];
  }
  if (typeof callback === "function") callback(values);
});
global.getAttrs = getAttrs;
const setAttrs = vi.fn((submit, params, callback) => {
  if (!callback && typeof params === "function") callback = params;
  for (const attr in submit) {
    environment.attributes[attr] = submit[attr];
  }
  if (typeof callback === "function") callback();
});
global.setAttrs = setAttrs;
const getSectionIDs = vi.fn((section, callback) => {
  const ids = [];
  const sectionName = section.indexOf("repeating_") === 0 ? section : `repeating_${section}`;
  const attributes = environment.attributes;
  for (const attr in attributes) {
    if (attr.indexOf(sectionName) === 0) ids.push(attr.split("_")[2]);
  }
  const idMap = [...new Set(ids)];
  if (typeof callback === "function") callback(idMap);
});
global.getSectionIDs = getSectionIDs;
const getSectionIDsSync = vi.fn((section) => {
  const ids = [];
  const sectionName = section.indexOf("repeating_") === 0 ? section : `repeating_${section}`;
  const attributes = environment.attributes;
  for (const attr in attributes) {
    if (attr.indexOf(sectionName) === 0) ids.push(attr.split("_")[2]);
  }
  const idMap = [...new Set(ids)];
  return idMap;
});
global.getSectionIDsSync = getSectionIDsSync;
const removeRepeatingRow = vi.fn((id) => {
  const attributes = environment.attributes;
  for (const attr in attributes) {
    if (attr.indexOf(id) > -1) delete environment.attributes[attr];
  }
});
global.removeRepeatingRow = removeRepeatingRow;
const getCompendiumPage = vi.fn((request, callback) => {
  const pages = compendiumData;
  if (!pages)
    throw new Error(
      "Tried to use getCompendiumPage, but testing environment does not contain compendiumData."
    );
  if (typeof request === "string") {
    const [category, pageName] = request.split(":");
    const response = {
      Name: pageName,
      Category: category,
      data: {},
    };
    if (pages[request]) response.data = pages[request].data;
    if (typeof callback === "function") callback(response);
  } else if (Array.isArray(request)) {
    const pageArray = [];
    for (const page of request) {
      if (pages[request] && pages[request].Category === category) pageArray.push(pages[pageName]);
    }
    if (typeof callback === "function") callback(pageArray);
  }
});
global.getCompendiumPage = getCompendiumPage;
const generateUUID = vi.fn(() => {
  var a = 0,
    b = [];
  return (function () {
    var c = new Date().getTime() + 0,
      d = c === a;
    a = c;
    for (var e = Array(8), f = 7; 0 <= f; f--)
      (e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64)),
      (c = Math.floor(c / 64));
    c = e.join("");
    if (d) {
      for (f = 11; 0 <= f && 63 === b[f]; f--) b[f] = 0;
      b[f]++;
    } else for (f = 0; 12 > f; f++) b[f] = Math.floor(64 * Math.random());
    for (f = 0; 12 > f; f++)
      c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
    return c.replace(/_/g, "z");
  })();
});
global.generateUUID = generateUUID;
const generateRowID = vi.fn(() => {
  return generateUUID().replace(/_/g, "Z");
});
global.generateRowID = generateRowID;
const simulateEvent = vi.fn((event) => {
  environment.triggers.forEach((trigger) => {
    const splitTriggers = trigger.trigger.split(" ") || [trigger.trigger];
    splitTriggers.forEach((singleTrigger) => {
      if (event === singleTrigger) {
        trigger.func({
          sourceAttribute: "test",
        });
      }
    });
  });
});
global.simulateEvent = simulateEvent;
const getTranslationByKey = vi.fn((key) => key);
global.getTranslationByKey = getTranslationByKey;
// Roll Handlingglobal.getTranslationByKey = getTranslationByKey;

const extractRollTemplate = (rollString) => {
  const rollTemplate = rollString.match(/&\{template:(.*?)\}/)?.[1];
  environment.attributes.__rolltemplate = rollTemplate;
};

const cleanRollElements = (value) => {
  const cleanText = value
    .replace(/\{\{|\}}(?=$|\s|\{)/g, "")
    .replace(/=/,'===SPLITHERE===');
  const splitText = cleanText.split("===SPLITHERE===");
  return splitText;
};

const extractRollElements = (rollString) => {
  const rollElements = rollString.match(/\{\{(.*?)\}{2,}(?=$|\s|\{)/g);
  if (!rollElements || rollElements.length < 1) return {}
  return  Object.fromEntries(rollElements.map(cleanRollElements));
};

const getExpression = (element) => element.replace(/(\[\[|\]\])/gi, "");

const getDiceOrHalf = (size) => {
  const diceStack = environment.diceStack;
  if (!diceStack?.[size] || diceStack[size].length < 0) return size / 2;
  return environment.diceStack[size].pop();
};

const getDiceRolls = (expression) => {
  const rolls = expression.match(/([0-9]+)?d([0-9]+)/gi);
  if (!rolls) return [];
  const allRolls = [];
  rolls.forEach((roll) => {
    const [number, size] = roll.split(/d/i);
    for (let i = 1; i <= number; i++) {
      const dice = getDiceOrHalf(size);
      allRolls.push(dice);
    }
  });
  return allRolls;
};

const calculateResult = (startExpression, dice) => {
  let expression = startExpression.replace(/\[.+?\]/g,'')

  const rolls = expression.match(/([0-9]+)?d([0-9]+)/gi);
  if (!rolls) return eval(expression);
  rolls.forEach((roll, index) => {
    const [number, size] = roll.split(/d/i);
    let total = 0;
    for (let i = 1; i <= number; i++) {
      total += +dice.shift();
    }
    expression = expression.replace(/([0-9]+d[0-9]+([+\-*/][0-9]+)?)(.*?)$/gi, "$1");
    const regex = new RegExp(roll, "gi");
    expression = expression.replace(regex, total);
  });

  return eval(expression);
};

const replaceAttributes = (element) => {
  const test = /@\{(.*?)\}/i;
  while (test.test(element)) {
    element = element.replace(/@\{(.*?)\}/gi, (sub, ...args) => {
      const attributeName = args[0];
      const attributeValue = environment.attributes[attributeName];
      const attributeExists = typeof attributeValue !== "undefined";
      const possibleAttributes = Object.keys(environment.attributes);
      if (attributeExists) return attributeValue;
      else
        throw new Error(
          `Roll called ${sub} but no corresponding attribute "${attributeName}" was found. Attributes are: ${possibleAttributes.join(
            ", "
          )}`
        );
    });
  }
  return element;
};

const replaceQueries = (element) => {
  return element.replace(/\?\{(.+?)[|}]([^}]+?\})?/g,(match,p,a) => {
    a = a?.split(/\s*\|\s*/) || [];
    return environment.queryResponses[p] || a[0] || '';
  });
};

const calculateRollResult = (rollElements) => {
  const results = {};
  for (const key in rollElements) {
    const element = rollElements[key];
    if (element.indexOf("[[") === -1) continue;
    const attributeFilled = replaceAttributes(element);
    const queryAnswered = replaceQueries(attributeFilled);
    const expression = getExpression(queryAnswered);
    const dice = getDiceRolls(expression);
    const result = calculateResult(expression, [...dice]);
    results[key] = {
      result,
      dice,
      expression,
    };
  }
  return results;
};

const startRoll = vi.fn(async (rollString) => {
  if (!rollString) throw new Error("startRoll expected a Roll String but none was provided.");
  const rollResult = { results: {} };
  extractRollTemplate(rollString);
  const rollElements = extractRollElements(rollString);
  rollResult.results = calculateRollResult(rollElements);
  rollResult.rollId = generateUUID();
  return rollResult;
});
global.startRoll = startRoll;
const finishRoll = vi.fn(() => {});
global.finishRoll = finishRoll;
//# sourceURL=warbirds.js
  
  const k = (function(){
  const kFuncs = {};
  
  const cascades = {"attr_character_name":{"name":"character_name","type":"text","defaultValue":"","affects":[],"triggeredFuncs":["setActionCalls"],"listenerFunc":"accessSheet","listener":"change:character_name"},"attr_collapsed":{"name":"collapsed","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_system":{"name":"system","type":"hidden","defaultValue":"remnants","triggeredFuncs":[],"affects":[]},"attr_sheet_state":{"name":"sheet_state","type":"hidden","defaultValue":"settings","triggeredFuncs":[],"affects":[]},"act_nav-character":{"listenerFunc":"navigateSheet","name":"nav-character","listener":"clicked:nav-character","type":"action"},"act_nav-npc":{"listenerFunc":"navigateSheet","name":"nav-npc","listener":"clicked:nav-npc","type":"action"},"act_nav-large-vehicle":{"listenerFunc":"navigateSheet","name":"nav-large-vehicle","listener":"clicked:nav-large-vehicle","type":"action"},"act_nav-settings":{"listenerFunc":"navigateSheet","name":"nav-settings","listener":"clicked:nav-settings","type":"action"},"act_nav-warbird":{"listenerFunc":"navigateSheet","name":"nav-warbird","listener":"clicked:nav-warbird","type":"action"},"act_nav-npc-warbird":{"listenerFunc":"navigateSheet","name":"nav-npc-warbird","listener":"clicked:nav-npc-warbird","type":"action"},"attr_difficulty":{"name":"difficulty","type":"checkbox","defaultValue":"1","triggeredFuncs":[],"affects":[]},"attr_action_penalty_automation":{"name":"action_penalty_automation","type":"select","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_sheet_type":{"triggeredFuncs":["displayCharacterTypeSections"],"name":"sheet_type","listener":"change:sheet_type","listenerFunc":"accessSheet","type":"select","defaultValue":"","affects":[]},"attr_whisper":{"name":"whisper","type":"select","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_player_name":{"name":"player_name","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_nationality":{"name":"nationality","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_organization_affiliations":{"name":"organization_affiliations","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_appearance/mannerisms":{"name":"appearance/mannerisms","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_health_max":{"name":"health_max","type":"hidden","defaultValue":0,"triggeredFuncs":["calcHealth"],"affects":["defence"],"listener":"change:health_max","listenerFunc":"accessSheet"},"attr_repeating_health_$X_name":{"name":"repeating_health_$X_name","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_health_$X_fill":{"name":"repeating_health_$X_fill","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_health_$X_damaged":{"affects":["health"],"triggeredFuncs":["checkHealth"],"name":"repeating_health_$X_damaged","listener":"change:repeating_health:damaged","listenerFunc":"accessSheet","type":"checkbox","defaultValue":0},"act_repeating_health_$X_clear":{"listenerFunc":"clearTracker","name":"repeating_health_$X_clear","listener":"clicked:repeating_health:clear","type":"action"},"attr_repeating_health_$X_penalty":{"affects":["defence"],"name":"repeating_health_$X_penalty","listener":"change:repeating_health:penalty","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_stat_points":{"name":"stat_points","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_reserve":{"name":"reserve","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"act_body-action":{"listenerFunc":"initiateRoll","name":"body-action","listener":"clicked:body-action","type":"action"},"attr_body_action":{"name":"body_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_body":{"affects":["defence","health_max","situational_awareness"],"name":"body","listener":"change:body","listenerFunc":"accessSheet","type":"select","defaultValue":"","triggeredFuncs":[]},"attr_body_mod":{"affects":["defence","health_max","situational_awareness"],"name":"body_mod","listener":"change:body_mod","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"act_mind-action":{"listenerFunc":"initiateRoll","name":"mind-action","listener":"clicked:mind-action","type":"action"},"attr_mind_action":{"name":"mind_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_mind":{"affects":["initiative","situational_awareness"],"name":"mind","listener":"change:mind","listenerFunc":"accessSheet","type":"select","defaultValue":"","triggeredFuncs":[]},"attr_mind_mod":{"affects":["initiative","situational_awareness"],"name":"mind_mod","listener":"change:mind_mod","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"act_spirit-action":{"listenerFunc":"initiateRoll","name":"spirit-action","listener":"clicked:spirit-action","type":"action"},"attr_spirit_action":{"name":"spirit_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_spirit":{"affects":["resist","health_max","situational_awareness"],"name":"spirit","listener":"change:spirit","listenerFunc":"accessSheet","type":"select","defaultValue":"","triggeredFuncs":[]},"attr_spirit_mod":{"affects":["resist","health_max","situational_awareness"],"name":"spirit_mod","listener":"change:spirit_mod","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_easy_living":{"name":"easy_living","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_fame":{"name":"fame","type":"number","defaultValue":2,"triggeredFuncs":[],"affects":[]},"attr_fame_points":{"name":"fame_points","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"act_add-equipment":{"listenerFunc":"addItem","name":"add-equipment","listener":"clicked:add-equipment","type":"action"},"attr_repeating_equipment_$X_collapse":{"name":"repeating_equipment_$X_collapse","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_equipment_$X_name":{"name":"repeating_equipment_$X_name","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_equipment_$X_quantity":{"name":"repeating_equipment_$X_quantity","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_equipment_$X_notes":{"name":"repeating_equipment_$X_notes","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_add-skill":{"listenerFunc":"addItem","name":"add-skill","listener":"clicked:add-skill","type":"action"},"attr_repeating_skill_$X_raw":{"name":"repeating_skill_$X_raw","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_skill_$X_name":{"name":"repeating_skill_$X_name","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_repeating_skill_$X_action":{"listenerFunc":"initiateRoll","name":"repeating_skill_$X_action","listener":"clicked:repeating_skill:action","type":"action"},"attr_repeating_skill_$X_action":{"name":"repeating_skill_$X_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_skill_$X_level":{"triggeredFuncs":["skillEffects"],"name":"repeating_skill_$X_level","listener":"change:repeating_skill:level","listenerFunc":"accessSheet","type":"number","defaultValue":0,"affects":[]},"attr_repeating_skill_$X_stat":{"name":"repeating_skill_$X_stat","type":"select","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_skill_$X_xp":{"name":"repeating_skill_$X_xp","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"act_initiative-action":{"listenerFunc":"initiateRoll","name":"initiative-action","listener":"clicked:initiative-action","type":"action"},"attr_initiative_action":{"name":"initiative_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_initiative":{"calculation":"calcInitiative","name":"initiative","type":"number","defaultValue":"0","triggeredFuncs":[],"affects":[]},"attr_initiative_mod":{"affects":["initiative"],"name":"initiative_mod","listener":"change:initiative_mod","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_defence":{"calculation":"calcDefence","name":"defence","type":"number","defaultValue":3,"triggeredFuncs":[],"affects":[]},"attr_defence_mod":{"affects":["defence"],"name":"defence_mod","listener":"change:defence_mod","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_resist":{"calculation":"calcResist","name":"resist","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_resist_mod":{"affects":["resist"],"name":"resist_mod","listener":"change:resist_mod","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_health":{"affects":["defence"],"calculation":"totalHealth","initialFunc":"syncHealth","name":"health","listener":"change:health","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_health_mod":{"affects":["health_max"],"name":"health_mod","listener":"change:health_mod","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_armour_bonus":{"affects":["resist"],"name":"armour_bonus","listener":"change:armour_bonus","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_action_penalty":{"triggeredFuncs":["validateActionPenalty"],"affects":["defence"],"name":"action_penalty","listener":"change:action_penalty","listenerFunc":"accessSheet","type":"number","defaultValue":0},"act_add-advantage":{"listenerFunc":"addItem","name":"add-advantage","listener":"clicked:add-advantage","type":"action"},"attr_repeating_advantage_$X_collapse":{"name":"repeating_advantage_$X_collapse","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_advantage_$X_name":{"name":"repeating_advantage_$X_name","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_advantage_$X_notes":{"name":"repeating_advantage_$X_notes","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_add-disadvantage":{"listenerFunc":"addItem","name":"add-disadvantage","listener":"clicked:add-disadvantage","type":"action"},"attr_repeating_disadvantage_$X_collapse":{"name":"repeating_disadvantage_$X_collapse","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_disadvantage_$X_name":{"name":"repeating_disadvantage_$X_name","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_disadvantage_$X_notes":{"name":"repeating_disadvantage_$X_notes","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_add-adjustment":{"listenerFunc":"addItem","name":"add-adjustment","listener":"clicked:add-adjustment","type":"action"},"attr_repeating_adjustment_$X_collapse":{"name":"repeating_adjustment_$X_collapse","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_adjustment_$X_name":{"name":"repeating_adjustment_$X_name","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_adjustment_$X_notes":{"name":"repeating_adjustment_$X_notes","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_add-weapon":{"listenerFunc":"addItem","name":"add-weapon","listener":"clicked:add-weapon","type":"action"},"attr_repeating_weapon_$X_collapse":{"name":"repeating_weapon_$X_collapse","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"act_repeating_weapon_$X_action":{"listenerFunc":"initiateRoll","name":"repeating_weapon_$X_action","listener":"clicked:repeating_weapon:action","type":"action"},"attr_repeating_weapon_$X_action":{"name":"repeating_weapon_$X_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_weapon_$X_name":{"name":"repeating_weapon_$X_name","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_weapon_$X_skill":{"name":"repeating_weapon_$X_skill","type":"hidden","defaultValue":"select","triggeredFuncs":[],"affects":[]},"act_repeating_weapon_$X_skill-action":{"listenerFunc":"dynamicSelect","name":"repeating_weapon_$X_skill-action","listener":"clicked:repeating_weapon:skill-action","type":"action"},"attr_repeating_weapon_$X_translate_skill":{"name":"repeating_weapon_$X_translate_skill","type":"checkbox","defaultValue":"1","triggeredFuncs":[],"affects":[]},"attr_repeating_weapon_$X_damage":{"name":"repeating_weapon_$X_damage","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_weapon_$X_notes":{"name":"repeating_weapon_$X_notes","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_structure_max":{"name":"structure_max","type":"hidden","defaultValue":0,"triggeredFuncs":["calcHealth"],"affects":[],"listener":"change:structure_max","listenerFunc":"accessSheet"},"attr_repeating_structure_$X_name":{"name":"repeating_structure_$X_name","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_structure_$X_fill":{"name":"repeating_structure_$X_fill","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_structure_$X_damaged":{"affects":["structure"],"triggeredFuncs":["checkHealth"],"name":"repeating_structure_$X_damaged","listener":"change:repeating_structure:damaged","listenerFunc":"accessSheet","type":"checkbox","defaultValue":0},"act_repeating_structure_$X_clear":{"listenerFunc":"clearTracker","name":"repeating_structure_$X_clear","listener":"clicked:repeating_structure:clear","type":"action"},"attr_repeating_structure_$X_penalty":{"affects":["break_defence"],"name":"repeating_structure_$X_penalty","listener":"change:repeating_structure:penalty","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_warbird_nose":{"triggeredFuncs":["imageInput"],"name":"warbird_nose","listener":"change:warbird_nose","listenerFunc":"accessSheet","type":"text","defaultValue":"https://s3.amazonaws.com/files.d20.io/images/270598775/-4fyt16JZqo_JLLhKpGeCQ/original.jpg","affects":[]},"act_warbird-nose":{"listenerFunc":"toggleImageInput","name":"warbird-nose","listener":"clicked:warbird-nose","type":"action"},"act_situational-awareness-action":{"listenerFunc":"initiateRoll","name":"situational-awareness-action","listener":"clicked:situational-awareness-action","type":"action"},"attr_situational_awareness_action":{"name":"situational_awareness_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_situational_awareness":{"affects":["warbird_initiative","break_defence"],"calculation":"calcSA","name":"situational_awareness","listener":"change:situational_awareness","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_situational_awareness_mod":{"affects":["situational_awareness"],"name":"situational_awareness_mod","listener":"change:situational_awareness_mod","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"act_warbird-initiative-action":{"listenerFunc":"initiateRoll","name":"warbird-initiative-action","listener":"clicked:warbird-initiative-action","type":"action"},"attr_warbird_initiative_action":{"name":"warbird_initiative_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_warbird_initiative_skill":{"name":"warbird_initiative_skill","type":"select","defaultValue":"","triggeredFuncs":[],"affects":["warbird_initiative"],"listener":"change:warbird_initiative_skill","listenerFunc":"accessSheet"},"attr_warbird_initiative":{"type":"text","calculation":"calcWarbirdInitiative","name":"warbird_initiative","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_warbird_initiative_mod":{"affects":["warbird_initiative"],"name":"warbird_initiative_mod","listener":"change:warbird_initiative_mod","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"act_piloting-action":{"listenerFunc":"initiateRoll","name":"piloting-action","listener":"clicked:piloting-action","type":"action"},"attr_piloting_action":{"name":"piloting_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_piloting_level":{"affects":["dogfighting_rating","break_defence","stunt","warbird_initiative"],"name":"piloting_level","listener":"change:piloting_level","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_piloting_experience":{"name":"piloting_experience","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"act_strafing-action":{"listenerFunc":"initiateRoll","name":"strafing-action","listener":"clicked:strafing-action","type":"action"},"attr_strafing_action":{"name":"strafing_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_strafing_level":{"affects":["strafing_rating","warbird_initiative"],"name":"strafing_level","listener":"change:strafing_level","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_strafing_experience":{"name":"strafing_experience","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"act_gunnery-action":{"listenerFunc":"initiateRoll","name":"gunnery-action","listener":"clicked:gunnery-action","type":"action"},"attr_gunnery_action":{"name":"gunnery_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_gunnery_level":{"affects":["gunnery_rating","warbird_initiative"],"name":"gunnery_level","listener":"change:gunnery_level","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_gunnery_experience":{"name":"gunnery_experience","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"act_ordinance-action":{"listenerFunc":"initiateRoll","name":"ordinance-action","listener":"clicked:ordinance-action","type":"action"},"attr_ordinance_action":{"name":"ordinance_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_ordinance_level":{"affects":["ordinance_rating","warbird_initiative"],"name":"ordinance_level","listener":"change:ordinance_level","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_ordinance_experience":{"name":"ordinance_experience","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_performance":{"affects":["break_defence"],"name":"performance","listener":"change:performance","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_armour":{"name":"armour","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_break_defence":{"affects":["shoot_defence","escape_defence"],"calculation":"calcWarbirdDefence","name":"break_defence","listener":"change:break_defence","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_break_defence_bonus":{"affects":["break_defence"],"name":"break_defence_bonus","listener":"change:break_defence_bonus","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_shoot_defence":{"calculation":"calcDependentDefence","name":"shoot_defence","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_shoot_defence_bonus":{"affects":["shoot_defence"],"name":"shoot_defence_bonus","listener":"change:shoot_defence_bonus","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_escape_defence":{"calculation":"calcDependentDefence","name":"escape_defence","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_escape_defence_bonus":{"affects":["escape_defence"],"name":"escape_defence_bonus","listener":"change:escape_defence_bonus","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"act_stunt-action":{"listenerFunc":"initiateRoll","name":"stunt-action","listener":"clicked:stunt-action","type":"action"},"attr_stunt_action":{"name":"stunt_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_stunt":{"calculation":"calcWarbirdStunt","name":"stunt","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_stunt_bonus":{"affects":["stunt"],"name":"stunt_bonus","listener":"change:stunt_bonus","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_structure":{"calculation":"totalHealth","initialFunc":"syncHealth","name":"structure","listener":"change:structure","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_structure_base":{"affects":["structure_max"],"name":"structure_base","listener":"change:structure_base","listenerFunc":"accessSheet","type":"number","defaultValue":5,"triggeredFuncs":[]},"act_add-trait":{"listenerFunc":"addItem","name":"add-trait","listener":"clicked:add-trait","type":"action"},"attr_repeating_trait_$X_collapse":{"name":"repeating_trait_$X_collapse","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_trait_$X_name":{"name":"repeating_trait_$X_name","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_trait_$X_effects":{"name":"repeating_trait_$X_effects","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_trait_$X_description":{"name":"repeating_trait_$X_description","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_add-warbird-weapon":{"listenerFunc":"addItem","name":"add-warbird-weapon","listener":"clicked:add-warbird-weapon","type":"action"},"attr_repeating_warbird-weapon_$X_collapse":{"name":"repeating_warbird-weapon_$X_collapse","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"act_repeating_warbird-weapon_$X_action":{"listenerFunc":"initiateRoll","name":"repeating_warbird-weapon_$X_action","listener":"clicked:repeating_warbird-weapon:action","type":"action"},"attr_repeating_warbird-weapon_$X_action":{"name":"repeating_warbird-weapon_$X_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_warbird-weapon_$X_name":{"name":"repeating_warbird-weapon_$X_name","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_warbird-weapon_$X_skill":{"name":"repeating_warbird-weapon_$X_skill","type":"select","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_warbird-weapon_$X_accuracy":{"name":"repeating_warbird-weapon_$X_accuracy","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_warbird-weapon_$X_accuracy_bonus":{"name":"repeating_warbird-weapon_$X_accuracy_bonus","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_warbird-weapon_$X_damage":{"calculation":"calcVehicleDamage","name":"repeating_warbird-weapon_$X_damage","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_warbird-weapon_$X_damage_bonus":{"affects":["repeating_warbird-weapon_$x_damage"],"name":"repeating_warbird-weapon_$X_damage_bonus","listener":"change:repeating_warbird-weapon:damage_bonus","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_repeating_warbird-weapon_$X_ammo":{"name":"repeating_warbird-weapon_$X_ammo","type":"radio","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_warbird-weapon_$X_notes":{"name":"repeating_warbird-weapon_$X_notes","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_threat":{"name":"threat","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_threat_max":{"name":"threat_max","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_large-structure_max":{"name":"large-structure_max","type":"hidden","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_large-structure_$X_name":{"name":"repeating_large-structure_$X_name","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_large-structure_$X_fill":{"name":"repeating_large-structure_$X_fill","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_large-structure_$X_damaged":{"affects":["large-structure"],"triggeredFuncs":["checkHealth"],"name":"repeating_large-structure_$X_damaged","listener":"change:repeating_large-structure:damaged","listenerFunc":"accessSheet","type":"checkbox","defaultValue":0},"act_repeating_large-structure_$X_clear":{"listenerFunc":"clearTracker","name":"repeating_large-structure_$X_clear","listener":"clicked:repeating_large-structure:clear","type":"action"},"attr_repeating_large-structure_$X_penalty":{"affects":["large_defence"],"name":"repeating_large-structure_$X_penalty","listener":"change:repeating_large-structure:penalty","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"act_add-vehicle":{"listenerFunc":"addItem","name":"add-vehicle","listener":"clicked:add-vehicle","type":"action"},"attr_repeating_vehicle_$X_collapse":{"name":"repeating_vehicle_$X_collapse","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_name":{"name":"repeating_vehicle_$X_name","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_component_defence":{"name":"repeating_vehicle_$X_component_defence","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_component_armour":{"name":"repeating_vehicle_$X_component_armour","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"act_repeating_vehicle_$X_action":{"listenerFunc":"initiateRoll","name":"repeating_vehicle_$X_action","listener":"clicked:repeating_vehicle:action","type":"action"},"attr_repeating_vehicle_$X_action":{"name":"repeating_vehicle_$X_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_accuracy":{"name":"repeating_vehicle_$X_accuracy","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_damage":{"calculation":"calcVehicleDamage","name":"repeating_vehicle_$X_damage","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_component_structure":{"name":"repeating_vehicle_$X_component_structure","type":"number","defaultValue":5,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_component_structure_max":{"name":"repeating_vehicle_$X_component_structure_max","type":"number","defaultValue":5,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_component_structure_penalty_1":{"name":"repeating_vehicle_$X_component_structure_penalty_1","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_component_structure_penalty_2":{"name":"repeating_vehicle_$X_component_structure_penalty_2","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_component_structure_penalty_3":{"name":"repeating_vehicle_$X_component_structure_penalty_3","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_component_structure_penalty_4":{"name":"repeating_vehicle_$X_component_structure_penalty_4","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_component_structure_penalty_5":{"name":"repeating_vehicle_$X_component_structure_penalty_5","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_component_structure_penalty_6":{"name":"repeating_vehicle_$X_component_structure_penalty_6","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_component_structure_penalty_7":{"name":"repeating_vehicle_$X_component_structure_penalty_7","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_component_structure_penalty_8":{"name":"repeating_vehicle_$X_component_structure_penalty_8","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_component_structure_penalty_9":{"name":"repeating_vehicle_$X_component_structure_penalty_9","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_component_structure_penalty_10":{"name":"repeating_vehicle_$X_component_structure_penalty_10","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_vehicle_$X_notes":{"name":"repeating_vehicle_$X_notes","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_character_description":{"name":"character_description","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_edit-skills":{"triggeredFuncs":["editNPCSkills"],"name":"edit-skills","listener":"clicked:edit-skills","listenerFunc":"accessSheet","type":"action"},"attr_repeating_skill_$X_collapse":{"name":"repeating_skill_$X_collapse","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_weapon_$X_accuracy":{"name":"repeating_weapon_$X_accuracy","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_dogfighting":{"affects":["warbird_initiative"],"name":"dogfighting","listener":"change:dogfighting","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"attr_strafing":{"affects":["warbird_initiative"],"name":"strafing","listener":"change:strafing","listenerFunc":"accessSheet","type":"number","defaultValue":0,"triggeredFuncs":[]},"act_npc-gunnery-action":{"triggeredFuncs":["npcAttack"],"name":"npc-gunnery-action","listener":"clicked:npc-gunnery-action","listenerFunc":"accessSheet","type":"action"},"attr_npc_gunnery_action":{"name":"npc_gunnery_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_npc_gunnery":{"name":"npc_gunnery","type":"number","defaultValue":"2","triggeredFuncs":[],"affects":[]},"attr_npc_gunnery_damage":{"name":"npc_gunnery_damage","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"act_npc-ordinance-action":{"triggeredFuncs":["npcAttack"],"name":"npc-ordinance-action","listener":"clicked:npc-ordinance-action","listenerFunc":"accessSheet","type":"action"},"attr_npc_ordinance_action":{"name":"npc_ordinance_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_npc_ordinance":{"name":"npc_ordinance","type":"number","defaultValue":"2","triggeredFuncs":[],"affects":[]},"attr_npc_ordinance_damage":{"name":"npc_ordinance_damage","type":"number","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_template_start":{"name":"template_start","type":"hidden","defaultValue":"&{template:rapidfire} {{character_name=@{character_name}}} {{character_id=@{character_id}}} {{system=@{system}}}","triggeredFuncs":[],"affects":[]}};
  
  kFuncs.cascades = cascades;
  
  const repeatingSectionDetails = [{"section":"repeating_health","fields":["name","fill","damaged","penalty"]},{"section":"repeating_equipment","fields":["collapse","name","quantity","notes"]},{"section":"repeating_skill","fields":["raw","name","action","level","stat","xp","collapse"]},{"section":"repeating_advantage","fields":["collapse","name","notes"]},{"section":"repeating_disadvantage","fields":["collapse","name","notes"]},{"section":"repeating_adjustment","fields":["collapse","name","notes"]},{"section":"repeating_weapon","fields":["collapse","action","name","skill","translate_skill","damage","notes","accuracy"]},{"section":"repeating_structure","fields":["name","fill","damaged","penalty"]},{"section":"repeating_trait","fields":["collapse","name","effects","description"]},{"section":"repeating_warbird-weapon","fields":["collapse","action","name","skill","accuracy","accuracy_bonus","damage","damage_bonus","ammo","notes"]},{"section":"repeating_large-structure","fields":["name","fill","damaged","penalty"]},{"section":"repeating_vehicle","fields":["collapse","name","component_defence","component_armour","action","accuracy","damage","component_structure","component_structure_max","component_structure_penalty_1","component_structure_penalty_2","component_structure_penalty_3","component_structure_penalty_4","component_structure_penalty_5","component_structure_penalty_6","component_structure_penalty_7","component_structure_penalty_8","component_structure_penalty_9","component_structure_penalty_10","notes"]}];
  
  kFuncs.repeatingSectionDetails = repeatingSectionDetails;
  
  const persistentTabs = [];
  
  kFuncs.persistentTabs = persistentTabs;
  /**
 * The K-scaffold provides several variables to allow your scripts to tap into its information flow.
 * @namespace Sheetworkers.Variables
 */
/**
 * This stores the name of your sheet for use in the logging functions {@link log} and {@link debug}. Accessible by `k.sheetName`
 * @memberof Variables
 * @var
 * @type {string}
 */
let sheetName = 'kScaffold Powered Sheet';
kFuncs.sheetName = sheetName;
/**
	* This stores the version of your sheet for use in the logging functions{@link log} and {@link debug}. It is also stored in the sheet_version attribute on your character sheet. Accessible via `k.version`
 * @memberof Variables
	* @var
	* @type {number}
	*/
let version = 0;
kFuncs.version = version;
/**
	* A boolean flag that tells the script whether to enable or disable {@link debug} calls. If the version of the sheet is `0`, or an attribute named `debug_mode` is found on opening this is set to true for your entire session. Otherwise, it remains false.
 * @memberof Variables
	* @var
	* @type {boolean}
	*/
let debugMode = false;
kFuncs.debugMode = debugMode;
const funcs = {};
kFuncs.funcs = funcs;
const updateHandlers = {};
const openHandlers = {};
const initialSetups = {};
const allHandlers = {};
const addFuncs = {};

const kscaffoldJSVersion = '1.0.0';
const kscaffoldPUGVersion = '1.0.0';
  /*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/**
 * These are utility functions that are not directly related to Roll20 systems. They provide easy methods for everything from processing text and numbers to querying the user for input.
 * @namespace Sheetworkers.Utilities
 * @alias Utilities
 */
/**
 * Replaces problem characters to use a string as a regex
 * @memberof Utilities
 * @param {string} text - The text to replace characters in
 * @returns {string}
 * @example
 * const textForRegex = k.sanitizeForRegex('.some thing[with characters]');
 * console.log(textForRegex);// => "\.some thing\[with characters\]"
 */
const sanitizeForRegex = function(text){
  return text.replace(/\.|\||\(|\)|\[|\]|\-|\+|\?|\/|\{|\}|\^|\$|\*/g,'\\$&');
};
kFuncs.sanitizeForRegex = sanitizeForRegex;

/**
 * Converts a value to a number, it\'s default value, or `0` if no default value passed.
 * @memberof Utilities
 * @param {string|number} val - Value to convert to a number
 * @param {number} def - The default value, uses 0 if not passed
 * @returns {number|undefined}
 * @example
 * const num = k.value('100');
 * console.log(num);// => 100
 */
const value = function(val,def){
  const convertVal = +val;
  if(def !== undefined && isNaN(def)){
    throw(`K-scaffold Error: invalid default for value(). Default: ${def}`);
  }
  return convertVal === 0 ?
    convertVal :
    (+val||def||0);
};
kFuncs.value = value;

/**
 * Extracts the section (e.g. `repeating_equipment`), rowID (e.g `-;lkj098J:LKj`), and field name (e.g. `bulk`) from a repeating attribute name.
 * @memberof Utilities
 * @param {string} string - The string to parse
 * @returns {array} - Array of matches. Index 0: the section name, e.g. repeating_equipment | Index 1:the row ID | index 2: The name of the attribute
 * @returns {string[]}
 * @example
 * //Extract info from a full repeating name
 * const [section,rowID,attrName] = k.parseRepeatName('repeating_equipment_-8908asdflkjZlkj23_name');
 * console.log(section);// => "repeating_equipment"
 * console.log(rowID);// => "-8908asdflkjZlkj23"
 * console.log(attrName);// => "name"
 * 
 * //Extract info from just a row name
 * const [section,rowID,attrName] = k.parseRepeatName('repeating_equipment_-8908asdflkjZlkj23');
 * console.log(section);// => "repeating_equipment"
 * console.log(rowID);// => "-8908asdflkjZlkj23"
 * console.log(attrName);// => undefined
 */
const parseRepeatName = function(string){
  let match = string.match(/(repeating_[^_]+)_([^_]+)(?:_(.+))?/);
  match.shift();
  return match;
};
kFuncs.parseRepeatName = parseRepeatName;

/**
 * Parses out the components of a trigger name similar to [parseRepeatName](#parserepeatname). Aliases: parseClickTrigger.
 * 
 * Aliases: `k.parseClickTrigger`
 * @memberof Utilities
 * @param {string} string The triggerName property of the
 * @returns {array} - For a repeating button named `repeating_equipment_-LKJhpoi98;lj_roll`, the array will be `['repeating_equipment','-LKJhpoi98;lj','roll']`. For a non repeating button named `roll`, the array will be `[undefined,undefined,'roll']`
 * @returns {string[]}
 * @example
 * //Parse a non repeating trigger
 * const [section,rowID,attrName] = k.parseTriggerName('clicked:some-button');
 * console.log(section);// => undefined
 * console.log(rowID);// => undefined
 * console.log(attrName);// => "some-button"
 * 
 * //Parse a repeating trigger
 * const [section,rowID,attrName] = k.parseTriggerName('clicked:repeating_attack_-234lkjpd8fu8usadf_some-button');
 * console.log(section);// => "repeating_attack"
 * console.log(rowID);// => "-234lkjpd8fu8usadf"
 * console.log(attrName);// => "some-button"
 * 
 * //Parse a repeating name
 * const [section,rowID,attrName] = k.parseTriggerName('repeating_attack_-234lkjpd8fu8usadf_some-button');
 * console.log(section);// => "repeating_attack"
 * console.log(rowID);// => "-234lkjpd8fu8usadf"
 * console.log(attrName);// => "some-button"
 */
const parseTriggerName = function(string){
  let match = string.replace(/^clicked:/,'').match(/(?:(repeating_[^_]+)_([^_]+)_)?(.+)/);
  match.shift();
  return match;
};
kFuncs.parseTriggerName = parseTriggerName;
const parseClickTrigger = parseTriggerName;
kFuncs.parseClickTrigger = parseClickTrigger;

/**
 * Parses out the attribute name from the htmlattribute name.
 * @memberof Utilities
 * @param {string} string - The triggerName property of the [event](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object).
 * @returns {string}
 * @example
 * //Parse a name
 * const attrName = k.parseHtmlName('attr_attribute_1');
 * console.log(attrName);// => "attribute_1"
 */
const parseHTMLName = function(string){
  let match = string.match(/(?:attr|act|roll)_(.+)/);
  match.shift();
  return match[0];
};
kFuncs.parseHTMLName = parseHTMLName;

/**
 * Capitalize each word in a string
 * @memberof Utilities
 * @param {string} string - The string to capitalize
 * @returns {string}
 * @example
 * const capitalized = k.capitalize('a word');
 * console.log(capitalized);// => "A Word"
 */
const capitalize = function(string){
  return string.replace(/(?:^|\s+|\/)[a-z]/ig,(letter)=>letter.toUpperCase());
};
kFuncs.capitalize = capitalize;

/**
 * Extracts a roll query result for use in later functions. Must be awaited as per [startRoll documentation](https://wiki.roll20.net/Sheet_Worker_Scripts#Roll_Parsing.28NEW.29). Stolen from [Oosh\'s Adventures with Startroll thread](https://app.roll20.net/forum/post/10346883/adventures-with-startroll).
 * @memberof Utilities
 * @param {string} query - The query should be just the text as the `?{` and `}` at the start/end of the query are added by the function.
 * @returns {Promise} - Resolves to the selected value from the roll query
 * @example
 * const rollFunction = async function(){
 *  //Get the result of a choose from list query
 *  const queryResult = await extractQueryResult('Prompt Text Here|Option 1|Option 2');
 *  console.log(queryResult);//=> "Option 1" or "Option 2" depending on what the user selects
 * 
 *  //Get free form input from the user
 *  const freeResult = await extractQueryResult('Prompt Text Here');
 *  consoel.log(freeResult);// => Whatever the user entered
 * }
 */
const extractQueryResult = async function(query){
	debug('entering extractQueryResult');
	let queryRoll = await startRoll(`!{{query=[[0[response=?{${query}}]]]}}`);
	finishRoll(queryRoll.rollId);
	return queryRoll.results.query.expression.replace(/^.+?response=|\]$/g,'');
};
kFuncs.extractQueryResult = extractQueryResult;

/**
 * Simulates a query for ensuring that async/await works correctly in the sheetworker environment when doing conditional startRolls. E.g. if you have an if/else and only one of the conditions results in `startRoll` being called (and thus an `await`), the sheetworker environment would normally crash. Awaiting this in the condition that does not actually need to call `startRoll` will keep the environment in sync.
 * @memberof Utilities
 * @param {string|number} [value] - The value to return. Optional.
 * @returns {Promise} - Resolves to the value passed to the function
 * @example
 * const rollFunction = async function(){
 *  //Get the result of a choose from list query
 *  const queryResult = await pseudoQuery('a value');
 *  console.log(queryResult);//=> "a value"
 * }
 */
const pseudoQuery = async function(value){
	debug('entering pseudoQuery');
	let queryRoll = await startRoll(`!{{query=[[0[response=${value}]]]}}`);
	finishRoll(queryRoll.rollId);
	return queryRoll.results.query.expression.replace(/^.+?response=|\]$/g,'');
};
kFuncs.pseudoQuery = pseudoQuery;

/**
 * An alias for console.log.
 * @memberof Utilities
 * @param {any} msg - The message can be a straight string, an object, or an array. If it is an object or array, the object will be broken down so that each key is used as a label to output followed by the value of that key. If the value of the key is an object or array, it will be output via `console.table`.
 */
const log = function(msg){
  if(typeof msg === 'string'){
    console.log(`%c${kFuncs.sheetName} log| ${msg}`,"background-color:#159ccf");
  }else if(typeof msg === 'object'){
    Object.keys(msg).forEach((m)=>{
      if(typeof msg[m] === 'string'){
        console.log(`%c${kFuncs.sheetName} log| ${m}: ${msg[m]}`,"background-color:#159ccf");
      }else{
        console.log(`%c${kFuncs.sheetName} log| ${typeof msg[m]} ${m}`,"background-color:#159ccf");
        console.table(msg[m]);
      }
    });
  }
};
kFuncs.log = log;

/**
 * Alias for console.log that only triggers when debug mode is enabled or when the sheet\'s version is `0`. Useful for entering test logs that will not pollute the console on the live sheet.
 * @memberof Utilities
 * @param {any} msg - 'See {@link k.log}
 * @param {boolean} force - Pass as a truthy value to force the debug output to be output to the console regardless of debug mode.
 * @returns {void}
 */
const debug = function(msg,force){
  if(!kFuncs.debugMode && !force && kFuncs.version > 0) return;
  if(typeof msg === 'string'){
    console.warn(`%c${kFuncs.sheetName} DEBUG| ${msg}`,"background-color:tan;color:red;");
  }else if(typeof msg === 'object'){
    Object.keys(msg).forEach((m)=>{
      if(typeof msg[m] === 'string'){
        console.warn(`%c${kFuncs.sheetName} DEBUG| ${m}: ${msg[m]}`,"background-color:tan;color:red;");
      }else{
        console.warn(`%c${kFuncs.sheetName} DEBUG| ${typeof msg[m]} ${m}`,"background-color:tan;color:red;font-weight:bold;");
        console.table(msg[m]);
      }
    });
  }
};
kFuncs.debug = debug;

/**
 * Orders the section id arrays for all sections in the `sections` object to match the repOrder attribute.
 * @memberof Utilities
 * @param {attributesProxy} attributes - The attributes object that must have a value for the reporder for each section.
 * @param {object[]} sections - Object containing the IDs for the repeating sections, indexed by repeating section name.
 */
const orderSections = function(attributes,sections){
  Object.keys(sections).forEach((section)=>{
    attributes.attributes[`_reporder_${section}`] = commaArray(attributes[`_reporder_${section}`]);
    sections[section] = orderSection(attributes.attributes[`_reporder_${section}`],sections[section]);
  });
};
kFuncs.orderSections = orderSections;

/**
 * Orders a single ID array.
 * @memberof Utilities
 * @param {string[]} repOrder - Array of IDs in the order they are in on the sheet.
 * @param {string[]} IDs - Array of IDs to be ordered. Aka the default ID Array passed to the getSectionIDs callback
 * @returns {string[]} - The ordered id array
 */
const orderSection = function(repOrder,IDs=[]){
  const idArr = [...repOrder.filter(v => v),...IDs.filter(id => !repOrder.includes(id.toLowerCase()))];
  return idArr;
};
kFuncs.orderSection = orderSection;

/**
 * Splits a comma delimited string into an array
 * @memberof Utilities
 * @param {string} string - The string to split.
 * @returns {array} - The string segments of the comma delimited list.
 */
const commaArray = function(string=''){
  return string.toLowerCase().split(/\s*,\s*/);
};
kFuncs.commaArray = commaArray;

// Roll escape functions for passing data in action button calls. Base64 encodes/decodes the data.
const RE = {
  chars: {
      '"': '%quot;',
      ',': '%comma;',
      ':': '%colon;',
      '}': '%rcub;',
      '{': '%lcub;',
  },
  escape(data) {
    return typeof data === 'object' ?
      `KDATA${btoa(JSON.stringify(data))}` :
      `KSTRING${btoa(data)}`;
  },
  unescape(string) {
    const isData = typeof string === 'string' &&
      (
        string.startsWith('KDATA') ||
        string.startsWith('KSTRING')
      );
    return isData ?
      (
        string.startsWith('KDATA') ?
          JSON.parse(atob(string.replace(/^KDATA/,''))) :
          atob(string.replace(/^KSTRING/,''))
      ) :
      string;
  }
};

/**
 * Encodes data in Base64. This is useful for passing roll information to action buttons called from roll buttons.
 * @function
 * @param {string|object|any[]} data - The data that you want to Base64 encode
 * @returns {string} - The encoded data
 * @memberof! Utilities
 */
const escape = RE.escape;
/**
 * Decodes Base64 encoded strings that were created by the K-scaffold
 * @function
 * @param {string|object|any[]} string - The string of encoded data to decode. If this is not a string, or is not a string that was encoded by the K-scaffold, it will be returned as is.
 * @returns {string|object|any[]}
 * @memberof! Utilities
 */
const unescape = RE.unescape;

Object.assign(kFuncs,{escape,unescape});/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/

//# Attribute Obj Proxy handler
const createAttrProxy = function(attrs,sections,casc){
  //creates a proxy for the attributes object so that values can be worked with more easily.
  const getCascObj = function(event){
    const eventName = event.triggerName || event.sourceAttribute;
    let typePrefix = eventName.startsWith('clicked:') ?
      'act_' :
      event.removedInfo ?
      'fieldset_' :
      'attr_';
    let cascName = `${typePrefix}${eventName.replace(/(?:removed?|clicked):/,'')}`;
    let cascObj = casc[cascName];
    k.debug({[cascName]:cascObj});
    if(event && cascObj){
      if(event.previousValue){
        cascObj.previousValue = event.previousValue;
      }else if(event.originalRollId){
        cascObj.originalRollId = event.originalRollId;
        cascObj.rollData = RE.unescape(event.originalRollId);
      }
    }
    return cascObj || {};
  };
  
  const triggerFunctions = function(obj){
    if(obj.triggeredFuncs && obj.triggeredFuncs.length){
      debug(`triggering functions for ${obj.name}`);
      obj.triggeredFuncs && obj.triggeredFuncs.forEach(func=>funcs[func] ? 
        funcs[func]({trigger:obj,attributes,sections,casc}) :
        debug(`!!!Warning!!! no function named ${func} found. Triggered function not called for ${obj.name}`,true));
    }
  };
  
  const initialFunction = function(obj){
    if(obj.initialFunc){
      debug(`initial functions for ${obj.name}`);
      funcs[obj.initialFunc] ?
        funcs[obj.initialFunc]({trigger:obj,attributes,sections}) :
        debug(`!!!Warning!!! no function named ${obj.initialFunc} found. Initial function not called for ${obj.name}`,true);
    }
  };
  const alwaysFunctions = function(trigger){
    Object.values(allHandlers).forEach((handler)=>{
      handler({trigger,attributes,sections,casc});
    });
  };
  const processChange = function({event,trigger}){
    if(event && !trigger){
      debug(`${event.sourceAttribute} change detected. No trigger found`);
      return;
    }
    if(!attributes || !sections || !casc){
      debug(`!!! Insufficient arguments || attributes > ${!!attributes} | sections > ${!!sections} | casc > ${!!casc} !!!`);
      return;
    }
    debug({trigger});
    if(event){
      debug('checking for initial & always functions');
      if(Array.isArray(trigger.affects)){
        attributes.queue.push(...trigger.affects);
      }
      alwaysFunctions(trigger,attributes,sections,casc);//Functions that should be run for all events.
      initialFunction(trigger,attributes,sections,casc);//functions that should only be run if the attribute was the thing changed by the user

    }
    if(trigger){
      debug(`processing ${trigger.name}`);
      triggerFunctions(trigger,attributes,sections,casc);
      if(!event && trigger.calculation && funcs[trigger.calculation]){
        attributes[trigger.name] = funcs[trigger.calculation]({trigger,attributes,sections,casc});
      }else if(trigger.calculation && !funcs[trigger.calculation]){
        debug(`K-Scaffold Error: No function named ${trigger.calculation} found`);
      }
    }
    attributes.set();
  };
  const attrTarget = {
    updates:{},
    attributes:{...attrs},
    repOrders:{},
    queue: [],
    casc:{},
    alwaysFunctions,
    processChange,
    triggerFunctions,
    initialFunction,
    getCascObj
  };
  const attrHandler = {
    get:function(obj,prop){//gets the most value of the attribute.
      //If it is a repeating order, returns the array, otherwise returns the update value or the original value
      if(prop === 'set'){
        return function(){
          let {callback,vocal} = arguments[0] ? arguments[0] : {};
          if(sections && casc && attributes.queue.length){
            const triggerName = attributes.queue.shift();
            const trigger = getCascObj({sourceAttribute:triggerName});
            processChange({trigger,attributes,sections,casc});
          }else{
            debug({updates:obj.updates});
            const trueCallback = Object.keys(obj.repOrders).length ?
              function(){
                Object.entries(obj.repOrders).forEach(([section,order])=>{
                  _setSectionOrder(section,order)
                });
                callback && callback();
              }:
              callback;
            Object.keys(obj.updates).forEach((key)=>obj.attributes[key] = obj.updates[key]);
            const update = obj.updates;
            obj.updates = {};
            set(update,vocal,trueCallback);
          }
        }
      }else if(Object.keys(obj).some(key=>key===prop)){ 
        return Reflect.get(...arguments)
      }else{
        let retValue;
        switch(true){
          case obj.repOrders.hasOwnProperty(prop):
            retValue = obj.repOrders[prop];
            break;
          case obj.updates.hasOwnProperty(prop):
            retValue = obj.updates[prop];
            break;
          default:
            retValue = obj.attributes[prop];
            break;
        }
        let cascRef = `attr_${prop.replace(/(repeating_[^_]+_)[^_]+/,'$1\$X')}`;
        let numRetVal = +retValue;
        if(!Number.isNaN(numRetVal) && retValue !== ''){
          retValue = numRetVal;
        }else if(cascades[cascRef] && (typeof cascades[cascRef].defaultValue === 'number' || cascades[cascRef].type === 'number')){
          retValue = cascades[cascRef].defaultValue;
        }
        return retValue;
      }
    },
    set:function(obj,prop,value){
      //Sets the value. Also verifies that the value is a valid attribute value
      //e.g. not undefined, null, or NaN
      if(value || value===0 || value===''){
        if(/reporder|^repeating_[^_]+$/.test(prop)){
          let section = prop.replace(/_reporder_/,'');
          obj.repOrders[section] = value;
        }else if(`${obj.attributes}` !== `${value}` || 
          (obj.updates[prop] && `${obj.updates}` !== `${value}`)
        ){
          if(sections && casc){
            const trigger = getCascObj({sourceAttribute:prop});
            if(Array.isArray(trigger.affects)){
              attributes.queue.push(...trigger.affects);
            }
          }
          obj.updates[prop] = value;
        }
      }else{
        debug(`!!!Warning: Attempted to set ${prop} to an invalid value:${value}; value not stored!!!`);
      }
      return true;
    },
    deleteProperty(obj,prop){
      //removes the property from the original attributes, updates, and the reporders
      Object.keys(obj).forEach((key)=>{
        delete obj[key][prop.toLowerCase()];
      });
    }
  };
  const attributes = new Proxy(attrTarget,attrHandler);
  return attributes;
};

/**
 * Function that registers a function for being called via the funcs object. Returns true if the function was successfully registered, and false if it could not be registered for any reason.
 * @memberof Utilities
 * @param {object} funcObj - Object with keys that are names to register functions under and values that are functions.
 * @param {object} optionsObj - Object that contains options to use for this registration.
 * @param {string[]} optionsObj.type - Array that contains the types of specialized functions that apply to the functions being registered. Valid types are `"opener"`, `"updater"`, and `"default"`. `"default"` is always used, and never needs to be passed.
 * @returns {boolean} - True if the registration succeeded, false if it failed.
 * @example
 * //Basic Registration
 * const myFunc = function({trigger,attributes,sections,casc}){};
 * k.registerFuncs({myFunc});
 * 
 * //Register a function to run on sheet open
 * const openFunc = function({trigger,attributes,sections,casc}){};
 * k.registerFuncs({openFunc},{type:['opener']})
 * 
 * //Register a function to run on all events
 * const allFunc = function({trigger,attributes,sections,casc}){};
 * k.registerFuncs({allFunc},{type:['all']})
 */
const registerFuncs = function(funcObj,optionsObj = {}){
  if(typeof funcObj !== 'object' || typeof optionsObj !== 'object'){
    debug(`!!!! K-scaffold error: Improper arguments to register functions !!!!`);
    return false;
  }
  const typeArr = optionsObj.type ? ['default',...optionsObj.type] : ['default'];
  const typeSwitch = {
    'opener':openHandlers,
    'updater':updateHandlers,
    'new':initialSetups,
    'all':allHandlers,
    'default':funcs
  };
  let setState;
  Object.entries(funcObj).map(([prop,value])=>{
    typeArr.forEach((type)=>{
      if(typeSwitch[type][prop]){
        debug(`!!! Duplicate function name for ${prop} as ${type}!!!`);
        setState = false;
      }else if(typeof value === 'function'){
        typeSwitch[type][prop] = value;
        setState = setState !== false ? true : false;
      }else{
        debug(`!!! K-scaffold error: Function registration requires a function. Invalid value to register as ${type} !!!`);
        setState = false;
      }
    });
  });
  return setState;
};
kFuncs.registerFuncs = registerFuncs;

/**
 * Function that sets up the action calls used in the roller mixin.
 * @memberof Sheetworkers
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 */
const setActionCalls = function({attributes,sections}){
  actionAttributes.forEach((base)=>{
    let [section,,field] = k.parseTriggerName(base);
    let fieldAction = field.replace(/_/g,'-');
    if(section){
      sections[section].forEach((id)=>{
        attributes[`${section}_${id}_${field}`] = `%{${attributes.character_name}|${section}_${id}_${fieldAction}}`;
      });
    }else{
      attributes[`${field}`] = `%{${attributes.character_name}|${fieldAction}}`;
    }
  });
};
funcs.setActionCalls = setActionCalls;
kFuncs.setActionCalls = setActionCalls;

/**
 * Function to call a function previously registered to the funcs object. May not be used that much in actual sheets, but very useful when writing unit tests for your sheet. Either returns the function or null if no function exists.
 * @memberof Sheetworkers
 * @param {string} funcName - The name of the function to invoke.
 * @param {...any} args - The arguments to call the function with.
 * @returns {function|null}
 * @example
 * //Call myFunc with two arguments
 * k.callFunc('myFunc','an argument','another argument');
 */
const callFunc = function(funcName,...args){
  if(funcs[funcName]){
    debug(`calling ${funcName}`);
    return funcs[funcName](...args);
  }else{
    debug(`Invalid function name: ${funcName}`);
    return null;
  }
};
kFuncs.callFunc = callFunc;/**@namespace Sheetworkers */
/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Sheet Updaters and styling functions
const updateSheet = function(){
  log('updating sheet');
  getAllAttrs({props:['debug_mode',...baseGet],callback:(attributes,sections,casc)=>{
    kFuncs.debugMode = kFuncs.debugMode || !!attributes.debug_mode;
    debug({sheet_version:attributes.sheet_version});
    if(!attributes.sheet_version){
      Object.entries(initialSetups).forEach(([funcName,handler])=>{
        if(typeof funcs[funcName] === 'function'){
          debug(`running ${funcName}`);
          funcs[funcName]({attributes,sections,casc});
        }else{
          debug(`!!!Warning!!! no function named ${funcName} found. Initial sheet setup not performed.`);
        }
      });
    }else{
      Object.entries(updateHandlers).forEach(([ver,handler])=>{
        if(attributes.sheet_version < +ver){
          handler({attributes,sections,casc});
        }
      });
    }
    k.debug({openHandlers});
    Object.entries(openHandlers).forEach(([funcName,func])=>{
      if(typeof funcs[funcName] === 'function'){
        debug(`running ${funcName}`);
        funcs[funcName]({attributes,sections,casc});
      }else{
        debug(`!!!Warning!!! no function named ${funcName} found. Sheet open handling not performed.`);
      }
    });
    setActionCalls({attributes,sections});
    attributes.sheet_version = kFuncs.version;
    log(`Sheet Update applied. Current Sheet Version ${kFuncs.version}`);
    attributes.set();
    log('Sheet ready for use');
  }});
};

const initialSetup = function(attributes,sections){
  debug('Initial sheet setup');
};

/**
 * This is the default listener function for attributes that the K-Scaffold uses. It utilizes the `triggerFuncs`, `listenerFunc`, `calculation`, and `affects` properties of the K-scaffold trigger object (see the Pug section of the scaffold for more details).
 * @memberof Sheetworkers
 * @param {Roll20Event} event - The Roll20 event object
 * @returns {void}
 * @example
 * //Call from an attribute change
 * on('change:an_attribute',k.accessSheet);
 */
const accessSheet = function(event){
  debug({funcs:Object.keys(funcs)});
  debug({event});
  getAllAttrs({callback:(attributes,sections,casc)=>{
    let trigger = attributes.getCascObj(event,casc);
    attributes.processChange({event,trigger,attributes,sections,casc});
  }});
};
funcs.accessSheet = accessSheet;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/*
Cascade Expansion functions
*/
//Expands the repeating section templates in cascades to reflect the rows actually available
const expandCascade = function(cascade,sections){
  return _.keys(cascade).reduce((memo,key)=>{//iterate through cascades and replace references to repeating attributes with correct row ids.
    if(/^(?:act|attr)_repeating_/.test(key)){//If the attribute is a repeating attribute, do special logic
      expandRepeating(memo,key,cascade,sections);
    }else if(key){//for non repeating attributes do this logic
      expandNormal(memo,key,cascade,sections);
    }
    return memo;
  },{});
};

const expandRepeating = function(memo,key,cascade,sections){
  key.replace(/((?:attr|act)_)(repeating_[^_]+)_[^_]+?_(.+)/,(match,type,section,field)=>{
    (sections[section]||[]).forEach((id)=>{
      memo[`${type}${section}_${id}_${field}`]=_.clone(cascade[key]);//clone the details so that each row's attributes have correct ids
      memo[`${type}${section}_${id}_${field}`].name = `${section}_${id}_${field}`;
      if(key.startsWith('attr_')){
        memo[`${type}${section}_${id}_${field}`].affects = memo[`${type}${section}_${id}_${field}`].affects.reduce((m,affected)=>{
          if(section === affected){//otherwise if the affected attribute is in the same section, simply set the affected attribute to have the same row id.
            m.push(applyID(affected,id));
          }else if(/repeating/.test(affected)){//If the affected attribute isn't in the same repeating section but is still a repeating attribute, add all the rows of that section
            addAllRows(affected,m,sections);
          }else{//otherwise the affected attribute is a non repeating attribute. Simply add it to the computed affected array
            m.push(affected);
          }
          return m;
        },[]);
      }
    });
  });
};

const applyID = function(affected,id){
  return affected.replace(/(repeating_[^_]+_)[^_]+(.+)/,`$1${id}$2`);
};

const expandNormal = function(memo,key,cascade,sections){
  memo[key] = _.clone(cascade[key]);
  if(key.startsWith('attr_')){
    memo[key].affects = memo[key].affects || [];
    memo[key].affects = memo[key].affects.reduce((m,a)=>{
      if(/^repeating/.test(a)){
        addAllRows(a,m,sections);
      }else{
        m.push(a);
      }
      return m;
    },[]);
  }
};

const addAllRows = function(affected,memo,sections){
  affected.replace(/(repeating_[^_]+?)_[^_]+?_(.+)/,(match,section,field)=>{
    sections[section].forEach(id=>memo.push(`${section}_${id}_${field}`));
  });
};/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/**
 * These are functions that provide K-scaffold aliases for the basic Roll20 sheetworker functions. These functions also provide many additional features on top of the standard Roll20 sheetworkers.
 * @namespace Sheetworkers.Sheetworker Aliases
 */
/**
 * Alias for [setSectionOrder()](https://wiki.roll20.net/Sheet_Worker_Scripts#setSectionOrder.28.3CRepeating_Section_Name.3E.2C_.3CSection_Array.3E.2C_.3CCallback.3E.29) that allows you to use the section name in either `repeating_section` or `section` formats. Note that the Roll20 sheetworker [setSectionOrder](https://wiki.roll20.net/Sheet_Worker_Scripts#setSectionOrder.28.3CRepeating_Section_Name.3E.2C_.3CSection_Array.3E.2C_.3CCallback.3E.29) currently causes some display issues on sheets.
 * @memberof Sheetworker Aliases
 * @name setSectionOrder
 * @param {string} section - The name of the section, with or without `repeating_`
 * @param {string[]} order - Array of ids describing the desired order of the section.
 * @returns {void}
 * @example
 * //Set the order of a repeating_weapon section
 * k.setSectionOrder('repeating_equipment',['id1','id2','id3']);
 * //Can also specify the section name without the repeating_ prefix
 * k.setSectionOrder('equipment',['id1','id2','id3']);
 */
const _setSectionOrder = function(section,order){
  let trueSection = section.replace(/repeating_/,'');
  setSectionOrder(trueSection,order);
};
kFuncs.setSectionOrder = _setSectionOrder;

/**
 * Alias for [removeRepeatingRow](https://wiki.roll20.net/Sheet_Worker_Scripts#removeRepeatingRow.28_RowID_.29) that also removes the row from the current object of attribute values and array of section IDs to ensure that erroneous updates are not issued.
 * @memberof Sheetworker Aliases
 * @name removeRepeatingRow
 * @param {string} row - The row id to be removed
 * @param {attributesProxy} attributes - The attribute values currently in memory
 * @param {object} sections - Object that contains arrays of all the IDs in sections on the sheet indexed by repeating name.
 * @returns {void}
 * @example
 * //Remove a repeating Row
 * k.getAllAttrs({
 *  callback:(attributes,sections)=>{
 *    const rowID = sections.repeating_equipment[0];
 *    k.removeRepeatingRow(`repeating_equipment_${rowID}`,attributes,sections);
 *    console.log(sections.repeating_equipment); // => rowID no longer exists in the array.
 *    console.log(attributes[`repeating_equipment_${rowID}_name`]); // => undefined
 *  }
 * })
 */
const _removeRepeatingRow = function(row,attributes,sections){
  debug(`removing ${row}`);
  Object.keys(attributes.attributes).forEach((key)=>{
    if(key.startsWith(row)){
      delete attributes[key];
    }
  });
  let [,section,rowID] = row.match(/(repeating_[^_]+)_(.+)/,'');
  sections[section] = sections[section].filter((id)=>id!==rowID);
  removeRepeatingRow(row);
};
kFuncs.removeRepeatingRow = _removeRepeatingRow;

/**
 * Alias for [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29) that converts the default object of attribute values into an {@link attributesProxy} and passes that back to the callback function.
 * @memberof Sheetworker Aliases
 * @name getAttrs
 * @param {string[]} [props=baseGet] - Array of attribute names to get the value of. Defaults to {@link baseGet} if not passed.
 * @param {function(attributesProxy)} callback - The function to call after the attribute values have been gotten. An {@link attributesProxy} is passed to the callback.
 * @example
 * //Gets the attributes named in props.
 * k.getAttrs({
 *  props:['attribute_1','attribute_2'],
 *  callback:(attributes)=>{
 *    //Work with the attributes as you would in a normal getAttrs, or use the superpowers of the K-scaffold attributes object like so:
 *    attributes.attribute_1 = 'new value';
 *    attributes.set();
 *  }
 * })
 */
const _getAttrs = function({props=baseGet,callback}){
  getAttrs(props,(values)=>{
    const attributes = createAttrProxy(values);
    callback(attributes);
  });
};
kFuncs.getAttrs = _getAttrs;

/**
 * Alias for [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29) and [getSectionIDs](https://wiki.roll20.net/Sheet_Worker_Scripts#getSectionIDs.28section_name.2Ccallback.29) that combines the actions of both sheetworker functions and converts the default object of attribute values into an {@link attributesProxy}. Also gets the details on how to handle all attributes from the master {@link cascades} object and.
 * @memberof Sheetworker Aliases
 * @param {Object} args
 * @param {string[]} [args.props=baseGet] - Array of attribute names to get the value of. Defaults to {@link baseGet} if not passed.
 * @param {repeatingSectionDetails} sectionDetails - Array of details about a section to get the IDs for and attributes that need to be gotten. 
 * @param {function(attributesProxy,sectionObj,expandedCascade):void} args.callback - The function to call after the attribute values have been gotten. An {@link attributesProxy} is passed to the callback along with a {@link sectionObj} and {@link expandedCascade}.
 * @example
 * //Get every K-scaffold linked attribute on the sheet
 * k.getAllAttrs({
 *  callback:(attributes,sections,casc)=>{
 *    //Work with the attributes as you please.
 *    attributes.some_attribute = 'a value';
 *    attributes.set();//Apply our change
 *  }
 * })
 */
const getAllAttrs = function({props=baseGet,sectionDetails=repeatingSectionDetails,callback}){
  getSections(sectionDetails,(repeats,sections)=>{
    getAttrs([...props,...repeats],(values)=>{
      const casc = expandCascade(cascades,sections);
      const attributes = createAttrProxy(values,sections,casc);
      orderSections(attributes,sections);
      callback(attributes,sections,casc);
    })
  });
};
kFuncs.getAllAttrs = getAllAttrs;

/**
 * Alias for [getSectionIDs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getSectionIDs.28section_name.2Ccallback.29) that allows you to iterate through several functions at once. Also assembles an array of repeating attributes to get.
 * @memberof Sheetworker Aliases
 * @param {object[]} sectionDetails - Array of details about a section to get the IDs for and attributes that need to be gotten.
 * @param {string} sectionDetails.section - The full name of the repeating section including the `repeating_` prefix.
 * @param {string[]} sectionDetails.fields - Array of field names that need to be gotten from the repeating section
 * @param {function(string[],sectionObj)} callback - The function to call once all IDs have been gotten and the array of repating attributes to get has been assembled. The callback is passed the array of repating attributes to get and a {@link sectionObj}.
 * @example
 * // Get some section details
 * const sectionDetails = {
 *  {section:'repeating_equipment',fields:['name','weight','cost']},
 *  {section:'repeating_weapon',fields:['name','attack','damage']}
 * };
 * k.getSections(sectionDetails,(attributeNames,sections)=>{
 *  console.log(attributeNames);// => Array containing all row specific attribute names
 *  console.log(sections);// => Object with arrays containing the row ids. Indexed by section name (e.g. repeating_eqiupment)
 * })
 */
const getSections = function(sectionDetails,callback){
  let queueClone = _.clone(sectionDetails);
  const worker = (queue,repeatAttrs=[],sections={})=>{
    let detail = queue.shift();
    getSectionIDs(detail.section,(IDs)=>{
      sections[detail.section] = IDs;
      IDs.forEach((id)=>{
        detail.fields.forEach((f)=>{
          repeatAttrs.push(`${detail.section}_${id}_${f}`);
        });
      });
      repeatAttrs.push(`_reporder_${detail.section}`);
      if(queue.length){
        worker(queue,repeatAttrs,sections);
      }else{
        callback(repeatAttrs,sections);
      }
    });
  };
  if(!queueClone[0]){
    callback([],{});
  }else{
    worker(queueClone);
  }
};
kFuncs.getSections = getSections;

// Sets the attributes while always calling with {silent:true}
// Can be awaited to get the values returned from _setAttrs
/**
 * Alias for [setAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#setAttrs.28values.2Coptions.2Ccallback.29) that sets silently by default.
 * @memberof Sheetworker Aliases
 * @param {object} obj - The object containting attributes to set
 * @param {boolean} [vocal=false] - Whether to set silently (default value) or not.
 * @param {function()} [callback] - The callback function to invoke after the setting has been completed. No arguments are passed to the callback function.
 * @example
 * //Set some attributes silently
 * k.setAttrs({attribute_1:'new value'})
 * //Set some attributes and triggers listeners
 * k.setAttrs({attribute_1:'new value',true})
 * //Set some attributes and call a callback function
 * k.setAttrs({attribute_1:'new value'},null,()=>{
 *  //Do something after the attribute is set
 * })
 */
const set = function(obj,vocal=false,callback){
  setAttrs(obj,{silent:!vocal},callback);
};
kFuncs.setAttrs = set;

const generateCustomID = function(string){
  if(!string.startsWith('-')){
    string = `-${string}`;
  }
  rowID = generateRowID();
  let re = new RegExp(`^.{${string.length}}`);
  return `${string}${rowID.replace(re,'')}`;
};


/**
 * Alias for generateRowID that adds the new id to the {@link sectionObj}. Also allows for creation of custom IDs that conform to the section ID requirements.
 * @memberof Sheetworker Aliases
 * @name generateRowID
 * @param {sectionObj} sections
 * @param {string} [customText] - Custom text to start the ID with. This text should not be longer than the standard repeating section ID format.
 * @returns {string} - The created ID
 * @example
 * k.getAllAttrs({
 *  callback:(attributes,sections,casc)=>{
 *    //Create a new row ID
 *    const rowID = k.generateRowID('repeating_equipment',sections);
 *    console.log(rowID);// => -p8rg908ug0suzz
 *    //Create a custom row ID
 *    const customID = k.generateRowID('repeating_equipment',sections,'custom');
 *    console.log(customID);// => -custom98uadj89kj
 *  }
 * });
 */
const _generateRowID = function(section,sections,customText){
  let rowID = customText ?
    generateCustomID(customText) :
    generateRowID();
  section = section.match(/^repeating_[^_]+$/) ?
    section :
    `repeating_${section}`;
  sections[section] = sections[section] || [];
  sections[section].push(rowID);
  return `${section}_${rowID}`;
};
kFuncs.generateRowID = _generateRowID;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
const listeners = {};

/**
 * The array of attribute names that the k-scaffold gets by default. Does not incude repeating attributes.
 * @memberof Variables
 * @var
 * @type {array}
 */
const baseGet = Object.entries(cascades).reduce((memo,[attrName,detailObj])=>{
  if(!/repeating/.test(attrName) && detailObj.type !== 'action'){
    memo.push(detailObj.name);
  }
  if(detailObj.listener){
    listeners[detailObj.listener] = detailObj.listenerFunc;
  }
  return memo;
},[]);
kFuncs.baseGet = baseGet;

const registerEventHandlers = function(){
  on('sheet:opened',updateSheet);
  debug({funcKeys:Object.keys(funcs),funcs});
  //Roll20 change and click listeners
  Object.entries(listeners).forEach(([event,funcName])=>{
    if(funcs[funcName]){
      on(event,funcs[funcName]);
    }else{
      debug(`!!!Warning!!! no function named ${funcName} found. No listener created for ${event}`,true);
    }
  });
  log(`kScaffold Loaded`);
};
setTimeout(registerEventHandlers,0);//Delay the execution of event registration to ensure all event properties are present.

/**
 * Function to add a repeating section when the add button of a customControlFieldset or inlineFieldset is clicked.
 * @memberof Sheetworkers
 * @param {object} event - The R20 event object
 */
const addItem = function(event){
  let [,,section] = parseClickTrigger(event.triggerName);
  section = section.replace(/add-/,'');
  getAllAttrs({
    callback:(attributes,sections,casc) => {
      let row = _generateRowID(section,sections);
      debug({row});
      attributes[`${row}_name`] = '';
      setActionCalls({attributes,sections});
      const trigger = cascades[`fieldset_repeating_${section}`];
      if(trigger){
        if(trigger.addFuncs){
          trigger.addFuncs.forEach((funcName) => {
            if(funcs[funcName]){
              funcs[funcName]({attributes,sections,casc,trigger});
            }
          });
        }
        if(Array.isArray(trigger.affects)){
          attributes.queue.push(...trigger.affects);
        }
      }
      attributes.set({attributes,sections,casc});
    }
  });
};
funcs.addItem = addItem;/**
 * The default tab navigation function of the K-scaffold. Courtesy of Riernar. It will add `k-active-tab` to the active tab-container and `k-active-button` to the active button. You can either write your own CSS to control display of these, or use the default CSS included in `scaffold/_k.scss`. Note that `k-active-button` has no default CSS as it is assumed that you will want to style the active button to match your system.
 * @memberof Sheetworkers
 * @param {Object} trigger - The trigger object
 * @param {object} attributes - The attribute values of the character
 */
const kSwitchTab = function ({ trigger, attributes }) {
  const [container, tab] = (
    trigger.name.match(/nav-tabs-(.+)--(.+)/) ||
    []
  ).slice(1);
  $20(`[data-container-tab="${container}"]`).removeClass('k-active-tab');
  $20(`[data-container-tab="${container}"][data-tab="${tab}"]`).addClass('k-active-tab');
  $20(`[data-container-button="${container}"]`).removeClass('k-active-button');
  $20(`[data-container-button="${container}"][data-button="${tab}"]`).addClass('k-active-button');
  const tabInputName = `${container.replace(/\-/g,'_')}_tab`;
  if(persistentTabs.indexOf(tabInputName) > -1){
    attributes[tabInputName] = trigger.name;
  }
}

registerFuncs({ kSwitchTab });

/**
 * Sets persistent tabs to their last active state
 * @memberof Sheetworkers
 * @param {object} attributes - The attribute values of the character
 */
const kTabOnOpen = function({trigger,attributes,sections,casc}){
  if(typeof persistentTabs === 'undefined') return;
  persistentTabs.forEach((tabInput) => {
    const pseudoTrigger = {name:attributes[tabInput]};
    kSwitchTab({trigger:pseudoTrigger, attributes});
  });
};
registerFuncs({ kTabOnOpen },{type:['opener']});
  return kFuncs;
  }());
  const actionAttributes = ["body_action","mind_action","spirit_action","repeating_skill_$X_action","initiative_action","repeating_weapon_$X_action","situational_awareness_action","warbird_initiative_action","piloting_action","strafing_action","gunnery_action","ordinance_action","stunt_action","repeating_warbird-weapon_$X_action","repeating_vehicle_$X_action","npc_gunnery_action","npc_ordinance_action"];const trackerMonitors = ["repeating_health:clear","repeating_structure:clear","repeating_large-structure:clear"];const warbirdSkills = ["piloting","strafing","gunnery","ordinance"];
  /*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Sheet Variables
k.sheetName = 'Outrider Studios\' Warbirds';
k.version = 1.01;
const systemDefaults = {
  repeating_skill:{additional:true,alternate:true,fields:[
      {name:'academics',stat:'mind',raw:1},
      {name:'athletics',stat:'body',raw:1},
      {name:'awareness',stat:'mind / spirit',raw:1},
      {name:'barter',stat:'mind',raw:1},
      {name:'command',stat:'mind / spirit',raw:1},
      {name:'craft',stat:'body / mind / spirit',raw:1},
      {name:'close combat',stat:'body',raw:1},
      {name:'etiquette',stat:'spirit',raw:1},
      {name:'investigation',stat:'mind / spirit',raw:1},
      {name:'interrogation',stat:'spirit',raw:1},
      {name:'languages',stat:'mind',raw:1},
      {name:'larceny',stat:'body / mind / spirit',raw:1},
      {name:'mechanics',stat:'mind',raw:1},
      {name:'medicine',stat:'mind',raw:1},
      {name:'perform',stat:'spirit',raw:1},
      {name:'persuade',stat:'body / mind / spirit',raw:1},
      {name:'publicity',stat:'spirit',raw:1},
      {name:'ride',stat:'body / spirit',raw:1},
      {name:'sail - airship',stat:'mind / spirit',raw:1},
      {name:'shooting',stat:'body',raw:1},
      {name:'stealth',stat:'body / spirit',raw:1},
      {name:'survival',stat:'mind',raw:1}
    ]
  },
  repeating_health:{additional:true,alternate:true,fields:[
      {name:'health 1',penalty:0},
      {name:'health 2',penalty:-1},
      {name:'health 3',penalty:-1}
    ]
  },
  repeating_structure:{additional:true,alternate:true,fields:[
      {name:'structure 1',penalty:0},
      {name:'structure 2',penalty:0},
      {name:'structure 3',penalty:-1},
      {name:'structure 4',penalty:-1},
      {name:'structure 5',penalty:-2}
    ]
  },
  repeating_trait:{
    additional:true,alternate:true,
    fields:[
      {name:'Environment Controls',description:'Every warbird is equipped with a heater and an oxygen system to allow it to climb up between the island layers. Their max altitude is 15 kilometres (45,000 feet) above the Uplands, though the air is very thin up there, and it would take the planes at least a half an hour to get up to that altitude.',collapse:1},
      {name:'Radio',description:'Every plane has a radio with a line of sight range of about 10 kilometres. Th e EM interference from the Eye prevents radios from reaching out farther.',collapse:1},
      {name:'Redundant Systems',description:'Warbirds have armoured cockpits, self-sealing fuel tanks and scores of back-up features designed to mitigate the effects of enemy fire. This gives them Damage Resistance 1 and Structure 5, and a pilot does not suffer injury if their warbird is damaged, unless they Put Their Life on the Line (see page 60).',collapse:1},
      {name:'Cargo Box',description:'A warbird can hold about 50 kilograms (about 110 pounds) of cargo and gear in a small cargo slot, usually right behind the pilot’s seat.',collapse:1},
      {name:'Ejection Seat',description:'Guild fi ghters are the only ones that use ejection seats. Th ey lack the rockets of modern seats but rather use compressed gasses to push the seat clear of the plane. Characters always have time to eject from a crashing plane unless Their Life is on the Line. Their chute will drop them slowly to safety. Ejecting out over the Murk or in a powerful storm is a certain-death scenario that requires a player to expend all of their Reserve to survive.',collapse:1},
      {name:'Ordinance Hardpoint',description:'Every warbird can carry at least one heavy weapon on an external pylon.',collapse:1},
      {name:'Gun Camera',description:'All warbirds have a small movie camera in their nose. It automatically activates and stays active for 30 seconds whenever the pilot fires their guns or drops ordinance. The gun camera is the primary method by which pilots confirm kills.',collapse:1},
      {name:'Limited Fuel',description:'Warbirds pay for their increased performance and armour with a drop in fuel capacity. The maximum flight time for a warbird is just over 60 minutes, and they have a maximum range of about 650 kilometres (or 400 miles), assuming they can land and refuel at the other end.',collapse:1}
    ]
  },
  system_header:'https://s3.amazonaws.com/files.d20.io/images/260489274/xCVgiDGF-dMYpVGKXL5UXA/original.png',
  health:3,
  health_max:3,
  structure:5,
  structure_max:5,
  structure_base:5,
  armour:3,
  performance:3,
  assault_damage:4,
  strike_damage:2,
  inspiring:1,
  terrifying:1,
  _defence_skill:'athletics'
};
const singulars = {
  warbirds:'warbird',
};
const typeTabs = {
  character:{
    remove:['character','warbird'],
    add:['npc','large-vehicle','npc-warbird']
  },
  'large vehicle':{
    remove:['large-vehicle'],
    add:['npc','character','warbird','npc-warbird']
  },
  npc:{
    add:['character','warbird','large-vehicle'],
    remove:['npc','npc-warbird']
  }
};
const dynamicQueries = {};/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
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
};/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
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
  debugger;
  return k.extractQueryResult(skillQuery);
}/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Initial change functions
const syncHealth = function({trigger,attributes,sections}){
  k.debug('syncing token and character health');
  const type = trigger.name.replace(/_(?:mod|max)/,'');
  k.debug({type});
  let damage = attributes[`${type}_max`] - attributes[type];
  let damageIndex = damage - 1;
  sections[`repeating_${type}`].forEach((id,index)=>{
    attributes[`repeating_${type}_${id}_damaged`] = index === damageIndex ? 1 : 0;
    attributes[`repeating_${type}_${id}_fill`] = index < damageIndex ? 1 : 0;
  });
  if(attributes[type] > attributes[`${type}_max`]){
    attributes[type] = attributes[`${type}_max`];
  }
};
k.registerFuncs({syncHealth});const checkHealth = function({trigger,attributes,sections}){
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
k.registerFuncs({displayCharacterTypeSections},{type:['opener']});const determinePenalty = function(type,attributes,sections){
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
  debugger;
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
k.registerFuncs({calcSA});/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
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
      if(warbirdSkills.includes(field)){
        field = `${field}_level`;
      }
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
k.registerFuncs({npcAttack});/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
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
k.registerFuncs({calcWarbirdStunt});/**
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
k.registerFuncs({setNPCSkillJustify},{type:['opener']});/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Update functions. These functions should be added to the updateHandlers object for iteration through by the updateSheet function.

console.debug = vi.fn(a => null);
console.log = vi.fn(a => null);
console.table = vi.fn(a => null);
module.exports = {k,...global};