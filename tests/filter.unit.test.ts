import {describe,it,expect} from 'vitest';
import {matchesProject} from '../src/lib/filter';
const p={title:'Food Fight',description:'Ordering workflows',tags:['Flutter','Firebase'],category:'mobile erp'};
describe('project discovery',()=>{it('matches normalized titles and technology',()=>{expect(matchesProject(p,' FOOD ','all')).toBe(true);expect(matchesProject(p,'firebase','mobile')).toBe(true)});it('combines category and search',()=>{expect(matchesProject(p,'flutter','web')).toBe(false);expect(matchesProject(p,'missing','erp')).toBe(false);expect(matchesProject(p,'','erp')).toBe(true)})});
