import core from '../lib/core.js';
import { enforceTenant } from './_auth.js';
export default async function handler(req,res){const a=await enforceTenant(req,res,{roles:['admin','owner','editor','member','viewer']});if(!a)return;return core(req,res)}
