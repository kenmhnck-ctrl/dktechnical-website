import automation from './automation.js';
import { enforceTenant } from './_auth.js';
export default async function handler(req,res){const a=await enforceTenant(req,res,{roles:['admin','owner','editor']});if(!a)return;return automation(req,res)}
