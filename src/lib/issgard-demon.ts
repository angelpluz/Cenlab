export type IssgardDemonMonster = {
  range: string;
  map: string;
  mapCode: string;
  name: string;
  level: number;
  hp: number;
  size: string | null;
  element: string | null;
  race: string | null;
};

// Data supplied by the user for the Event Issgard Demon tab.
export const ISSGARD_DEMON_MONSTERS: IssgardDemonMonster[] = [
  { range: "200+", map: "Rudus 4F", mapCode: "sp_rudus4", name: "Giant Caput", level: 213, hp: 12405430, size: "Large", element: "Neutral 2", race: "Formless" },
  { range: "200+", map: "Rudus 4F", mapCode: "sp_rudus4", name: "Venedi", level: 213, hp: 11790680, size: "Medium", element: "Poison 3", race: "Brute" },
  { range: "200+", map: "Rudus 4F", mapCode: "sp_rudus4", name: "Dolorian", level: 214, hp: 11763310, size: "Medium", element: "Poison 3", race: "Demi-Human" },
  { range: "200+", map: "Rudus 4F", mapCode: "sp_rudus4", name: "Deadre", level: 214, hp: 12435400, size: "Medium", element: "Shadow 2", race: "Demi-Human" },
  { range: "200+", map: "Rudus 4F", mapCode: "sp_rudus4", name: "Plagarion", level: 215, hp: 13189560, size: "Large", element: "Neutral 2", race: "Dragon" },
  { range: "200+", map: "Nifflheim 1F", mapCode: "nif_dun01", name: "Ghost Cube", level: 213, hp: 12735150, size: "Small", element: "Undead 1", race: "Undead" },
  { range: "200+", map: "Nifflheim 1F", mapCode: "nif_dun01", name: "Lude Gal", level: 213, hp: 12840680, size: "Small", element: "Undead 2", race: "Undead" },
  { range: "200+", map: "Nifflheim 1F", mapCode: "nif_dun01", name: "Brutal Murderer", level: 214, hp: 13909270, size: "Large", element: "Neutral 2", race: "Demi-Human" },
  { range: "200+", map: "Nifflheim 1F", mapCode: "nif_dun01", name: "Gan Ceann", level: 215, hp: 11785610, size: "Large", element: "Neutral 1", race: "Formless" },
  { range: "215+", map: "Amicitia 1F", mapCode: "amicitia1", name: "Chimera Amitera", level: 227, hp: 27974600, size: "Medium", element: "Earth 3", race: "Brute" },
  { range: "215+", map: "Amicitia 1F", mapCode: "amicitia1", name: "Chimera Litus", level: 228, hp: 23160350, size: "Medium", element: "Wind 3", race: "Demi-Human" },
  { range: "215+", map: "Amicitia 1F", mapCode: "amicitia1", name: "Chimera Fillia", level: 229, hp: 23252650, size: "Medium", element: "Fire 3", race: "Brute" },
  { range: "215+", map: "Amicitia 1F", mapCode: "amicitia1", name: "Chimera Vanilaqus", level: 230, hp: 25505670, size: "Small", element: "Water 3", race: "Formless" },
  { range: "230+", map: "Abandoned Pit 1F", mapCode: "jor_ab01", name: "Cave Calmaring", level: 232, hp: 26778990, size: "Medium", element: "Water 3", race: "Plant" },
  { range: "230+", map: "Abandoned Pit 1F", mapCode: "jor_ab01", name: "Cave Flower", level: 233, hp: 32110200, size: "Medium", element: "Water 3", race: "Fish" },
  { range: "230+", map: "Abandoned Pit 1F", mapCode: "jor_ab01", name: "Discarded Primitive Rgan", level: 234, hp: 27506820, size: "Medium", element: "Poison 3", race: "Formless" },
  { range: "230+", map: "Abandoned Pit 1F", mapCode: "jor_ab01", name: "Hallucigenia Baby", level: 234, hp: 27752300, size: "Small", element: "Water 2", race: "Insect" },
  { range: "230+", map: "Abandoned Pit 1F", mapCode: "jor_ab01", name: "Renovated Superior Rgan", level: 234, hp: 28145720, size: null, element: null, race: null },
  { range: "230+", map: "Amicitia 2F", mapCode: "amicitia2", name: "Chimera Lava Eter", level: 243, hp: 33910920, size: "Small", element: "Fire 3", race: "Formless" },
  { range: "230+", map: "Amicitia 2F", mapCode: "amicitia2", name: "Chimera Furgor", level: 244, hp: 36820210, size: "Medium", element: "Water 3", race: "Brute" },
  { range: "230+", map: "Amicitia 2F", mapCode: "amicitia2", name: "Chimera Napeo", level: 244, hp: 30324840, size: "Medium", element: "Wind 3", race: "Plant" },
  { range: "230+", map: "Amicitia 2F", mapCode: "amicitia2", name: "Chimera Galensis", level: 244, hp: 35885800, size: "Medium", element: "Earth 3", race: "Demi-Human" },
  { range: "240+", map: "Nifflheim 2F", mapCode: "nif_dun02", name: "Grote", level: 253, hp: 47842600, size: "Large", element: "Earth 2", race: "Demon" },
  { range: "240+", map: "Nifflheim 2F", mapCode: "nif_dun02", name: "Disguiser", level: 254, hp: 42030800, size: "Medium", element: "Undead 2", race: "Demon" },
  { range: "240+", map: "Nifflheim 2F", mapCode: "nif_dun02", name: "Blue Moon Loli Ruri", level: 255, hp: 46338500, size: "Large", element: "Water 3", race: "Demon" },
  { range: "240+", map: "Nifflheim 2F", mapCode: "nif_dun02", name: "Pierrotzoist", level: 255, hp: 38506310, size: "Medium", element: "Shadow 2", race: "Demon" },
  { range: "240+", map: "Clock Tower Unknown Basement", mapCode: "clock_01", name: "Sieglouse", level: 253, hp: 39324220, size: "Small", element: "Earth 2", race: "Insect" },
  { range: "240+", map: "Clock Tower", mapCode: "clock_01", name: "Erzsebet", level: 254, hp: 37709580, size: "Medium", element: "Dark 1", race: "Demon" },
  { range: "240+", map: "Clock Tower", mapCode: "clock_01", name: "Extra Joker", level: 255, hp: 39326510, size: "Large", element: "Wind 4", race: "Demon" },
  { range: "240+", map: "Clock Tower", mapCode: "clock_01", name: "Jennifer", level: 255, hp: 40978470, size: "Medium", element: "Dark 1", race: "Fish" },
  { range: "240+", map: "Clock Tower", mapCode: "clock_01", name: "General Orc", level: 255, hp: 48805390, size: "Large", element: "Dark 2", race: "Human" },
];
