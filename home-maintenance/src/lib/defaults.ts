import { Task } from './types';

let nextId = 1;
function t(name: string, group: string, notes?: string): Task {
  return {
    id: String(nextId++),
    name,
    group,
    notes,
    reminderEnabled: true,
    createdAt: new Date().toISOString(),
  };
}

const H = 'A-Frame House';
const G = 'Garage & Shop';
const O = 'Grounds & Outdoor';
const F = 'Ford F-250';
const C = 'Chevy Traverse';

export const DEFAULT_TASKS: Task[] = [
  // A-FRAME HOUSE
  t('Check propane furnace filter', H, 'Forced air — swap monthly in heating season'),
  t('Inspect propane furnace & tune-up', H, 'Annual service before heating season'),
  t('Clean wood stove chimney', H, 'Creosote buildup — schedule sweep before first burn'),
  t('Inspect wood stove gaskets & firebrick', H, 'Replace gaskets if cracked or loose'),
  t('Check propane tank level & connections', H, 'Look for leaks, schedule fill if low'),
  t('Flush on-demand water heater', H, 'Vinegar flush to remove scale buildup'),
  t('Check water heater venting', H, 'Inspect for blockage or corrosion'),
  t('Run water in unused fixtures', H, 'Prevents P-trap from drying out'),
  t('Check under sinks for leaks', H, 'Both bathrooms + kitchen'),
  t('Inspect toilet seals & flappers', H, 'Both bathrooms — replace if running'),
  t('Clean dishwasher filter & spray arms', H),
  t('Check gas stove burners & connections', H, 'Clean igniters, check gas lines'),
  t('Clean range hood filter', H, 'Soak in hot soapy water'),
  t('Deep clean fridge coils', H, 'Pull out and vacuum coils underneath'),
  t('Organize pantry & check expiration dates', H),
  t('Re-caulk bathroom fixtures', H, 'Both bathrooms — tub, shower, sink edges'),
  t('Clean bathroom exhaust fans', H, 'Remove cover, vacuum dust'),
  t('Check grout & repair if needed', H),
  t('Install window AC units', H, 'Clean filters before installing'),
  t('Remove window AC units', H, 'Clean, cover, and store for winter'),
  t('Check weather stripping on doors & windows', H, 'Replace if drafty'),
  t('Clean dryer vent & duct', H, 'Fire hazard — clean lint all the way out'),
  t('Clean washer drum & gasket', H, 'Run cleaning cycle, wipe gasket'),
  t('Inspect screened porch for tears', H, 'Patch or re-screen as needed'),
  t('Clean & treat porch deck boards', H),
  t('Test smoke & CO detectors', H, 'Press test button on each'),
  t('Replace smoke detector batteries', H),
  t('Check fire extinguisher', H, 'Verify charged and accessible'),

  // GARAGE & SHOP
  t('Clean garage wood stove chimney', G, 'Schedule sweep before burning season'),
  t('Inspect garage stove gaskets', G),
  t('Lubricate garage door tracks & springs', G),
  t('Test garage door safety reverse', G, 'Place board in door path to test'),
  t('Organize shop & sharpen tools', G),
  t('Check 3-season attic for leaks or pests', G, 'Inspect insulation, look for mouse signs'),
  t('Clean attic toy/living space', G, 'Before and after kids\' summer use'),
  t('Check attic windows & screens', G, 'Replace damaged screens'),

  // GROUNDS & OUTDOOR
  t('Open & prep greenhouse', O, 'Clean glass, check frame, set up beds'),
  t('Close greenhouse for winter', O, 'Drain lines, clean, secure'),
  t('Install dock', O, 'After ice-out — check boards and hardware'),
  t('Remove dock', O, 'Before freeze — store sections'),
  t('Inspect kayaks, canoe, paddle boards', O, 'Check for cracks, clean, inflate SUPs'),
  t('Deploy swim raft', O, 'Check anchor and deck'),
  t('Pull swim raft', O, 'Haul out and store'),
  t('Winterize dock area', O, 'Pull buoys, stow gear'),
  t('Grade gravel driveway', O, 'Quarter mile — fill potholes, drag surface'),
  t('Order gravel load if needed', O, 'Check for washout areas'),
  t('Seal paved garage pad', O, 'Every 2-3 years — check for cracks'),
  t('Clean gutters & downspouts', O, 'Both house and garage'),
  t('Inspect roof for damage', O, 'Look for missing shingles, flashing'),
  t('Winterize outdoor faucets', O, 'Shut off interior valve, open exterior'),
  t('Check sump pump', O, 'Test float switch, clean pit'),

  // FORD F-250
  t('Oil change & filter', F, '200K miles — every 5K or quarterly'),
  t('Rotate tires', F, 'Every 6 months or 7,500 mi'),
  t('Multi-point inspection', F, 'Brakes, fluids, belts, hoses, lights'),
  t('Swap to winter tires', F, 'Mount & balance — before first snow'),
  t('Swap to summer tires', F, 'Mount & balance'),
  t('Inspect shocks & suspension', F, 'Upgraded shocks — check for leaks, bushings'),
  t('Check transmission fluid', F, 'High mileage — watch for color change'),
  t('Replace air filter', F, 'Engine air filter — check cabin filter too'),
  t('Coolant system check', F, 'Check level, hoses, look for leaks'),
  t('Battery test & terminal cleaning', F, 'Test cold cranking amps'),
  t('DEF fluid check', F, 'If diesel — top off with oil change'),
  t('Inspect exhaust system', F, 'Check for rust, loose hangers'),
  t('Windshield wipers', F, 'Replace before spring rain & winter'),
  t('Interior detail & protect', F, 'Clean upholstery, protect dash'),

  // CHEVY TRAVERSE
  t('Oil change & filter', C, 'Synthetic — every 5K or quarterly'),
  t('Replace battery', C, 'Test CCA, replace before winter'),
  t('Rotate tires', C, 'Every 6 months or 7,500 mi'),
  t('Multi-point inspection', C, 'Brakes, fluids, belts, lights'),
  t('Swap to winter tires', C, 'Safety for grandkids — before first snow'),
  t('Swap to summer tires', C, 'Mount & balance'),
  t('Check tire pressure', C, 'Cold drops pressure — safety for grandkids'),
  t('Replace air filter', C, 'Engine + cabin air filter'),
  t('Replace cabin air filter', C, 'Clean air for grandkids'),
  t('Inspect brakes', C, 'Pads, rotors — prioritize safety'),
  t('Coolant system check', C, 'Check level, hoses, reservoir'),
  t('Windshield wipers', C, 'Replace before spring rain & winter'),
  t('Check all lights & signals', C, 'Headlights, brake lights, turn signals'),
  t('Fuel system — run fuel cleaner', C, 'Helps gas mileage consistency'),
  t('Check gas mileage trend', C, 'Track mpg at fill-up — flag drops > 10%'),
];
