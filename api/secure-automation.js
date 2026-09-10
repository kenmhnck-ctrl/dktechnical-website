import automation from './automation.js';
import { enforceTenant } from './_auth.js';
export default async function handler(req,res){if(!enforceTenant(req,res))return;return automation(req,res)}
