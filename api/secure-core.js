import core from './core.js';
import { enforceTenant } from './_auth.js';
export default async function handler(req,res){if(!enforceTenant(req,res))return;return core(req,res)}
