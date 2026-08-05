export type DailyDungeonDiamond = "pure" | "black" | "golden";

export type DailyDungeonReward = {
  item: string;
  quantity: string;
  refine?: string;
};

export type DailyDungeonAntiquity = {
  name: string;
  rewards: DailyDungeonReward[];
};

export type DailyDungeonEntry = {
  id: string;
  name: string;
  minimumLevel: number;
  cooldownDays: 1 | 3;
  diamond: DailyDungeonDiamond;
  antiquities: DailyDungeonAntiquity[];
};

export const DAILY_DUNGEON_SOURCE = {
  label: "Ragnarok Online Thailand — Antiquity System",
  updatedAt: "5 สิงหาคม 2026",
  url: "https://ro.gnjoy.in.th/antiquity-system/",
} as const;

export const DAILY_DUNGEON_DIAMONDS: Record<
  DailyDungeonDiamond,
  { label: string; sellPrice: number }
> = {
  pure: { label: "Pure Diamond", sellPrice: 100_000 },
  black: { label: "Black Diamond", sellPrice: 200_000 },
  golden: { label: "Golden Diamond", sellPrice: 300_000 },
};

export const DAILY_DUNGEONS: DailyDungeonEntry[] = [
  {
    id: "cor-mission",
    name: "Cor Mission",
    minimumLevel: 110,
    cooldownDays: 1,
    diamond: "pure",
    antiquities: [
      {
        name: "Antiquity of Cor (EL-A17T)",
        rewards: [
          { item: "OS weapons", quantity: "1", refine: "9~11" },
          { item: "Broken Weapon", quantity: "3~5" },
          { item: "Unknown Part", quantity: "11~20" },
          { item: "Cor Core", quantity: "11~20" },
          { item: "Pure Diamond", quantity: "3~5" },
        ],
      },
    ],
  },
  {
    id: "os-search-mission",
    name: "OS Search Mission",
    minimumLevel: 110,
    cooldownDays: 1,
    diamond: "pure",
    antiquities: [
      {
        name: "Antiquity of Cor (Miguel)",
        rewards: [
          { item: "Illusion Equipment", quantity: "1", refine: "9~11" },
          { item: "Illusion Accessory", quantity: "1" },
          { item: "Unknown Part", quantity: "16~20" },
          { item: "Cor Core", quantity: "11~20" },
          { item: "Pure Diamond", quantity: "3~5" },
        ],
      },
    ],
  },
  {
    id: "fall-of-glastheim",
    name: "Fall of Glastheim",
    minimumLevel: 130,
    cooldownDays: 1,
    diamond: "pure",
    antiquities: [
      {
        name: "Antiquity of Glast Heim (Curse-swallowed King)",
        rewards: [
          { item: "King Schmidt’s Equipment", quantity: "1", refine: "7~9" },
          { item: "Temporal [Stat] Boots", quantity: "1", refine: "7~11" },
          { item: "Curse Eroded Crystal", quantity: "16~25" },
          { item: "Pure Diamond", quantity: "3~5" },
        ],
      },
    ],
  },
  {
    id: "fall-of-glastheim-hard",
    name: "Fall of Glastheim (Hard)",
    minimumLevel: 130,
    cooldownDays: 1,
    diamond: "pure",
    antiquities: [
      {
        name: "Antiquity of Glast Heim (Curse-swallowed King (Hard))",
        rewards: [
          { item: "King Schmidt’s Accessory", quantity: "1" },
          { item: "King Schmidt’s Equipment", quantity: "1", refine: "9~11" },
          { item: "Temporal [Stat] Boots [1]", quantity: "1", refine: "9~11" },
          { item: "Curse Eroded Gemstone", quantity: "16~25" },
          { item: "Pure Diamond", quantity: "4~7" },
        ],
      },
    ],
  },
  {
    id: "hey-sweety",
    name: "Hey! Sweety!",
    minimumLevel: 130,
    cooldownDays: 1,
    diamond: "pure",
    antiquities: [
      {
        name: "Antiquity of Mansion (Sweety)",
        rewards: [
          { item: "EP17 Lust Weapon", quantity: "1", refine: "7~11" },
          { item: "Barmeal Ticket", quantity: "11~20" },
          { item: "Magical Soapstone", quantity: "1~5" },
          { item: "Pure Diamond", quantity: "3~5" },
        ],
      },
    ],
  },
  {
    id: "farm-forgotten-in-time",
    name: "Farm Forgotten in Time",
    minimumLevel: 130,
    cooldownDays: 1,
    diamond: "pure",
    antiquities: [
      {
        name: "Antiquity of Mansion (Meow)",
        rewards: [
          { item: "EP17 Automatic Equipment", quantity: "1", refine: "7~9" },
          { item: "EP17 Automatic Accessory", quantity: "1" },
          { item: "Barmeal Ticket", quantity: "11~20" },
          { item: "Magical Soapstone", quantity: "1~5" },
          { item: "Pure Diamond", quantity: "3~5" },
        ],
      },
    ],
  },
  {
    id: "hidden-flower-garden-security-area-1",
    name: "Hidden Flower Garden (Security Area 1)",
    minimumLevel: 130,
    cooldownDays: 1,
    diamond: "pure",
    antiquities: [
      {
        name: "Antiquity of Mansion (Red Pepper (Kappa))",
        rewards: [
          { item: "EP17 Automatic Equipment", quantity: "1", refine: "7~11" },
          { item: "EP17 Automatic Accessory", quantity: "1" },
          { item: "EP17 Lust Weapon", quantity: "1", refine: "7~11" },
          { item: "Barmeal Ticket", quantity: "21~25" },
          { item: "Magical Soapstone", quantity: "3~7" },
          { item: "Pure Diamond", quantity: "4~7" },
        ],
      },
    ],
  },
  {
    id: "hidden-flower-garden-security-area-2",
    name: "Hidden Flower Garden (Security Area 2)",
    minimumLevel: 130,
    cooldownDays: 1,
    diamond: "black",
    antiquities: [
      {
        name: "Antiquity of Mansion (Red Pepper (Lambda))",
        rewards: [
          { item: "EP17 Automatic Equipment", quantity: "1", refine: "9~11" },
          { item: "EP17 Automatic Accessory", quantity: "1" },
          { item: "EP17 Lust Weapon", quantity: "1", refine: "9~11" },
          { item: "Barmeal Ticket", quantity: "31~35" },
          { item: "Magical Soapstone", quantity: "3~7" },
          { item: "Black Diamond", quantity: "3~7" },
        ],
      },
    ],
  },
  {
    id: "horror-toy-factory",
    name: "Horror Toy Factory",
    minimumLevel: 140,
    cooldownDays: 1,
    diamond: "pure",
    antiquities: [
      {
        name: "Antiquity of Toy Factory (Celine Kimi)",
        rewards: [
          { item: "Celine’s Ribbon", quantity: "1", refine: "7~11" },
          { item: "Bloody Coin", quantity: "31~45" },
          { item: "Toy Factory Accessory", quantity: "1" },
          { item: "Pure Diamond", quantity: "3~5" },
        ],
      },
    ],
  },
  {
    id: "old-glast-heim",
    name: "Old Glast Heim",
    minimumLevel: 130,
    cooldownDays: 1,
    diamond: "pure",
    antiquities: [
      {
        name: "Antiquity of Glast Heim (Amdarais)",
        rewards: [
          {
            item: "Temporal&Modified [Stat] Boots [1]",
            quantity: "1",
            refine: "7~9",
          },
          { item: "Coagulated Spell", quantity: "10~25" },
          { item: "Temporal Crystal", quantity: "15~30" },
          { item: "Pure Diamond", quantity: "3~5" },
        ],
      },
    ],
  },
  {
    id: "advanced-old-glast-heim",
    name: "Advanced Old Glast Heim",
    minimumLevel: 160,
    cooldownDays: 3,
    diamond: "pure",
    antiquities: [
      {
        name: "Antiquity of Glast Heim (Realized Amdarais)",
        rewards: [
          {
            item: "Temporal&Modified [Stat] Boots [1]",
            quantity: "1",
            refine: "9~11",
          },
          { item: "Contaminated Magic", quantity: "11~15" },
          { item: "Coagulated Spell", quantity: "30~45" },
          { item: "Temporal Crystal", quantity: "20~35" },
          { item: "Pure Diamond", quantity: "4~7" },
        ],
      },
    ],
  },
  {
    id: "old-glast-heim-challenge-mode",
    name: "Old Glast Heim Challenge Mode",
    minimumLevel: 170,
    cooldownDays: 3,
    diamond: "pure",
    antiquities: [
      {
        name: "Antiquity of Glast Heim (Phantom of Amdarais)",
        rewards: [
          { item: "Royal Weapon", quantity: "1", refine: "9~11" },
          { item: "Temporal Fragment", quantity: "11~15" },
          { item: "Temporal Gemstone", quantity: "6~10" },
          { item: "Temporal Spell", quantity: "11~15" },
          { item: "Pure Diamond", quantity: "4~8" },
        ],
      },
      {
        name: "Antiquity of Glast Heim (Phantom of Himmelmez)",
        rewards: [
          { item: "Royal Weapon", quantity: "1", refine: "9~11" },
          { item: "Temporal Fragment", quantity: "16~20" },
          { item: "Temporal Gemstone", quantity: "11~15" },
          { item: "Temporal Spell", quantity: "16~20" },
          { item: "Pure Diamond", quantity: "8~12" },
        ],
      },
    ],
  },
  {
    id: "villa-of-deception",
    name: "Villa of Deception",
    minimumLevel: 170,
    cooldownDays: 1,
    diamond: "pure",
    antiquities: [
      {
        name: "Antiquity of Villa (Twisted God)",
        rewards: [
          { item: "EP18 Vivatus Fides Weapon", quantity: "1", refine: "7~12" },
          { item: "EP18 Adulter Fides Weapon", quantity: "1", refine: "7~12" },
          { item: "EP18 Gray Wolf Equipment", quantity: "1", refine: "9~11" },
          { item: "EP18 Gray Wolf Accessory", quantity: "1" },
          { item: "Amethyst Fragment", quantity: "36~53" },
          { item: "Pure Diamond", quantity: "8~12" },
        ],
      },
    ],
  },
  {
    id: "bioresearch-laboratory",
    name: "Bioresearch Laboratory",
    minimumLevel: 170,
    cooldownDays: 1,
    diamond: "pure",
    antiquities: [
      {
        name: "Antiquity of Somatology Dungeon (Unknown Swordsman)",
        rewards: [
          { item: "EDDDA Biolab Weapon", quantity: "1", refine: "9~11" },
          { item: "Somatology Research Document", quantity: "36~40" },
          { item: "Somatology Experimental Fragment", quantity: "36~40" },
          { item: "Pure Diamond", quantity: "3~7" },
        ],
      },
    ],
  },
  {
    id: "memories-of-thanatos",
    name: "Memories of Thanatos",
    minimumLevel: 180,
    cooldownDays: 1,
    diamond: "black",
    antiquities: [
      {
        name: "Antiquity of Thanatos Tower (Memory of Thanatos)",
        rewards: [
          { item: "Sinful&Brilliant Light Accessory", quantity: "1" },
          { item: "Fragment of Fate", quantity: "10~17" },
          { item: "Fragment of Sin", quantity: "10~17" },
          { item: "Black Diamond", quantity: "4~8" },
        ],
      },
    ],
  },
  {
    id: "airship-crash",
    name: "Airship Crash",
    minimumLevel: 200,
    cooldownDays: 3,
    diamond: "golden",
    antiquities: [
      {
        name: "Antiquity of Crash Site (Unidentified Creature)",
        rewards: [
          { item: "Unknown [Stat] Boots", quantity: "1", refine: "9~13" },
          { item: "Contaminated Card Book", quantity: "1~3" },
          { item: "Ymir Fragment", quantity: "41~50" },
          { item: "Golden Diamond", quantity: "5~8" },
        ],
      },
    ],
  },
  {
    id: "airship-destruction",
    name: "Airship Destruction",
    minimumLevel: 200,
    cooldownDays: 1,
    diamond: "black",
    antiquities: [
      {
        name: "Antiquity of Issgard (Aquila)",
        rewards: [
          { item: "EP19 Snow Flower Equipment", quantity: "1", refine: "7~11" },
          { item: "EP19 Snow Flower Accessory", quantity: "1" },
          { item: "Encroached Magical Ore", quantity: "3~7" },
          { item: "Neutralized Magical Ore", quantity: "3~7" },
          { item: "Encroached Magical Crystal", quantity: "3~7" },
          { item: "Neutralized Magical Crystal", quantity: "3~7" },
          { item: "Snow Flower Magic Stone Extract", quantity: "6~10" },
          { item: "Shining Snow Flower Magic Stone Extract", quantity: "5~7" },
          { item: "Brilliant Snow Flower Magic Stone Extract", quantity: "4~5" },
          { item: "Glacier Extract", quantity: "6~10" },
          { item: "Snow Flower Petal", quantity: "16~20" },
          { item: "Black Diamond", quantity: "4~8" },
        ],
      },
    ],
  },
  {
    id: "airship-destruction-first-class",
    name: "Airship Destruction (First Class)",
    minimumLevel: 200,
    cooldownDays: 1,
    diamond: "black",
    antiquities: [
      {
        name: "Antiquity of Issgard (Aquila (First Class))",
        rewards: [
          { item: "EP19 Snow Flower Equipment", quantity: "1", refine: "9~11" },
          { item: "EP19 Snow Flower Accessory", quantity: "1" },
          { item: "EP19 Glacier Weapon", quantity: "1", refine: "9~11" },
          { item: "EP19 Dim Glacier Weapon", quantity: "1", refine: "9~11" },
          { item: "Snow Flower Magic Ore", quantity: "26~30" },
          { item: "Snow Flower Magic Stone", quantity: "11~15" },
          { item: "Shining Snow Flower Magic Stone", quantity: "8~10" },
          { item: "Brilliant Snow Flower Magic Stone", quantity: "6~7" },
          { item: "Encroached Magical Ore", quantity: "7~10" },
          { item: "Neutralized Magical Ore", quantity: "7~10" },
          { item: "Encroached Magical Crystal", quantity: "7~10" },
          { item: "Neutralized Magical Crystal", quantity: "7~10" },
          { item: "Miasmal Spell", quantity: "3~6" },
          { item: "Snow Flower Magic Stone Extract", quantity: "11~15" },
          { item: "Shining Snow Flower Magic Stone Extract", quantity: "8~10" },
          { item: "Brilliant Snow Flower Magic Stone Extract", quantity: "6~7" },
          { item: "Glacier Extract", quantity: "11~15" },
          { item: "Snow Flower Petal", quantity: "21~25" },
          { item: "Black Diamond", quantity: "7~10" },
        ],
      },
    ],
  },
  {
    id: "simulation-battle",
    name: "Simulation Battle",
    minimumLevel: 200,
    cooldownDays: 1,
    diamond: "black",
    antiquities: [
      {
        name: "Antiquity of Issgard (Juncea)",
        rewards: [
          { item: "EP19 Glacier Weapon", quantity: "1", refine: "7~11" },
          { item: "Snow Flower Magic Ore", quantity: "16~20" },
          { item: "Snow Flower Magic Stone", quantity: "6~10" },
          { item: "Shining Snow Flower Magic Stone", quantity: "5~7" },
          { item: "Brilliant Snow Flower Magic Stone", quantity: "4~5" },
          { item: "Snow Flower Petal", quantity: "16~20" },
          { item: "Black Diamond", quantity: "6~10" },
        ],
      },
    ],
  },
  {
    id: "immortal",
    name: "Immortal",
    minimumLevel: 215,
    cooldownDays: 1,
    diamond: "golden",
    antiquities: [
      {
        name: "Antiquity of Issgard (Ultimate Lasgand)",
        rewards: [
          { item: "EP20 Dim Glacier Armor", quantity: "1", refine: "9~11" },
          { item: "EP20 Glacier Armor", quantity: "1", refine: "7~10" },
          { item: "EP20 Glacier Accessory", quantity: "1" },
          { item: "Snow Flower Magic Stone Extract", quantity: "8~12" },
          { item: "Shining Snow Flower Magic Stone Extract", quantity: "5~7" },
          { item: "Brilliant Snow Flower Magic Stone Extract", quantity: "5~6" },
          { item: "Glacier Extract", quantity: "8~12" },
          { item: "Pure Magical Ore", quantity: "5~7" },
          { item: "Pure Magical Crystal", quantity: "5~7" },
          { item: "Pure Magical Extract", quantity: "5~7" },
          { item: "Sacred Cat Whiskers", quantity: "21~25" },
          { item: "Golden Diamond", quantity: "4~7" },
        ],
      },
    ],
  },
  {
    id: "immortal-hard",
    name: "Immortal (Hard)",
    minimumLevel: 215,
    cooldownDays: 1,
    diamond: "golden",
    antiquities: [
      {
        name: "Antiquity of Issgard (Ultimate Lasgand (Hard))",
        rewards: [
          { item: "EP20 Dim Glacier Armor", quantity: "1", refine: "9~11" },
          { item: "EP20 Glacier Armor", quantity: "1", refine: "9~10" },
          { item: "EP20 Glacier Accessory", quantity: "1" },
          { item: "Snow Flower Magic Stone Extract", quantity: "11~15" },
          { item: "Shining Snow Flower Magic Stone Extract", quantity: "7~9" },
          { item: "Brilliant Snow Flower Magic Stone Extract", quantity: "8~9" },
          { item: "Glacier Extract", quantity: "11~15" },
          { item: "Pure Magical Ore", quantity: "7~10" },
          { item: "Pure Magical Crystal", quantity: "7~10" },
          { item: "Pure Magical Extract", quantity: "7~10" },
          { item: "Sacred Cat Whiskers", quantity: "31~35" },
          { item: "Golden Diamond", quantity: "7~11" },
        ],
      },
    ],
  },
  {
    id: "sticky-sea",
    name: "Sticky Sea",
    minimumLevel: 215,
    cooldownDays: 1,
    diamond: "golden",
    antiquities: [
      {
        name: "Antiquity of Issgard (Fallen Angel Slug)",
        rewards: [
          { item: "EP20 Glacier Armor", quantity: "1", refine: "7~9" },
          { item: "EP20 Glacier Accessory", quantity: "1" },
          { item: "Snow Flower Magic Stone Extract", quantity: "6~10" },
          { item: "Shining Snow Flower Magic Stone Extract", quantity: "5~7" },
          { item: "Brilliant Snow Flower Magic Stone Extract", quantity: "4~5" },
          { item: "Glacier Extract", quantity: "6~10" },
          { item: "Pure Magical Ore", quantity: "3~7" },
          { item: "Pure Magical Crystal", quantity: "3~7" },
          { item: "Pure Magical Extract", quantity: "3~7" },
          { item: "Sacred Cat Whiskers", quantity: "16~20" },
          { item: "Golden Diamond", quantity: "3~5" },
        ],
      },
    ],
  },
  {
    id: "tomb-of-remorse",
    name: "Tomb of Remorse",
    minimumLevel: 220,
    cooldownDays: 1,
    diamond: "golden",
    antiquities: [
      {
        name: "Antiquity of Remorse (Sakray)",
        rewards: [
          { item: "Poenitentia Aegis [1]", quantity: "1", refine: "7~11" },
          { item: "Poenitentia Weapon", quantity: "1", refine: "7~11" },
          { item: "Sakray’s Fury", quantity: "5~7" },
          { item: "Condensed Sakray’s Fury", quantity: "2~4" },
          { item: "Sakray’s Regret", quantity: "5~7" },
          { item: "Condensed Sakray’s Regret", quantity: "2~4" },
          { item: "Mineas", quantity: "41~55" },
          { item: "Golden Diamond", quantity: "5~8" },
        ],
      },
    ],
  },
];
