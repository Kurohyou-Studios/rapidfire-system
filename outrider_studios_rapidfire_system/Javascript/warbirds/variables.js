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
const dynamicQueries = {};