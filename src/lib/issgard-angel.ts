export type IssgardAngelMonster = {
  level: number;
  name: string;
  map: string;
  mapCode: string;
  hp: number | null;
  size: string | null;
  element: string | null;
  race: string;
};

// Data supplied by the user for the Event Issgard Angel tab.
export const ISSGARD_ANGEL_MONSTERS: IssgardAngelMonster[] = [
  { name: "Empathizer", level: 200, map: "Thanatos Tower 11F", mapCode: "tha_t11", hp: 3788426, size: "Medium", element: "Ghost 4", race: "Angel" },
  { name: "Smile Giver", level: 201, map: "Thanatos Tower 11F", mapCode: "tha_t11", hp: 3808424, size: "Medium", element: "Holy 3", race: "Angel" },
  { name: "Happiness Giver", level: 202, map: "Thanatos Tower 11F", mapCode: "tha_t11", hp: 3827826, size: "Small", element: "Wind 4", race: "Angel" },
  { name: "Pray Giver", level: 203, map: "Thanatos Tower 11F", mapCode: "tha_t11", hp: 3845709, size: "Medium", element: "Ghost 3", race: "Angel" },
  { name: "Temple Rudo", level: 253, map: "Varmundt’s Biosphere – Temple", mapCode: "bl_temple", hp: 32534117, size: null, element: null, race: "Angel" },
  { name: "Temple Arc Angeling", level: 253, map: "Varmundt’s Biosphere – Temple", mapCode: "bl_temple", hp: null, size: null, element: null, race: "Angel" },
  { name: "Temple False Angel", level: 253, map: "Varmundt’s Biosphere – Temple", mapCode: "bl_temple", hp: null, size: null, element: null, race: "Angel" },
  { name: "Temple Solace", level: 254, map: "Varmundt’s Biosphere – Temple", mapCode: "bl_temple", hp: null, size: null, element: null, race: "Angel" },
  { name: "Glacier Angelgolt", level: 254, map: "Varmundt’s Biosphere – Ice", mapCode: "bl_ice", hp: 24831628, size: "Small", element: "Holy 4", race: "Angel" },
];
