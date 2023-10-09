/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Update functions. These functions should be added to the updateHandlers object for iteration through by the updateSheet function.
const update1x01 = function({attributes,sections}){
  sections.repeating_drone.forEach((id)=>{
    attributes[`repeating_drone_${id}_struct`] = attributes[`repeating_drone_${id}_structure`];
    attributes[`repeating_drone_${id}_struct_max`] = attributes[`repeating_drone_${id}_structure_max`];
  });
};
k.registerFuncs({'1.01':update1x01},{type:['updater']})