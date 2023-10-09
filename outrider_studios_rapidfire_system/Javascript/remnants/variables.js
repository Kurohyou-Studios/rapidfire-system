/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Sheet Variables
k.sheetName = 'Outrider Studios\' Remnants';
k.version = 1.01;
const systemDefaults = {
  repeating_skill:{additional:true,alternate:true,fields:[
      {name:"archery / throwing",stat:"body",raw:1},
      {name:"athletics",stat:"body",raw:1},
      {name:"awareness",stat:"mind",raw:1},
      {name:"bureaucracy",stat:"mind",raw:1},
      {name:"command",stat:"mind or spirit",raw:1},
      {name:"craft",stat:"body / mind / spirit",raw:1},
      {name:"dodge",stat:"body",raw:1},
      {name:"etiquette",stat:"spirit",raw:1},
      {name:"history",stat:"mind",raw:1},
      {name:"investigation",stat:"mind / spirit",raw:1},
      {name:"language",stat:"mind",raw:1},
      {name:"larceny",stat:"mind / body / spirit",raw:1},
      {name:"lore",stat:"mind",raw:1},
      {name:"medicine",stat:"mind",raw:1},
      {name:"melee",stat:"body",raw:1},
      {name:"perform",stat:"spirit",raw:1},
      {name:"ride",stat:"body / spirit",raw:1},
      {name:"sail",stat:"mind / spirit",raw:1},
      {name:"sciences",stat:"mind",raw:1},
      {name:"social sciences",stat:"mind",raw:1},
      {name:"stealth",stat:"body",raw:1},
      {name:"survival",stat:"mind",raw:1},
      {name:"unarmed combat",stat:"body",raw:1}
    ]
  },
  repeating_health:{additional:true,alternate:true,fields:[
      {penalty:0},
      {penalty:-1},
      {penalty:-1}
    ]
  },
  repeating_structure:{additional:true,alternate:true,fields:[
      {penalty:0},
      {penalty:0},
      {penalty:-1},
      {penalty:-1},
      {penalty:-2}
    ]
  },
  system_header:'https://s3.amazonaws.com/files.d20.io/images/260489274/xCVgiDGF-dMYpVGKXL5UXA/original.png',
  health:3,
  health_max:3,
  structure:5,
  structure_max:5,
  structure_base:5,
  armour:5,
  speed:3,
  assault_damage:4,
  strike_damage:2,
  inspiring:1,
  terrifying:1,
  _defence_skill:'dodge'
};
const singulars = {
  remnants:'remnant'
};
const typeTabs = {
  character:{
    remove:['character','remnant'],
    add:['npc']
  },
  npc:{
    add:['character','remnant'],
    remove:['npc']
  }
};