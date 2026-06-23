// Generated from src/components/EXPcal.html and src/components/exptable.html.
// Keep manual edits in the source HTML or the generator command used during adaptation.

export type ExpQuestCategory = {
  id: string;
  sourceIndex: number;
  name: string;
};

export type ExpQuest = {
  id: string;
  categoryId: string;
  level: number;
  name: string;
  exp: number;
  subgroup: string | null;
  isWeekly: boolean;
  isFixedExp: boolean;
};

export type BaseExpRow = {
  level: number;
  expToReach: number;
};

export type JobExpRow = {
  level: number;
  expToNext: number;
};

export const EXP_QUEST_CATEGORIES = [
  {
    "id": "cat-0",
    "sourceIndex": 0,
    "name": "Eden Item Collecting Quests"
  },
  {
    "id": "cat-1",
    "sourceIndex": 1,
    "name": "Eden Item Hunting Quests (1st Time)"
  },
  {
    "id": "cat-2",
    "sourceIndex": 2,
    "name": "Eden Item Hunting Quests"
  },
  {
    "id": "cat-3",
    "sourceIndex": 3,
    "name": "Eden Monster Hunting Quests (1st Time)"
  },
  {
    "id": "cat-4",
    "sourceIndex": 4,
    "name": "Eden Monster Hunting Quests"
  },
  {
    "id": "cat-5",
    "sourceIndex": 5,
    "name": "Port Malaya Daily Quests"
  },
  {
    "id": "cat-6",
    "sourceIndex": 6,
    "name": "EP 14.3 Daily Quests"
  },
  {
    "id": "cat-7",
    "sourceIndex": 7,
    "name": "EP 15.1-15.2 Daily Quests"
  },
  {
    "id": "cat-8",
    "sourceIndex": 8,
    "name": "EP 16.1-18 Main Quests"
  },
  {
    "id": "cat-9",
    "sourceIndex": 9,
    "name": "EP 16.1 Daily Quests"
  },
  {
    "id": "cat-10",
    "sourceIndex": 10,
    "name": "EP 16.2 Daily Quests"
  },
  {
    "id": "cat-11",
    "sourceIndex": 11,
    "name": "EP 17.1 Daily Quests"
  },
  {
    "id": "cat-12",
    "sourceIndex": 12,
    "name": "EP 17.2 Daily Quests"
  },
  {
    "id": "cat-13",
    "sourceIndex": 13,
    "name": "EP 18 Daily Quests"
  },
  {
    "id": "cat-14",
    "sourceIndex": 14,
    "name": "Illusion Dungeon Daily Quests"
  },
  {
    "id": "cat-15",
    "sourceIndex": 15,
    "name": "175-190 Monster Hunting Quests"
  },
  {
    "id": "cat-16",
    "sourceIndex": 16,
    "name": "200-250 Monster Hunting Quests"
  },
  {
    "id": "cat-17",
    "sourceIndex": 17,
    "name": "Project Lumina EP 1 Daily Quests"
  }
] as const satisfies readonly ExpQuestCategory[];

export const EXP_QUESTS = [
  {
    "id": "q-0-0",
    "categoryId": "cat-0",
    "level": 1,
    "name": "30x Fluff",
    "exp": 5000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-1",
    "categoryId": "cat-0",
    "level": 10,
    "name": "30x Sticky Web Feet",
    "exp": 5400,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-2",
    "categoryId": "cat-0",
    "level": 15,
    "name": "30x Grasshopper Leg",
    "exp": 5940,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-3",
    "categoryId": "cat-0",
    "level": 20,
    "name": "30x Snail's Shell",
    "exp": 7020,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-4",
    "categoryId": "cat-0",
    "level": 25,
    "name": "30x Bird's Beak",
    "exp": 9720,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-5",
    "categoryId": "cat-0",
    "level": 30,
    "name": "30x Bear Footskin",
    "exp": 10800,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-6",
    "categoryId": "cat-0",
    "level": 35,
    "name": "30x Dead Branch",
    "exp": 13980,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-7",
    "categoryId": "cat-0",
    "level": 40,
    "name": "30x Yoyo Tail",
    "exp": 16200,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-8",
    "categoryId": "cat-0",
    "level": 45,
    "name": "30x Lantern",
    "exp": 19980,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-9",
    "categoryId": "cat-0",
    "level": 50,
    "name": "30x Conch",
    "exp": 22140,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-10",
    "categoryId": "cat-0",
    "level": 55,
    "name": "30x Heart of Mermaid",
    "exp": 28560,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-11",
    "categoryId": "cat-0",
    "level": 60,
    "name": "30x Mane",
    "exp": 34380,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-12",
    "categoryId": "cat-0",
    "level": 65,
    "name": "30x Black Hair",
    "exp": 35640,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-13",
    "categoryId": "cat-0",
    "level": 70,
    "name": "30x Horseshoe",
    "exp": 36000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-14",
    "categoryId": "cat-0",
    "level": 75,
    "name": "30x Bug Leg",
    "exp": 48600,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-15",
    "categoryId": "cat-0",
    "level": 80,
    "name": "30x Sand Clump",
    "exp": 62040,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-16",
    "categoryId": "cat-0",
    "level": 85,
    "name": "30x Dry Sand",
    "exp": 72060,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-17",
    "categoryId": "cat-0",
    "level": 90,
    "name": "30x Turtle Shell",
    "exp": 78300,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-18",
    "categoryId": "cat-0",
    "level": 95,
    "name": "30x Little Evil Horn",
    "exp": 108360,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-0-19",
    "categoryId": "cat-0",
    "level": 100,
    "name": "30x Glacial Heart",
    "exp": 116640,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-1-0",
    "categoryId": "cat-1",
    "level": 100,
    "name": "10x Lava",
    "exp": 320000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-1-1",
    "categoryId": "cat-1",
    "level": 100,
    "name": "20x Blue Hair",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-1-2",
    "categoryId": "cat-1",
    "level": 100,
    "name": "20x Glacial Heart",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-1-3",
    "categoryId": "cat-1",
    "level": 110,
    "name": "20x Mystic Horn",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-1-4",
    "categoryId": "cat-1",
    "level": 110,
    "name": "10x Bloody Page",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-1-5",
    "categoryId": "cat-1",
    "level": 110,
    "name": "10x Worn-Out Magic Scroll",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-1-6",
    "categoryId": "cat-1",
    "level": 110,
    "name": "30x Tattered Clothes",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-2-0",
    "categoryId": "cat-2",
    "level": 100,
    "name": "10x Lava",
    "exp": 160000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-2-1",
    "categoryId": "cat-2",
    "level": 100,
    "name": "20x Blue Hair",
    "exp": 100000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-2-2",
    "categoryId": "cat-2",
    "level": 100,
    "name": "20x Glacial Heart",
    "exp": 100000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-2-3",
    "categoryId": "cat-2",
    "level": 110,
    "name": "20x Mystic Horn",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-2-4",
    "categoryId": "cat-2",
    "level": 110,
    "name": "10x Bloody Page",
    "exp": 400000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-2-5",
    "categoryId": "cat-2",
    "level": 110,
    "name": "10x Worn-Out Magic Scroll",
    "exp": 400000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-2-6",
    "categoryId": "cat-2",
    "level": 110,
    "name": "30x Tattered Clothes",
    "exp": 400000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-0",
    "categoryId": "cat-3",
    "level": 100,
    "name": "30x Nightmare Terror",
    "exp": 320000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-1",
    "categoryId": "cat-3",
    "level": 100,
    "name": "30x Ground Deleter 30x Sky Deleter",
    "exp": 320000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-2",
    "categoryId": "cat-3",
    "level": 100,
    "name": "30x Carat",
    "exp": 320000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-3",
    "categoryId": "cat-3",
    "level": 100,
    "name": "30x Arclouse",
    "exp": 320000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-4",
    "categoryId": "cat-3",
    "level": 100,
    "name": "30x Anolian",
    "exp": 400000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-5",
    "categoryId": "cat-3",
    "level": 100,
    "name": "30x Sting",
    "exp": 400000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-6",
    "categoryId": "cat-3",
    "level": 100,
    "name": "30x Majorous",
    "exp": 520000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-7",
    "categoryId": "cat-3",
    "level": 100,
    "name": "30x Pinguicula",
    "exp": 320000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-8",
    "categoryId": "cat-3",
    "level": 100,
    "name": "30x Luciola Vespa",
    "exp": 400000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-9",
    "categoryId": "cat-3",
    "level": 100,
    "name": "1x Tendrillion",
    "exp": 520000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-10",
    "categoryId": "cat-3",
    "level": 100,
    "name": "20x Kobold Axe 20x Kobold Hammer 20x Kobold Mace",
    "exp": 500000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-11",
    "categoryId": "cat-3",
    "level": 100,
    "name": "30x Hill Wind",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-12",
    "categoryId": "cat-3",
    "level": 100,
    "name": "30x Desert Wolf",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-13",
    "categoryId": "cat-3",
    "level": 100,
    "name": "30x Muscipular 30x Drosera",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-14",
    "categoryId": "cat-3",
    "level": 100,
    "name": "30x Magmaring",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-15",
    "categoryId": "cat-3",
    "level": 100,
    "name": "30x Snowier",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-16",
    "categoryId": "cat-3",
    "level": 100,
    "name": "30x Ice Titan 10x Gazeti",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-17",
    "categoryId": "cat-3",
    "level": 110,
    "name": "30x Raydric",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-18",
    "categoryId": "cat-3",
    "level": 110,
    "name": "30x Khalitzburg",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-19",
    "categoryId": "cat-3",
    "level": 110,
    "name": "30x Wanderer",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-20",
    "categoryId": "cat-3",
    "level": 110,
    "name": "10x Abysmal Knight",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-21",
    "categoryId": "cat-3",
    "level": 110,
    "name": "30x Dark Pinguicula",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-22",
    "categoryId": "cat-3",
    "level": 110,
    "name": "30x Nepenthes",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-23",
    "categoryId": "cat-3",
    "level": 110,
    "name": "30x Naga",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-24",
    "categoryId": "cat-3",
    "level": 110,
    "name": "30x Cornus",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-25",
    "categoryId": "cat-3",
    "level": 110,
    "name": "20x Centipede Larva",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-26",
    "categoryId": "cat-3",
    "level": 110,
    "name": "30x Ancient Mimic",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-27",
    "categoryId": "cat-3",
    "level": 110,
    "name": "30x Deathword",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-28",
    "categoryId": "cat-3",
    "level": 110,
    "name": "20x Owl Baron",
    "exp": 1000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-29",
    "categoryId": "cat-3",
    "level": 110,
    "name": "20x Venatu (Orange) 20x Venatu (Green)",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-30",
    "categoryId": "cat-3",
    "level": 110,
    "name": "20x Venatu (Red) 20x Venatu (Blue)",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-31",
    "categoryId": "cat-3",
    "level": 110,
    "name": "10x Dimik (Blue) 10x Dimik (Orange)",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-32",
    "categoryId": "cat-3",
    "level": 110,
    "name": "10x Dimik (Green) 10x Dimik (Red)",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-33",
    "categoryId": "cat-3",
    "level": 120,
    "name": "20x Skogul",
    "exp": 1200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-34",
    "categoryId": "cat-3",
    "level": 120,
    "name": "20x Frus",
    "exp": 1200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-35",
    "categoryId": "cat-3",
    "level": 120,
    "name": "5x Skeggiold (Blue) 5x Skeggiold (Brown)",
    "exp": 1200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-36",
    "categoryId": "cat-3",
    "level": 120,
    "name": "30x Green Ferus 30x Red Ferus",
    "exp": 1000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-37",
    "categoryId": "cat-3",
    "level": 120,
    "name": "30x Yellow Acidus 30x Blue Acidus",
    "exp": 1000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-38",
    "categoryId": "cat-3",
    "level": 120,
    "name": "1x Hydrolancer",
    "exp": 1000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-39",
    "categoryId": "cat-3",
    "level": 120,
    "name": "30x Baroness of Retribution",
    "exp": 1200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-40",
    "categoryId": "cat-3",
    "level": 120,
    "name": "30x Lady Solace",
    "exp": 1200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-41",
    "categoryId": "cat-3",
    "level": 120,
    "name": "30x Mistress of Shelter",
    "exp": 1200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-42",
    "categoryId": "cat-3",
    "level": 120,
    "name": "30x Dame of Sentinel",
    "exp": 1200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-43",
    "categoryId": "cat-3",
    "level": 120,
    "name": "30x Centipede",
    "exp": 1200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-44",
    "categoryId": "cat-3",
    "level": 120,
    "name": "30x Tatacho",
    "exp": 1200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-45",
    "categoryId": "cat-3",
    "level": 120,
    "name": "30x Ragged Zombie 30x Zombie Slaughter",
    "exp": 2000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-46",
    "categoryId": "cat-3",
    "level": 120,
    "name": "30x Banshee",
    "exp": 1000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-47",
    "categoryId": "cat-3",
    "level": 120,
    "name": "20x Necromancer",
    "exp": 1200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-48",
    "categoryId": "cat-3",
    "level": 120,
    "name": "20x Vanberk 20x Isilla",
    "exp": 1000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-49",
    "categoryId": "cat-3",
    "level": 120,
    "name": "30x Hodremlin",
    "exp": 1000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-50",
    "categoryId": "cat-3",
    "level": 120,
    "name": "20x Agav 20x Echio",
    "exp": 1000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-51",
    "categoryId": "cat-3",
    "level": 120,
    "name": "5x Incubus 5x Succubus",
    "exp": 400000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-52",
    "categoryId": "cat-3",
    "level": 130,
    "name": "30x Dolomedes",
    "exp": 1600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-53",
    "categoryId": "cat-3",
    "level": 130,
    "name": "30x Uni-horn Scaraba",
    "exp": 1600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-54",
    "categoryId": "cat-3",
    "level": 130,
    "name": "30x Horn Scaraba",
    "exp": 1600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-55",
    "categoryId": "cat-3",
    "level": 130,
    "name": "30x Antler Scaraba",
    "exp": 1600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-56",
    "categoryId": "cat-3",
    "level": 130,
    "name": "30x Rake Scaraba",
    "exp": 1600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-57",
    "categoryId": "cat-3",
    "level": 130,
    "name": "20x Miming",
    "exp": 1700000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-58",
    "categoryId": "cat-3",
    "level": 130,
    "name": "20x Little Fatum",
    "exp": 1700000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-59",
    "categoryId": "cat-3",
    "level": 130,
    "name": "30x Egnigem Cenia",
    "exp": 1700000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-60",
    "categoryId": "cat-3",
    "level": 130,
    "name": "30x Armeyer Dinze",
    "exp": 1700000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-61",
    "categoryId": "cat-3",
    "level": 130,
    "name": "30x Wickebine Tres",
    "exp": 1700000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-62",
    "categoryId": "cat-3",
    "level": 130,
    "name": "30x Kavach Icarus",
    "exp": 1700000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-63",
    "categoryId": "cat-3",
    "level": 130,
    "name": "30x Errende Ebecee",
    "exp": 1700000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-64",
    "categoryId": "cat-3",
    "level": 130,
    "name": "30x Laurell Weinder",
    "exp": 1700000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-65",
    "categoryId": "cat-3",
    "level": 140,
    "name": "2x Cecil Damon",
    "exp": 2000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-66",
    "categoryId": "cat-3",
    "level": 140,
    "name": "2x Kathryne Keyron",
    "exp": 2000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-67",
    "categoryId": "cat-3",
    "level": 140,
    "name": "2x Margaretha Sorin",
    "exp": 2000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-68",
    "categoryId": "cat-3",
    "level": 140,
    "name": "2x Seyren Windsor",
    "exp": 2000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-69",
    "categoryId": "cat-3",
    "level": 140,
    "name": "2x Eremes Guile",
    "exp": 2000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-70",
    "categoryId": "cat-3",
    "level": 140,
    "name": "2x Howard Alt-Eisen",
    "exp": 2000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-71",
    "categoryId": "cat-3",
    "level": 130,
    "name": "30x Incarnation of Morroc (Angel)",
    "exp": 1600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-72",
    "categoryId": "cat-3",
    "level": 130,
    "name": "30x Incarnation of Morroc (Golem)",
    "exp": 1600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-73",
    "categoryId": "cat-3",
    "level": 130,
    "name": "30x Incarnation of Morroc (Human)",
    "exp": 1600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-3-74",
    "categoryId": "cat-3",
    "level": 130,
    "name": "30x Incarnation of Morroc (Ghost)",
    "exp": 1600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-0",
    "categoryId": "cat-4",
    "level": 100,
    "name": "30x Nightmare Terror",
    "exp": 160000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-1",
    "categoryId": "cat-4",
    "level": 100,
    "name": "30x Ground Deleter 30x Sky Deleter",
    "exp": 160000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-2",
    "categoryId": "cat-4",
    "level": 100,
    "name": "30x Carat",
    "exp": 160000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-3",
    "categoryId": "cat-4",
    "level": 100,
    "name": "30x Arclouse",
    "exp": 160000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-4",
    "categoryId": "cat-4",
    "level": 100,
    "name": "30x Anolian",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-5",
    "categoryId": "cat-4",
    "level": 100,
    "name": "30x Sting",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-6",
    "categoryId": "cat-4",
    "level": 100,
    "name": "30x Majorous",
    "exp": 260000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-7",
    "categoryId": "cat-4",
    "level": 100,
    "name": "30x Pinguicula",
    "exp": 160000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-8",
    "categoryId": "cat-4",
    "level": 100,
    "name": "30x Luciola Vespa",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-9",
    "categoryId": "cat-4",
    "level": 100,
    "name": "1x Tendrillion",
    "exp": 260000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-10",
    "categoryId": "cat-4",
    "level": 100,
    "name": "20x Kobold Axe 20x Kobold Hammer 20x Kobold Mace",
    "exp": 250000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-11",
    "categoryId": "cat-4",
    "level": 100,
    "name": "30x Hill Wind",
    "exp": 150000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-12",
    "categoryId": "cat-4",
    "level": 100,
    "name": "30x Desert Wolf",
    "exp": 150000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-13",
    "categoryId": "cat-4",
    "level": 100,
    "name": "30x Muscipular 30x Drosera",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-14",
    "categoryId": "cat-4",
    "level": 100,
    "name": "30x Magmaring",
    "exp": 150000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-15",
    "categoryId": "cat-4",
    "level": 100,
    "name": "30x Snowier",
    "exp": 150000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-16",
    "categoryId": "cat-4",
    "level": 100,
    "name": "30x Ice Titan 10x Gazeti",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-17",
    "categoryId": "cat-4",
    "level": 110,
    "name": "30x Raydric",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-18",
    "categoryId": "cat-4",
    "level": 110,
    "name": "30x Khalitzburg",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-19",
    "categoryId": "cat-4",
    "level": 110,
    "name": "30x Wanderer",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-20",
    "categoryId": "cat-4",
    "level": 110,
    "name": "10x Abysmal Knight",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-21",
    "categoryId": "cat-4",
    "level": 110,
    "name": "30x Dark Pinguicula",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-22",
    "categoryId": "cat-4",
    "level": 110,
    "name": "30x Nepenthes",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-23",
    "categoryId": "cat-4",
    "level": 110,
    "name": "30x Naga",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-24",
    "categoryId": "cat-4",
    "level": 110,
    "name": "30x Cornus",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-25",
    "categoryId": "cat-4",
    "level": 110,
    "name": "20x Centipede Larva",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-26",
    "categoryId": "cat-4",
    "level": 110,
    "name": "30x Ancient Mimic",
    "exp": 400000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-27",
    "categoryId": "cat-4",
    "level": 110,
    "name": "30x Deathword",
    "exp": 400000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-28",
    "categoryId": "cat-4",
    "level": 110,
    "name": "20x Owl Baron",
    "exp": 500000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-29",
    "categoryId": "cat-4",
    "level": 110,
    "name": "20x Venatu (Orange) 20x Venatu (Green)",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-30",
    "categoryId": "cat-4",
    "level": 110,
    "name": "20x Venatu (Red) 20x Venatu (Blue)",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-31",
    "categoryId": "cat-4",
    "level": 110,
    "name": "10x Dimik (Blue) 10x Dimik (Orange)",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-32",
    "categoryId": "cat-4",
    "level": 110,
    "name": "10x Dimik (Green) 10x Dimik (Red)",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-33",
    "categoryId": "cat-4",
    "level": 120,
    "name": "20x Skogul",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-34",
    "categoryId": "cat-4",
    "level": 120,
    "name": "20x Frus",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-35",
    "categoryId": "cat-4",
    "level": 120,
    "name": "5x Skeggiold (Blue) 5x Skeggiold (Brown)",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-36",
    "categoryId": "cat-4",
    "level": 120,
    "name": "30x Green Ferus 30x Red Ferus",
    "exp": 500000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-37",
    "categoryId": "cat-4",
    "level": 120,
    "name": "30x Yellow Acidus 30x Blue Acidus",
    "exp": 500000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-38",
    "categoryId": "cat-4",
    "level": 120,
    "name": "1x Hydrolancer",
    "exp": 500000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-39",
    "categoryId": "cat-4",
    "level": 120,
    "name": "30x Baroness of Retribution",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-40",
    "categoryId": "cat-4",
    "level": 120,
    "name": "30x Lady Solace",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-41",
    "categoryId": "cat-4",
    "level": 120,
    "name": "30x Mistress of Shelter",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-42",
    "categoryId": "cat-4",
    "level": 120,
    "name": "30x Dame of Sentinel",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-43",
    "categoryId": "cat-4",
    "level": 120,
    "name": "30x Centipede",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-44",
    "categoryId": "cat-4",
    "level": 120,
    "name": "30x Tatacho",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-45",
    "categoryId": "cat-4",
    "level": 120,
    "name": "30x Ragged Zombie 30x Zombie Slaughter",
    "exp": 1000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-46",
    "categoryId": "cat-4",
    "level": 120,
    "name": "30x Banshee",
    "exp": 500000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-47",
    "categoryId": "cat-4",
    "level": 120,
    "name": "20x Necromancer",
    "exp": 600000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-48",
    "categoryId": "cat-4",
    "level": 120,
    "name": "20x Vanberk 20x Isilla",
    "exp": 500000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-49",
    "categoryId": "cat-4",
    "level": 120,
    "name": "30x Hodremlin",
    "exp": 500000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-50",
    "categoryId": "cat-4",
    "level": 120,
    "name": "20x Agav 20x Echio",
    "exp": 500000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-51",
    "categoryId": "cat-4",
    "level": 120,
    "name": "5x Incubus 5x Succubus",
    "exp": 400000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-52",
    "categoryId": "cat-4",
    "level": 130,
    "name": "30x Dolomedes",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-53",
    "categoryId": "cat-4",
    "level": 130,
    "name": "30x Uni-horn Scaraba",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-54",
    "categoryId": "cat-4",
    "level": 130,
    "name": "30x Horn Scaraba",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-55",
    "categoryId": "cat-4",
    "level": 130,
    "name": "30x Antler Scaraba",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-56",
    "categoryId": "cat-4",
    "level": 130,
    "name": "30x Rake Scaraba",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-57",
    "categoryId": "cat-4",
    "level": 130,
    "name": "20x Miming",
    "exp": 850000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-58",
    "categoryId": "cat-4",
    "level": 130,
    "name": "20x Little Fatum",
    "exp": 850000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-59",
    "categoryId": "cat-4",
    "level": 130,
    "name": "30x Egnigem Cenia",
    "exp": 850000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-60",
    "categoryId": "cat-4",
    "level": 130,
    "name": "30x Armeyer Dinze",
    "exp": 850000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-61",
    "categoryId": "cat-4",
    "level": 130,
    "name": "30x Wickebine Tres",
    "exp": 850000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-62",
    "categoryId": "cat-4",
    "level": 130,
    "name": "30x Kavach Icarus",
    "exp": 850000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-63",
    "categoryId": "cat-4",
    "level": 130,
    "name": "30x Errende Ebecee",
    "exp": 850000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-64",
    "categoryId": "cat-4",
    "level": 130,
    "name": "30x Laurell Weinder",
    "exp": 850000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-65",
    "categoryId": "cat-4",
    "level": 140,
    "name": "2x Cecil Damon",
    "exp": 1000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-66",
    "categoryId": "cat-4",
    "level": 140,
    "name": "2x Kathryne Keyron",
    "exp": 1000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-67",
    "categoryId": "cat-4",
    "level": 140,
    "name": "2x Margaretha Sorin",
    "exp": 1000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-68",
    "categoryId": "cat-4",
    "level": 140,
    "name": "2x Seyren Windsor",
    "exp": 1000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-69",
    "categoryId": "cat-4",
    "level": 140,
    "name": "2x Eremes Guile",
    "exp": 1000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-70",
    "categoryId": "cat-4",
    "level": 140,
    "name": "2x Howard Alt-Eisen",
    "exp": 1000000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-71",
    "categoryId": "cat-4",
    "level": 130,
    "name": "30x Incarnation of Morroc (Angel)",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-72",
    "categoryId": "cat-4",
    "level": 130,
    "name": "30x Incarnation of Morroc (Golem)",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-73",
    "categoryId": "cat-4",
    "level": 130,
    "name": "30x Incarnation of Morroc (Human)",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-74",
    "categoryId": "cat-4",
    "level": 130,
    "name": "30x Incarnation of Morroc (Ghost)",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-75",
    "categoryId": "cat-4",
    "level": 130,
    "name": "60x Monsters in ecl_fild01",
    "exp": 1042488,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-76",
    "categoryId": "cat-4",
    "level": 130,
    "name": "60x Monsters in ba_bath",
    "exp": 1163508,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-77",
    "categoryId": "cat-4",
    "level": 130,
    "name": "60x Monsters in ba_lib",
    "exp": 1700618,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-78",
    "categoryId": "cat-4",
    "level": 130,
    "name": "60x Monsters in ba_pw02",
    "exp": 1685862,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-79",
    "categoryId": "cat-4",
    "level": 130,
    "name": "60x Monsters in ba_pw01",
    "exp": 1845139,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-80",
    "categoryId": "cat-4",
    "level": 130,
    "name": "60x Monsters in lasa_dun02",
    "exp": 1110729,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-81",
    "categoryId": "cat-4",
    "level": 140,
    "name": "30x Cenere 30x Antique Book",
    "exp": 2940165,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-82",
    "categoryId": "cat-4",
    "level": 140,
    "name": "120x Monsters in lasa_dun03",
    "exp": 3892320,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-83",
    "categoryId": "cat-4",
    "level": 140,
    "name": "120x Monsters in prt_prison",
    "exp": 3024000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-84",
    "categoryId": "cat-4",
    "level": 140,
    "name": "120x Monsters in prt_q",
    "exp": 3584280,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-85",
    "categoryId": "cat-4",
    "level": 140,
    "name": "120x Monsters in rockmi1",
    "exp": 3154932,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-86",
    "categoryId": "cat-4",
    "level": 150,
    "name": "30x Wanderer (Nightmare)",
    "exp": 6092805,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-87",
    "categoryId": "cat-4",
    "level": 150,
    "name": "30x Smelly Zombie (un_bunker)",
    "exp": 1258659,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-88",
    "categoryId": "cat-4",
    "level": 150,
    "name": "20x Repair Robot Turbo 30x Green Cenere",
    "exp": 1145250,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-89",
    "categoryId": "cat-4",
    "level": 150,
    "name": "40x Big Ben 40x Neo-Punk",
    "exp": 1971508,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-90",
    "categoryId": "cat-4",
    "level": 150,
    "name": "160x Monsters in ba_lost",
    "exp": 25429197,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-91",
    "categoryId": "cat-4",
    "level": 160,
    "name": "50x Big Bell",
    "exp": 7513000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-92",
    "categoryId": "cat-4",
    "level": 160,
    "name": "40x Gray Goat 40x Gray Wolf Baby",
    "exp": 13866768,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-93",
    "categoryId": "cat-4",
    "level": 160,
    "name": "80x Monsters in sp_rudus2",
    "exp": 13603464,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-94",
    "categoryId": "cat-4",
    "level": 160,
    "name": "50x Recon Robot (ver_eju)",
    "exp": 21257100,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-95",
    "categoryId": "cat-4",
    "level": 160,
    "name": "40x Exploration Rover 40x Exploration Rover Turbo",
    "exp": 12216160,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-96",
    "categoryId": "cat-4",
    "level": 170,
    "name": "160x Monsters in ba_2whs01",
    "exp": 44954533,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-97",
    "categoryId": "cat-4",
    "level": 170,
    "name": "80x Monsters in oz_dun01",
    "exp": 28732040,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-98",
    "categoryId": "cat-4",
    "level": 170,
    "name": "160x Monsters in sp_rudus3",
    "exp": 30639280,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-99",
    "categoryId": "cat-4",
    "level": 175,
    "name": "40x Rigid Kaho 40x Rigid Earth Deleter 40x Rigid Nightmare Terror",
    "exp": 43520973,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-100",
    "categoryId": "cat-4",
    "level": 180,
    "name": "160x Monsters in ba_2whs02",
    "exp": 33749488,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-101",
    "categoryId": "cat-4",
    "level": 180,
    "name": "160x Monsters in gl_cas01_",
    "exp": 35686094,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-102",
    "categoryId": "cat-4",
    "level": 180,
    "name": "80x Monsters in gw_fild01",
    "exp": 26550614,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-103",
    "categoryId": "cat-4",
    "level": 180,
    "name": "160x Monsters in ein_dun03",
    "exp": 93011586,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-104",
    "categoryId": "cat-4",
    "level": 190,
    "name": "240x Monsters in odin_past",
    "exp": 98882731,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-105",
    "categoryId": "cat-4",
    "level": 190,
    "name": "240x Monsters in abyss_04",
    "exp": 79912332,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-4-106",
    "categoryId": "cat-4",
    "level": 190,
    "name": "240x Monsters in ba_pw03",
    "exp": 63975339,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-5-0",
    "categoryId": "cat-5",
    "level": 100,
    "name": "1x Offering Bouquet (3x Beautiful Flower 3x Elegant Flower 3x Mysterious Flower)",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-5-1",
    "categoryId": "cat-5",
    "level": 100,
    "name": "6x Silver Cross (12x Silver Bracelet) 6x Sharpened Bamboo 6x Bags of Salt",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-5-2",
    "categoryId": "cat-5",
    "level": 100,
    "name": "6x Spiritual Protection",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-5-3",
    "categoryId": "cat-5",
    "level": 100,
    "name": "5x Cast-Iron Caldron",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-5-4",
    "categoryId": "cat-5",
    "level": 100,
    "name": "10x Silver Bracelet 10x Tiyanak 10x Manananggal",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-5-5",
    "categoryId": "cat-5",
    "level": 100,
    "name": "1x Inside-Out Shirt",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-5-6",
    "categoryId": "cat-5",
    "level": 100,
    "name": "10x Purified Spirit Bone (10x Holy Water)",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-5-7",
    "categoryId": "cat-5",
    "level": 100,
    "name": "20x Jejeling",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-5-8",
    "categoryId": "cat-5",
    "level": 100,
    "name": "30x Jejellopy",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-5-9",
    "categoryId": "cat-5",
    "level": 100,
    "name": "10x Bungisngis",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-6-0",
    "categoryId": "cat-6",
    "level": 140,
    "name": "1x Vassal of Destruction 1x Vassal of Flame 1x Vassal of Freezing",
    "exp": 1000000,
    "subgroup": "Flame Basin",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-6-1",
    "categoryId": "cat-6",
    "level": 140,
    "name": "3x Mana crystal",
    "exp": 350000,
    "subgroup": "Flame Basin",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-6-2",
    "categoryId": "cat-6",
    "level": 140,
    "name": "10x Angry Mimic 10x Bradium Box",
    "exp": 800000,
    "subgroup": "Flame Basin",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-6-3",
    "categoryId": "cat-6",
    "level": 120,
    "name": "Finish Nightmarish Jitterbug",
    "exp": 1500000,
    "subgroup": "Nightmarish Jitterbug",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-0",
    "categoryId": "cat-7",
    "level": 140,
    "name": "10x Recon Robot",
    "exp": 1500000,
    "subgroup": "Verus",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-1",
    "categoryId": "cat-7",
    "level": 140,
    "name": "15x Repair Robot 15x Explorer Robot",
    "exp": 1500000,
    "subgroup": "Verus",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-2",
    "categoryId": "cat-7",
    "level": 140,
    "name": "20x Power Control Device",
    "exp": 1500000,
    "subgroup": "Verus",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-3",
    "categoryId": "cat-7",
    "level": 140,
    "name": "10x Enriched Energy (10x Empty Bottle)",
    "exp": 1500000,
    "subgroup": "Verus",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-4",
    "categoryId": "cat-7",
    "level": 140,
    "name": "1x Excavator Report",
    "exp": 300000,
    "subgroup": "Verus",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-5",
    "categoryId": "cat-7",
    "level": 140,
    "name": "10x Gathered Herb 10x Doom Prayer 10x Illegal Promotion 10x Stone",
    "exp": 1000000,
    "subgroup": "Verus",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-6",
    "categoryId": "cat-7",
    "level": 140,
    "name": "5x Memory Records",
    "exp": 1500000,
    "subgroup": "Verus",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-7",
    "categoryId": "cat-7",
    "level": 140,
    "name": "5x Laboratory Memory Record",
    "exp": 1500000,
    "subgroup": "Verus",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-8",
    "categoryId": "cat-7",
    "level": 140,
    "name": "Finish Talking 4 NPCs",
    "exp": 1000000,
    "subgroup": "Verus",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-9",
    "categoryId": "cat-7",
    "level": 140,
    "name": "30x Green Cenere",
    "exp": 1000000,
    "subgroup": "Verus",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-10",
    "categoryId": "cat-7",
    "level": 140,
    "name": "30x Repair Robot Turbo",
    "exp": 1000000,
    "subgroup": "Verus",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-11",
    "categoryId": "cat-7",
    "level": 140,
    "name": "30x Metalbug",
    "exp": 1000000,
    "subgroup": "Verus",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-12",
    "categoryId": "cat-7",
    "level": 140,
    "name": "1x Record Fragment (Routine 1)",
    "exp": 750000,
    "subgroup": "Verus",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-13",
    "categoryId": "cat-7",
    "level": 140,
    "name": "1x Record Fragment (Routine 2)",
    "exp": 1000000,
    "subgroup": "Verus",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-14",
    "categoryId": "cat-7",
    "level": 130,
    "name": "Finish Charleston Crisis",
    "exp": 1500000,
    "subgroup": "Charleston Crisis",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-7-15",
    "categoryId": "cat-7",
    "level": 130,
    "name": "50x Roboring",
    "exp": 1000000,
    "subgroup": "Charleston Crisis",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-0",
    "categoryId": "cat-8",
    "level": 100,
    "name": "Learning About the Families",
    "exp": 300000,
    "subgroup": "EP 16.1",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-1",
    "categoryId": "cat-8",
    "level": 100,
    "name": "Ritual of Blessing",
    "exp": 400000,
    "subgroup": "EP 16.1",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-2",
    "categoryId": "cat-8",
    "level": 100,
    "name": "Sidequest: Room of Consciousness",
    "exp": 800000,
    "subgroup": "EP 16.1",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-3",
    "categoryId": "cat-8",
    "level": 100,
    "name": "Sidequest: Geoborg",
    "exp": 700000,
    "subgroup": "EP 16.1",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-4",
    "categoryId": "cat-8",
    "level": 100,
    "name": "Sidequest: Walther Sidequest",
    "exp": 1000000,
    "subgroup": "EP 16.1",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-5",
    "categoryId": "cat-8",
    "level": 100,
    "name": "Sidequest: Rougenbourg Sidequest",
    "exp": 1000000,
    "subgroup": "EP 16.1",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-6",
    "categoryId": "cat-8",
    "level": 100,
    "name": "Sidequest: Wigner Sidequest",
    "exp": 1000000,
    "subgroup": "EP 16.1",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-7",
    "categoryId": "cat-8",
    "level": 100,
    "name": "Fight Elena",
    "exp": 200000,
    "subgroup": "EP 16.2",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-8",
    "categoryId": "cat-8",
    "level": 100,
    "name": "Rebellion Leader",
    "exp": 200000,
    "subgroup": "EP 16.2",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-9",
    "categoryId": "cat-8",
    "level": 100,
    "name": "Lazy",
    "exp": 1000000,
    "subgroup": "EP 16.2",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-10",
    "categoryId": "cat-8",
    "level": 100,
    "name": "Skia & Kronecker",
    "exp": 500000,
    "subgroup": "EP 16.2",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-11",
    "categoryId": "cat-8",
    "level": 100,
    "name": "Phillophon Tess",
    "exp": 500000,
    "subgroup": "EP 16.2",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-12",
    "categoryId": "cat-8",
    "level": 100,
    "name": "Sidequest: Small Leather Bag",
    "exp": 600000,
    "subgroup": "EP 16.2",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-13",
    "categoryId": "cat-8",
    "level": 100,
    "name": "Sidequest: Arinoa Yurhik",
    "exp": 1000000,
    "subgroup": "EP 16.2",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-14",
    "categoryId": "cat-8",
    "level": 100,
    "name": "Sidequest: Elena",
    "exp": 200000,
    "subgroup": "EP 16.2",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-15",
    "categoryId": "cat-8",
    "level": 110,
    "name": "Rudus Investigation",
    "exp": 800000,
    "subgroup": "EP 17.1",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-16",
    "categoryId": "cat-8",
    "level": 110,
    "name": "Securing Regenschirm",
    "exp": 1000000,
    "subgroup": "EP 17.1",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-17",
    "categoryId": "cat-8",
    "level": 110,
    "name": "Bonus: Scattered Document",
    "exp": 200000,
    "subgroup": "EP 17.1",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-18",
    "categoryId": "cat-8",
    "level": 110,
    "name": "Investigating Rekenber",
    "exp": 1200000,
    "subgroup": "EP 17.1",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-19",
    "categoryId": "cat-8",
    "level": 110,
    "name": "Old Memories",
    "exp": 900000,
    "subgroup": "EP 17.1",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-20",
    "categoryId": "cat-8",
    "level": 110,
    "name": "Helping the Workers",
    "exp": 300000,
    "subgroup": "EP 17.1",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-21",
    "categoryId": "cat-8",
    "level": 110,
    "name": "Capturing Eliumina",
    "exp": 125912,
    "subgroup": "EP 17.1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-22",
    "categoryId": "cat-8",
    "level": 110,
    "name": "Sidequest: OS Search",
    "exp": 1200000,
    "subgroup": "EP 17.1",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-23",
    "categoryId": "cat-8",
    "level": 110,
    "name": "Sidequest: Finding Patrick",
    "exp": 900000,
    "subgroup": "EP 17.1",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-8-24",
    "categoryId": "cat-8",
    "level": 110,
    "name": "Sidequest: Helping Farm (1st time)",
    "exp": 251824,
    "subgroup": "EP 17.1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-25",
    "categoryId": "cat-8",
    "level": 130,
    "name": "Meet Tamarin",
    "exp": 721935,
    "subgroup": "EP 17.2",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-26",
    "categoryId": "cat-8",
    "level": 130,
    "name": "Repeater Check",
    "exp": 3094008,
    "subgroup": "EP 17.2",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-27",
    "categoryId": "cat-8",
    "level": 130,
    "name": "Joining with The Party",
    "exp": 3094008,
    "subgroup": "EP 17.2",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-28",
    "categoryId": "cat-8",
    "level": 130,
    "name": "The Story of a Manager",
    "exp": 515668,
    "subgroup": "EP 17.2",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-29",
    "categoryId": "cat-8",
    "level": 130,
    "name": "Operation Pest Control",
    "exp": 1031336,
    "subgroup": "EP 17.2",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-30",
    "categoryId": "cat-8",
    "level": 130,
    "name": "Garden at Dusk",
    "exp": 1547004,
    "subgroup": "EP 17.2",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-31",
    "categoryId": "cat-8",
    "level": 130,
    "name": "Sidequest: Library",
    "exp": 1031336,
    "subgroup": "EP 17.2",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-32",
    "categoryId": "cat-8",
    "level": 130,
    "name": "Sidequest: Bathhouse",
    "exp": 1031336,
    "subgroup": "EP 17.2",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-33",
    "categoryId": "cat-8",
    "level": 130,
    "name": "Sidequest: Hidden Flower Garden",
    "exp": 3094009,
    "subgroup": "EP 17.2",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-34",
    "categoryId": "cat-8",
    "level": 130,
    "name": "Sidequest: Floating Garden",
    "exp": 515668,
    "subgroup": "EP 17.2",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-35",
    "categoryId": "cat-8",
    "level": 130,
    "name": "Sidequest: Pitaya Farm",
    "exp": 3094009,
    "subgroup": "EP 17.2",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-36",
    "categoryId": "cat-8",
    "level": 160,
    "name": "Sidequest: Tartaros Storage",
    "exp": 3156050,
    "subgroup": "EP 17.2",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-37",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Meet Ellie",
    "exp": 34223265,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-38",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Suspicious Movement",
    "exp": 34223265,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-39",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Entering Gray Wolf Village",
    "exp": 91262042,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-40",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Source of Weapons",
    "exp": 68446531,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-41",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Thor Military Base Instance",
    "exp": 68446531,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-42",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Rebellion",
    "exp": 45631020,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-43",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Wolf's Den Instance",
    "exp": 68446531,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-44",
    "categoryId": "cat-8",
    "level": 170,
    "name": "High Priest Villa Instance",
    "exp": 45631021,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-45",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Sidequest: Imril",
    "exp": 18252408,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-46",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Sidequest: Aruin",
    "exp": 18252408,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-47",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Sidequest: Budan",
    "exp": 18252408,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-48",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Sidequest: Albert",
    "exp": 18252408,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-49",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Sidequest: Aheer",
    "exp": 18252408,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-50",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Sidequest: Goodra",
    "exp": 18252408,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-51",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Sidequest: Zlane",
    "exp": 18252408,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-52",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Sidequest: Ezekiel",
    "exp": 18252408,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-53",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Sidequest: Scania",
    "exp": 18252408,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-54",
    "categoryId": "cat-8",
    "level": 170,
    "name": "Sidequest: Hazar",
    "exp": 22815510,
    "subgroup": "EP 18",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-55",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #1",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-56",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #2",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-57",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #3",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-58",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #4",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-59",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #5",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-60",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #6",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-61",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #7",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-62",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #8",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-63",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #9",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-64",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #10",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-65",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #11",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-66",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #12",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-67",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #13",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-68",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #14",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-69",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #15",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-8-70",
    "categoryId": "cat-8",
    "level": 230,
    "name": "Main Quest #16",
    "exp": 0,
    "subgroup": "Project Lumina EP 1",
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-9-0",
    "categoryId": "cat-9",
    "level": 100,
    "name": "Random Items",
    "exp": 200000,
    "subgroup": "Royal Banquet",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-9-1",
    "categoryId": "cat-9",
    "level": 100,
    "name": "15x Sea Stone 1x Witherless Rose",
    "exp": 200000,
    "subgroup": "Royal Banquet",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-9-2",
    "categoryId": "cat-9",
    "level": 140,
    "name": "50x Certain Monster Race",
    "exp": 500000,
    "subgroup": "Royal Banquet",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-9-3",
    "categoryId": "cat-9",
    "level": 100,
    "name": "1x Bijou",
    "exp": 400000,
    "subgroup": "Room of Consciousness",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-9-4",
    "categoryId": "cat-9",
    "level": 140,
    "name": "Random Task",
    "exp": 800000,
    "subgroup": "Invaded Prontera",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-9-5",
    "categoryId": "cat-9",
    "level": 140,
    "name": "20x Red Eye",
    "exp": 700000,
    "subgroup": "Protera Prison",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-9-6",
    "categoryId": "cat-9",
    "level": 140,
    "name": "20x Sandpaper",
    "exp": 700000,
    "subgroup": "Protera Prison",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-9-7",
    "categoryId": "cat-9",
    "level": 140,
    "name": "20x Dehumidifier",
    "exp": 700000,
    "subgroup": "Protera Prison",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-9-8",
    "categoryId": "cat-9",
    "level": 140,
    "name": "??x Flower",
    "exp": 700000,
    "subgroup": "Protera Prison",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-9-9",
    "categoryId": "cat-9",
    "level": 140,
    "name": "1x Bright Light",
    "exp": 700000,
    "subgroup": "Protera Prison",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-9-10",
    "categoryId": "cat-9",
    "level": 140,
    "name": "1x Prisoner Letter",
    "exp": 700000,
    "subgroup": "Protera Prison",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-9-11",
    "categoryId": "cat-9",
    "level": 140,
    "name": "Finish Cleaning",
    "exp": 700000,
    "subgroup": "Protera Prison",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-10-0",
    "categoryId": "cat-10",
    "level": 100,
    "name": "Finish Promoting Arms Shop",
    "exp": 100000,
    "subgroup": "Rebellion Base",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-10-1",
    "categoryId": "cat-10",
    "level": 100,
    "name": "Random Ores 1",
    "exp": 200000,
    "subgroup": "Rebellion Base",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-10-2",
    "categoryId": "cat-10",
    "level": 100,
    "name": "3x Slick Paper",
    "exp": 200000,
    "subgroup": "Rebellion Base",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-10-3",
    "categoryId": "cat-10",
    "level": 100,
    "name": "1x Elena Bolkova",
    "exp": 200000,
    "subgroup": "Rebellion Base",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-10-4",
    "categoryId": "cat-10",
    "level": 100,
    "name": "Random Ores 2",
    "exp": 200000,
    "subgroup": "Rebellion Base",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-10-5",
    "categoryId": "cat-10",
    "level": 100,
    "name": "5x Broken Gun Wreck",
    "exp": 200000,
    "subgroup": "Rebellion Base",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-10-6",
    "categoryId": "cat-10",
    "level": 100,
    "name": "Random Tea",
    "exp": 200000,
    "subgroup": "Rebellion Base",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-10-7",
    "categoryId": "cat-10",
    "level": 100,
    "name": "Finish Retuning Cat",
    "exp": 100000,
    "subgroup": "Rebellion Base",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-10-8",
    "categoryId": "cat-10",
    "level": 100,
    "name": "Random Task",
    "exp": 200000,
    "subgroup": "Rebellion Base",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-10-9",
    "categoryId": "cat-10",
    "level": 100,
    "name": "10x Humanoid Chimera 10x Material Chimera",
    "exp": 300000,
    "subgroup": "Heart Hunter War Base",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-10-10",
    "categoryId": "cat-10",
    "level": 100,
    "name": "Finish Finding Researchers",
    "exp": 200000,
    "subgroup": "Heart Hunter War Base",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-10-11",
    "categoryId": "cat-10",
    "level": 100,
    "name": "1x Cutie",
    "exp": 200000,
    "subgroup": "Heart Hunter War Base",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-11-0",
    "categoryId": "cat-11",
    "level": 110,
    "name": "10x Random Items",
    "exp": 300000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-11-1",
    "categoryId": "cat-11",
    "level": 110,
    "name": "15x Heart Hunter Bellare 15x Heart Hunter Sanare",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-11-2",
    "categoryId": "cat-11",
    "level": 110,
    "name": "20x Dolor 10x Identification Bracelet",
    "exp": 200000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-11-3",
    "categoryId": "cat-11",
    "level": 110,
    "name": "Finish Helping Farm",
    "exp": 75547,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-11-4",
    "categoryId": "cat-11",
    "level": 110,
    "name": "Finish Cor Memorial",
    "exp": 610000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-11-5",
    "categoryId": "cat-11",
    "level": 110,
    "name": "Finish 2nd OS Search (CP 14 Miguel)",
    "exp": 392000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-12-0",
    "categoryId": "cat-12",
    "level": 130,
    "name": "10x Robot Communication Chip",
    "exp": 949720,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-12-1",
    "categoryId": "cat-12",
    "level": 130,
    "name": "20x Guardian Parts",
    "exp": 500000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-12-2",
    "categoryId": "cat-12",
    "level": 130,
    "name": "20x Bookworm",
    "exp": 910040,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-12-3",
    "categoryId": "cat-12",
    "level": 130,
    "name": "20x Roaming Spellbook",
    "exp": 934000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-12-4",
    "categoryId": "cat-12",
    "level": 130,
    "name": "20x Broken Cleaner 5x Broken Robot Part",
    "exp": 695812,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-12-5",
    "categoryId": "cat-12",
    "level": 130,
    "name": "15x Boiling Water Marc 15x Boiling Water Piranha",
    "exp": 722940,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-12-6",
    "categoryId": "cat-12",
    "level": 150,
    "name": "20x Pitaya",
    "exp": 1800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-12-7",
    "categoryId": "cat-12",
    "level": 130,
    "name": "1x Sweetie",
    "exp": 206267,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-12-8",
    "categoryId": "cat-12",
    "level": 130,
    "name": "10x Broken Robot Core",
    "exp": 206267,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-12-9",
    "categoryId": "cat-12",
    "level": 130,
    "name": "1x Silva Papilia / Gran Silva Papilia",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-12-10",
    "categoryId": "cat-12",
    "level": 130,
    "name": "1x Gardener's Cookie",
    "exp": 800000,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-12-11",
    "categoryId": "cat-12",
    "level": 130,
    "name": "44x Sewage Waterfall 44x Sewage Cramp 44x Sewage Venenum",
    "exp": 5065368,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-12-12",
    "categoryId": "cat-12",
    "level": 130,
    "name": "44x Unleashed Plasma 44x Elite Bellare 44x Mana Addicted Dolor",
    "exp": 5197368,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-12-13",
    "categoryId": "cat-12",
    "level": 160,
    "name": "20x Heart Hunter Skirmisher",
    "exp": 4431108,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-12-14",
    "categoryId": "cat-12",
    "level": 170,
    "name": "20x Broken Warehouse Manager",
    "exp": 5974540,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-12-15",
    "categoryId": "cat-12",
    "level": 180,
    "name": "10x Potato Chip",
    "exp": 11560465,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-13-0",
    "categoryId": "cat-13",
    "level": 170,
    "name": "Imril: 20x Ash Toad",
    "exp": 4364880,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-13-1",
    "categoryId": "cat-13",
    "level": 200,
    "name": "Imril: 20x Hot Molar",
    "exp": 11588320,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-13-2",
    "categoryId": "cat-13",
    "level": 170,
    "name": "Aruin: 5x Trapped Bird / Trapped Lizard / Trapped Pear",
    "exp": 18252408,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-13-3",
    "categoryId": "cat-13",
    "level": 170,
    "name": "Budan: 1x Purified Water",
    "exp": 18252408,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-13-4",
    "categoryId": "cat-13",
    "level": 170,
    "name": "Aheer: 30x Firewind Kite",
    "exp": 10318080,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-13-5",
    "categoryId": "cat-13",
    "level": 170,
    "name": "Goodra: 1x Recording Note",
    "exp": 18252408,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-13-6",
    "categoryId": "cat-13",
    "level": 170,
    "name": "Ezekiel: 1x Steel, 10x Very Unusual Crystal",
    "exp": 18252408,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-13-7",
    "categoryId": "cat-13",
    "level": 170,
    "name": "Scania: 20x Ashring",
    "exp": 7769124,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-13-8",
    "categoryId": "cat-13",
    "level": 170,
    "name": "30x Monsters in gw_fild01",
    "exp": 9956480,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-0",
    "categoryId": "cat-14",
    "level": 100,
    "name": "1x Wizard of Truth",
    "exp": 300000,
    "subgroup": "Illusion of Moonlight",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-1",
    "categoryId": "cat-14",
    "level": 100,
    "name": "20x Angry Nine Tail",
    "exp": 300000,
    "subgroup": "Illusion of Moonlight",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-2",
    "categoryId": "cat-14",
    "level": 100,
    "name": "20x Resentful Soldier",
    "exp": 300000,
    "subgroup": "Illusion of Moonlight",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-3",
    "categoryId": "cat-14",
    "level": 100,
    "name": "100x Monsters",
    "exp": 2500000,
    "subgroup": "Illusion of Moonlight",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-4",
    "categoryId": "cat-14",
    "level": 120,
    "name": "10x Dry Twig 10x Random monsters",
    "exp": 1200000,
    "subgroup": "Illusion of Frozen",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-5",
    "categoryId": "cat-14",
    "level": 120,
    "name": "100x Monsters",
    "exp": 6000000,
    "subgroup": "Illusion of Frozen",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-6",
    "categoryId": "cat-14",
    "level": 130,
    "name": "10x Restless Zombie 10x Illusion Zombie 10x Illusion Ghoul",
    "exp": 500000,
    "subgroup": "Illusion of Vampire",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-7",
    "categoryId": "cat-14",
    "level": 130,
    "name": "20x Wavy Mane 10x Illusion Nightmare",
    "exp": 500000,
    "subgroup": "Illusion of Vampire",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-8",
    "categoryId": "cat-14",
    "level": 130,
    "name": "10x Sticky Blood 10x Mushroom Sap 5x Illusion Drainliar 5x Black Mushroom",
    "exp": 500000,
    "subgroup": "Illusion of Vampire",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-9",
    "categoryId": "cat-14",
    "level": 130,
    "name": "20x Short Bat Hair 10x Illusion Drainliar",
    "exp": 500000,
    "subgroup": "Illusion of Vampire",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-10",
    "categoryId": "cat-14",
    "level": 130,
    "name": "10x Shining Spore 10x Cluster of Nightmares",
    "exp": 500000,
    "subgroup": "Illusion of Vampire",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-11",
    "categoryId": "cat-14",
    "level": 130,
    "name": "10x Dried Yggdrasil Leaf 10x Suspicious Pentacle 5x Restless Zombie 5x Illusion Zombie",
    "exp": 500000,
    "subgroup": "Illusion of Vampire",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-12",
    "categoryId": "cat-14",
    "level": 130,
    "name": "100x Monsters",
    "exp": 10000000,
    "subgroup": "Illusion of Vampire",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-13",
    "categoryId": "cat-14",
    "level": 150,
    "name": "Finish Talking NPCs",
    "exp": 1200000,
    "subgroup": "Illusion of Abyss",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-14",
    "categoryId": "cat-14",
    "level": 150,
    "name": "5x Old Metal Pieces 10x Ominous Assaulter",
    "exp": 1200000,
    "subgroup": "Illusion of Abyss",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-15",
    "categoryId": "cat-14",
    "level": 150,
    "name": "10x Rotten Meat 10x Ominous Permeter 10x Ominous Solider 10x Ominous Freezer 10x Ominous Heater",
    "exp": 1200000,
    "subgroup": "Illusion of Abyss",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-16",
    "categoryId": "cat-14",
    "level": 150,
    "name": "100x Monsters",
    "exp": 22500000,
    "subgroup": "Illusion of Abyss",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-17",
    "categoryId": "cat-14",
    "level": 150,
    "name": "10x Hardworking Pitman 10x Soul Fragment 10x Sinister Dwelling Obsidian",
    "exp": 1000000,
    "subgroup": "Illusion of Teddy Bear",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-18",
    "categoryId": "cat-14",
    "level": 150,
    "name": "10x Red Teddy Bear 10x Yellow Teddy Bear 10x Green Teddy Bear 10x Blue Teddy Bear 10x White Teddy",
    "exp": 1300000,
    "subgroup": "Illusion of Teddy Bear",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-19",
    "categoryId": "cat-14",
    "level": 150,
    "name": "1x Shining Teddy Bear",
    "exp": 1500000,
    "subgroup": "Illusion of Teddy Bear",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-20",
    "categoryId": "cat-14",
    "level": 150,
    "name": "100x Monsters",
    "exp": 17500000,
    "subgroup": "Illusion of Teddy Bear",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-21",
    "categoryId": "cat-14",
    "level": 160,
    "name": "3x Megalithic Token",
    "exp": 4300000,
    "subgroup": "Illusion of Luanda",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-22",
    "categoryId": "cat-14",
    "level": 160,
    "name": "3x Wootan's Token",
    "exp": 4300000,
    "subgroup": "Illusion of Luanda",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-23",
    "categoryId": "cat-14",
    "level": 160,
    "name": "5x Ancient Tri Joint 5x Ancient Stalactic Golem 5x Ancient Megalith",
    "exp": 4300000,
    "subgroup": "Illusion of Luanda",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-24",
    "categoryId": "cat-14",
    "level": 160,
    "name": "5x Ancient Stone Shooter 5x Ancient Wootan Shooter 5x Ancient Wootan Fighter",
    "exp": 4300000,
    "subgroup": "Illusion of Luanda",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-25",
    "categoryId": "cat-14",
    "level": 160,
    "name": "100x Monsters",
    "exp": 29000000,
    "subgroup": "Illusion of Luanda",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-26",
    "categoryId": "cat-14",
    "level": 170,
    "name": "5x Chaotic Baphoment Jr.",
    "exp": 1750000,
    "subgroup": "Illusion of Labyrinth",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-27",
    "categoryId": "cat-14",
    "level": 170,
    "name": "2x Chaotic Ghostring",
    "exp": 1750000,
    "subgroup": "Illusion of Labyrinth",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-28",
    "categoryId": "cat-14",
    "level": 170,
    "name": "5x Chaotic Hunter Fly",
    "exp": 1750000,
    "subgroup": "Illusion of Labyrinth",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-29",
    "categoryId": "cat-14",
    "level": 170,
    "name": "5x Chaotic Killer Mantis",
    "exp": 1750000,
    "subgroup": "Illusion of Labyrinth",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-30",
    "categoryId": "cat-14",
    "level": 170,
    "name": "5x Chaotic Mantis",
    "exp": 1750000,
    "subgroup": "Illusion of Labyrinth",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-31",
    "categoryId": "cat-14",
    "level": 170,
    "name": "5x Chaotic Poporing",
    "exp": 1750000,
    "subgroup": "Illusion of Labyrinth",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-32",
    "categoryId": "cat-14",
    "level": 170,
    "name": "100x Monsters",
    "exp": 35000000,
    "subgroup": "Illusion of Labyrinth",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-33",
    "categoryId": "cat-14",
    "level": 140,
    "name": "10x Abyssal Essence",
    "exp": 4441860,
    "subgroup": "Illusion of Under Water",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-34",
    "categoryId": "cat-14",
    "level": 140,
    "name": "10x Abysmal Sropho 10x Abysmal Deviace 10x Abysmal Marse",
    "exp": 4441860,
    "subgroup": "Illusion of Under Water",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-35",
    "categoryId": "cat-14",
    "level": 180,
    "name": "15x Abysmal Sedora 15x Abysmal Strouf",
    "exp": 20107500,
    "subgroup": "Illusion of Under Water",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-36",
    "categoryId": "cat-14",
    "level": 180,
    "name": "10x Abysmal Swordfish 10x Abysmal Phen 10x Abysmal Dramoh",
    "exp": 20107500,
    "subgroup": "Illusion of Under Water",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-37",
    "categoryId": "cat-14",
    "level": 180,
    "name": "100x Monsters",
    "exp": 65000000,
    "subgroup": "Illusion of Under Water",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-38",
    "categoryId": "cat-14",
    "level": 160,
    "name": "20x Fine Dry Sand",
    "exp": 2446980,
    "subgroup": "Illusion of Twins",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-39",
    "categoryId": "cat-14",
    "level": 160,
    "name": "20x Opaque Liquid",
    "exp": 2423850,
    "subgroup": "Illusion of Twins",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-40",
    "categoryId": "cat-14",
    "level": 160,
    "name": "10x Diligent Soldier Andre 10x Diligent Piere 10x Diligent Vitata",
    "exp": 4987680,
    "subgroup": "Illusion of Twins",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-41",
    "categoryId": "cat-14",
    "level": 160,
    "name": "20x Shell of Cognition",
    "exp": 2395320,
    "subgroup": "Illusion of Twins",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-14-42",
    "categoryId": "cat-14",
    "level": 160,
    "name": "100x Monsters",
    "exp": 27000000,
    "subgroup": "Illusion of Twins",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-0",
    "categoryId": "cat-15",
    "level": 175,
    "name": "15x Rigid Sky Deleter 15x Rigid Earth Deleter",
    "exp": 4852278,
    "subgroup": "Nogg Road 3F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-1",
    "categoryId": "cat-15",
    "level": 175,
    "name": "10x Rigid Nightmare Terror",
    "exp": 1661868,
    "subgroup": "Nogg Road 3F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-2",
    "categoryId": "cat-15",
    "level": 175,
    "name": "10x Rigid Lava Golem",
    "exp": 1590396,
    "subgroup": "Nogg Road 3F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-3",
    "categoryId": "cat-15",
    "level": 175,
    "name": "10x Rigid Explosion 10x Rigid Blazer",
    "exp": 3251388,
    "subgroup": "Nogg Road 3F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-4",
    "categoryId": "cat-15",
    "level": 175,
    "name": "20x Corrupted Raydric 20x Corrupted Raydric Archer",
    "exp": 8142552,
    "subgroup": "Abyss Glast Heim",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-5",
    "categoryId": "cat-15",
    "level": 175,
    "name": "5x Frozen Gargoyle 5x Prison Breaker",
    "exp": 2036754,
    "subgroup": "Abyss Glast Heim",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-6",
    "categoryId": "cat-15",
    "level": 175,
    "name": "10x Ice Ghost 10x Flame Ghost",
    "exp": 4138800,
    "subgroup": "Abyss Glast Heim",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-7",
    "categoryId": "cat-15",
    "level": 180,
    "name": "20x Poisonous 20x Toxious",
    "exp": 27512240,
    "subgroup": "Mine Dungeon 3F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-8",
    "categoryId": "cat-15",
    "level": 180,
    "name": "20x Green Mineral 20x Red Mineral",
    "exp": 27836640,
    "subgroup": "Mine Dungeon 3F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-9",
    "categoryId": "cat-15",
    "level": 180,
    "name": "20x White Mineral 20x Purple Mineral",
    "exp": 27838400,
    "subgroup": "Mine Dungeon 3F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-10",
    "categoryId": "cat-15",
    "level": 180,
    "name": "10x Abyssman",
    "exp": 6938800,
    "subgroup": "Mine Dungeon 3F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-11",
    "categoryId": "cat-15",
    "level": 180,
    "name": "10x White Porcellio 10x Jeweliant",
    "exp": 13854240,
    "subgroup": "Mine Dungeon 3F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-12",
    "categoryId": "cat-15",
    "level": 180,
    "name": "30x Angelgolt (Blue) 40x Angelgolt (Pink)",
    "exp": 50190280,
    "subgroup": "Ancient Odin Shirine",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-13",
    "categoryId": "cat-15",
    "level": 180,
    "name": "30x Holy Frus 30x Holy Skogul",
    "exp": 44210160,
    "subgroup": "Ancient Odin Shirine",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-14",
    "categoryId": "cat-15",
    "level": 190,
    "name": "20x Purple Ferus",
    "exp": 15823920,
    "subgroup": "Abyss Lake Underground Cave 4F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-15",
    "categoryId": "cat-15",
    "level": 190,
    "name": "10x Treasure Mimic",
    "exp": 7979360,
    "subgroup": "Abyss Lake Underground Cave 4F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-16",
    "categoryId": "cat-15",
    "level": 190,
    "name": "20x Black Acidus 20x Silver Acidus",
    "exp": 32090640,
    "subgroup": "Abyss Lake Underground Cave 4F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-17",
    "categoryId": "cat-15",
    "level": 190,
    "name": "30x Bone Ferus 30x Bone Acidus",
    "exp": 48548160,
    "subgroup": "Abyss Lake Underground Cave 4F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-18",
    "categoryId": "cat-15",
    "level": 180,
    "name": "20x Crow Duke 20x Crow Baron",
    "exp": 31151220,
    "subgroup": "Thanatos Tower 9F-12F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-19",
    "categoryId": "cat-15",
    "level": 180,
    "name": "10x Piece of Memory Purple",
    "exp": 15575610,
    "subgroup": "Thanatos Tower 9F-12F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-20",
    "categoryId": "cat-15",
    "level": 180,
    "name": "15x Void Mimic 15x Book of Death 15x Eldest",
    "exp": 34770420,
    "subgroup": "Thanatos Tower 9F-12F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-21",
    "categoryId": "cat-15",
    "level": 180,
    "name": "10x Piece of Memory Red",
    "exp": 17385210,
    "subgroup": "Thanatos Tower 9F-12F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-22",
    "categoryId": "cat-15",
    "level": 180,
    "name": "15x Empathizer 15x Happiness Giver 15x Pray Giver 15x Smile Giver",
    "exp": 45811170,
    "subgroup": "Thanatos Tower 9F-12F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-23",
    "categoryId": "cat-15",
    "level": 180,
    "name": "10x Piece of Memory Blue",
    "exp": 22905585,
    "subgroup": "Thanatos Tower 9F-12F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-24",
    "categoryId": "cat-15",
    "level": 180,
    "name": "10x Anger of Thanatos 10x Horror of Thanatos 10x Regret of Thanatos 10x Resentment of Thanatos",
    "exp": 30736590,
    "subgroup": "Thanatos Tower 9F-12F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-15-25",
    "categoryId": "cat-15",
    "level": 180,
    "name": "10x Piece of Memory Green",
    "exp": 15368295,
    "subgroup": "Thanatos Tower 9F-12F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-0",
    "categoryId": "cat-16",
    "level": 200,
    "name": "10x Dolorian 10x Plagarion 10x Deadre",
    "exp": 15915940,
    "subgroup": "Rudus 4F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-1",
    "categoryId": "cat-16",
    "level": 200,
    "name": "15x Giant Caput 15x Venedi",
    "exp": 15176970,
    "subgroup": "Rudus 4F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-2",
    "categoryId": "cat-16",
    "level": 200,
    "name": "Finish Talking NPC",
    "exp": 15000000,
    "subgroup": "Rudus 4F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-3",
    "categoryId": "cat-16",
    "level": 200,
    "name": "15x Ghost Quve 15x Lude Gal",
    "exp": 15642570,
    "subgroup": "Nifflheim Dungeon 1F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-4",
    "categoryId": "cat-16",
    "level": 200,
    "name": "10x Brutal Murderer 10x Gan Ceann",
    "exp": 15642570,
    "subgroup": "Nifflheim Dungeon 1F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-5",
    "categoryId": "cat-16",
    "level": 200,
    "name": "Finish Talking NPC",
    "exp": 10000000,
    "subgroup": "Nifflheim Dungeon 1F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-6",
    "categoryId": "cat-16",
    "level": 215,
    "name": "15x Amitera 15x Fillia",
    "exp": 17726670,
    "subgroup": "Abandoned Lab Amicitia 1F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-7",
    "categoryId": "cat-16",
    "level": 215,
    "name": "15x Litus 15x Vanilaqus",
    "exp": 17724090,
    "subgroup": "Abandoned Lab Amicitia 1F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-8",
    "categoryId": "cat-16",
    "level": 215,
    "name": "Finish Talking NPC",
    "exp": 17000000,
    "subgroup": "Abandoned Lab Amicitia 1F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-9",
    "categoryId": "cat-16",
    "level": 230,
    "name": "15x Napeo 15x Galensis",
    "exp": 18970590,
    "subgroup": "Abandoned Lab Amicitia 2F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-10",
    "categoryId": "cat-16",
    "level": 230,
    "name": "15x Lava Eater 15x Fulgor",
    "exp": 18980190,
    "subgroup": "Abandoned Lab Amicitia 2F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-11",
    "categoryId": "cat-16",
    "level": 240,
    "name": "15x Disguiser 15x Blue Moon Loli Ruri",
    "exp": 20272230,
    "subgroup": "Nifflheim Dungeon 2F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-12",
    "categoryId": "cat-16",
    "level": 240,
    "name": "10x Grote 10x Pierrotzoist",
    "exp": 13721460,
    "subgroup": "Nifflheim Dungeon 2F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-13",
    "categoryId": "cat-16",
    "level": 240,
    "name": "Finish Talking NPC",
    "exp": 13000000,
    "subgroup": "Nifflheim Dungeon 2F",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-14",
    "categoryId": "cat-16",
    "level": 240,
    "name": "Daily Choice: 100x Monsters",
    "exp": 38409074,
    "subgroup": "Clock Tower Unknown Basement",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-15",
    "categoryId": "cat-16",
    "level": 240,
    "name": "Daily Choice: 300x Monsters",
    "exp": 136177626,
    "subgroup": "Clock Tower Unknown Basement",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-16",
    "categoryId": "cat-16",
    "level": 240,
    "name": "Daily Choice: 1000x Monsters",
    "exp": 698346800,
    "subgroup": "Clock Tower Unknown Basement",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-17",
    "categoryId": "cat-16",
    "level": 240,
    "name": "Finish Talking NPC",
    "exp": 1745867,
    "subgroup": "Clock Tower Unknown Basement",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-18",
    "categoryId": "cat-16",
    "level": 240,
    "name": "Weekly: 5000x Monsters",
    "exp": 2182333750,
    "subgroup": "Clock Tower Unknown Basement",
    "isWeekly": true,
    "isFixedExp": false
  },
  {
    "id": "q-16-19",
    "categoryId": "cat-16",
    "level": 250,
    "name": "Daily Choice: 100x Monsters",
    "exp": 242000000,
    "subgroup": "Mjolnir Underground Caverns",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-20",
    "categoryId": "cat-16",
    "level": 250,
    "name": "Daily Choice: 500x Monsters",
    "exp": 1214000000,
    "subgroup": "Mjolnir Underground Caverns",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-21",
    "categoryId": "cat-16",
    "level": 250,
    "name": "Weekly: 5000x Monsters",
    "exp": 12140000000,
    "subgroup": "Mjolnir Underground Caverns",
    "isWeekly": true,
    "isFixedExp": false
  },
  {
    "id": "q-16-22",
    "categoryId": "cat-16",
    "level": 250,
    "name": "Daily Choice: 100x Monsters",
    "exp": 243000000,
    "subgroup": "Power Twisted Plains",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-23",
    "categoryId": "cat-16",
    "level": 250,
    "name": "Daily Choice: 500x Monsters",
    "exp": 1218000000,
    "subgroup": "Power Twisted Plains",
    "isWeekly": false,
    "isFixedExp": false
  },
  {
    "id": "q-16-24",
    "categoryId": "cat-16",
    "level": 250,
    "name": "Weekly: 5000x Monsters",
    "exp": 12180000000,
    "subgroup": "Power Twisted Plains",
    "isWeekly": true,
    "isFixedExp": false
  },
  {
    "id": "q-17-0",
    "categoryId": "cat-17",
    "level": 230,
    "name": "Gray Wolf Forest: 125x Monsters",
    "exp": 0,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-17-1",
    "categoryId": "cat-17",
    "level": 230,
    "name": "Abandoned Lab Amicitia 2F: 130x Monsters",
    "exp": 0,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": true
  },
  {
    "id": "q-17-2",
    "categoryId": "cat-17",
    "level": 230,
    "name": "Abandoned Pit 2F: 140x Monsters",
    "exp": 0,
    "subgroup": null,
    "isWeekly": false,
    "isFixedExp": true
  }
] as const satisfies readonly ExpQuest[];

export const FOURTH_CLASS_BASE_EXP = [
  {
    "level": 201,
    "expToReach": 653047446
  },
  {
    "level": 202,
    "expToReach": 655006588
  },
  {
    "level": 203,
    "expToReach": 656971607
  },
  {
    "level": 204,
    "expToReach": 658942521
  },
  {
    "level": 205,
    "expToReach": 660919348
  },
  {
    "level": 206,
    "expToReach": 662902106
  },
  {
    "level": 207,
    "expToReach": 664890812
  },
  {
    "level": 208,
    "expToReach": 666885484
  },
  {
    "level": 209,
    "expToReach": 668886140
  },
  {
    "level": 210,
    "expToReach": 670892798
  },
  {
    "level": 211,
    "expToReach": 672905476
  },
  {
    "level": 212,
    "expToReach": 674924192
  },
  {
    "level": 213,
    "expToReach": 676948964
  },
  {
    "level": 214,
    "expToReach": 678979810
  },
  {
    "level": 215,
    "expToReach": 681016749
  },
  {
    "level": 216,
    "expToReach": 683059799
  },
  {
    "level": 217,
    "expToReach": 685108978
  },
  {
    "level": 218,
    "expToReach": 687164304
  },
  {
    "level": 219,
    "expToReach": 689225796
  },
  {
    "level": 220,
    "expToReach": 691293473
  },
  {
    "level": 221,
    "expToReach": 788074559
  },
  {
    "level": 222,
    "expToReach": 898404997
  },
  {
    "level": 223,
    "expToReach": 1024181696
  },
  {
    "level": 224,
    "expToReach": 1167567133
  },
  {
    "level": 225,
    "expToReach": 1331026531
  },
  {
    "level": 226,
    "expToReach": 1517370245
  },
  {
    "level": 227,
    "expToReach": 1729802079
  },
  {
    "level": 228,
    "expToReach": 1971974370
  },
  {
    "level": 229,
    "expToReach": 2248050781
  },
  {
    "level": 230,
    "expToReach": 2562777890
  },
  {
    "level": 231,
    "expToReach": 2921566794
  },
  {
    "level": 232,
    "expToReach": 3330586145
  },
  {
    "level": 233,
    "expToReach": 3796868205
  },
  {
    "level": 234,
    "expToReach": 4328429753
  },
  {
    "level": 235,
    "expToReach": 4934409918
  },
  {
    "level": 236,
    "expToReach": 5625227306
  },
  {
    "level": 237,
    "expToReach": 6412759128
  },
  {
    "level": 238,
    "expToReach": 7310545405
  },
  {
    "level": 239,
    "expToReach": 8334021761
  },
  {
    "level": 240,
    "expToReach": 9500784807
  },
  {
    "level": 241,
    "expToReach": 10830894679
  },
  {
    "level": 242,
    "expToReach": 12347219934
  },
  {
    "level": 243,
    "expToReach": 14075830724
  },
  {
    "level": 244,
    "expToReach": 16046447025
  },
  {
    "level": 245,
    "expToReach": 18292949608
  },
  {
    "level": 246,
    "expToReach": 20853962553
  },
  {
    "level": 247,
    "expToReach": 23773517310
  },
  {
    "level": 248,
    "expToReach": 27101809733
  },
  {
    "level": 249,
    "expToReach": 30896063095
  },
  {
    "level": 250,
    "expToReach": 35221511928
  },
  {
    "level": 251,
    "expToReach": 51
  },
  {
    "level": 252,
    "expToReach": 52
  },
  {
    "level": 253,
    "expToReach": 53
  },
  {
    "level": 254,
    "expToReach": 54
  },
  {
    "level": 255,
    "expToReach": 55
  },
  {
    "level": 256,
    "expToReach": 119605407689
  },
  {
    "level": 257,
    "expToReach": 146636229826
  },
  {
    "level": 258,
    "expToReach": 179776017766
  },
  {
    "level": 259,
    "expToReach": 220405397781
  },
  {
    "level": 260,
    "expToReach": 270217017679
  }
] as const satisfies readonly BaseExpRow[];

export const FOURTH_CLASS_JOB_EXP = [
  {
    "level": 1,
    "expToNext": 4000000
  },
  {
    "level": 2,
    "expToNext": 4700000
  },
  {
    "level": 3,
    "expToNext": 5522500
  },
  {
    "level": 4,
    "expToNext": 6488938
  },
  {
    "level": 5,
    "expToNext": 7624502
  },
  {
    "level": 6,
    "expToNext": 8958789
  },
  {
    "level": 7,
    "expToNext": 10526577
  },
  {
    "level": 8,
    "expToNext": 12368729
  },
  {
    "level": 9,
    "expToNext": 14533256
  },
  {
    "level": 10,
    "expToNext": 17076576
  },
  {
    "level": 11,
    "expToNext": 20064977
  },
  {
    "level": 12,
    "expToNext": 23576347
  },
  {
    "level": 13,
    "expToNext": 27702208
  },
  {
    "level": 14,
    "expToNext": 32550095
  },
  {
    "level": 15,
    "expToNext": 38246361
  },
  {
    "level": 16,
    "expToNext": 44939475
  },
  {
    "level": 17,
    "expToNext": 52803883
  },
  {
    "level": 18,
    "expToNext": 62044562
  },
  {
    "level": 19,
    "expToNext": 72902360
  },
  {
    "level": 20,
    "expToNext": 85660274
  },
  {
    "level": 21,
    "expToNext": 100650821
  },
  {
    "level": 22,
    "expToNext": 118264715
  },
  {
    "level": 23,
    "expToNext": 138961040
  },
  {
    "level": 24,
    "expToNext": 163279222
  },
  {
    "level": 25,
    "expToNext": 191853086
  },
  {
    "level": 26,
    "expToNext": 216793987
  },
  {
    "level": 27,
    "expToNext": 244977206
  },
  {
    "level": 28,
    "expToNext": 276824243
  },
  {
    "level": 29,
    "expToNext": 312811394
  },
  {
    "level": 30,
    "expToNext": 353476875
  },
  {
    "level": 31,
    "expToNext": 399428869
  },
  {
    "level": 32,
    "expToNext": 451354622
  },
  {
    "level": 33,
    "expToNext": 510030723
  },
  {
    "level": 34,
    "expToNext": 576334717
  },
  {
    "level": 35,
    "expToNext": 651258230
  },
  {
    "level": 36,
    "expToNext": 735921800
  },
  {
    "level": 37,
    "expToNext": 831591634
  },
  {
    "level": 38,
    "expToNext": 939698547
  },
  {
    "level": 39,
    "expToNext": 1061859358
  },
  {
    "level": 40,
    "expToNext": 1199901074
  },
  {
    "level": 41,
    "expToNext": 1355888214
  },
  {
    "level": 42,
    "expToNext": 1532153682
  },
  {
    "level": 43,
    "expToNext": 1731333660
  },
  {
    "level": 44,
    "expToNext": 1956407036
  },
  {
    "level": 45,
    "expToNext": 2210739951
  },
  {
    "level": 46,
    "expToNext": 2498136145
  },
  {
    "level": 47,
    "expToNext": 2822893843
  },
  {
    "level": 48,
    "expToNext": 3189870043
  },
  {
    "level": 49,
    "expToNext": 3604553149
  },
  {
    "level": 50,
    "expToNext": 4073145058
  }
] as const satisfies readonly JobExpRow[];
