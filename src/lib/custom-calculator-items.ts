import type { RathenaCalculatorItem } from "./rathena-item-types";

export const CUSTOM_ITEM_OVERRIDES: Record<number, Partial<RathenaCalculatorItem>> = {
  27354: {
    aliases: ["Polluted Raydric Card"],
    name: "Corrupted Raydric Card",
  },
  27355: {
    aliases: ["Polluted Raydric Archer Card"],
    name: "Corrupted Raydric Archer Card",
  },
  27357: {
    aliases: ["Polluted Sting Card"],
    name: "Corrupted Sting Card",
  },
  27361: {
    aliases: ["Polluted Wanderer Card"],
    name: "Corrupted Wanderer Card",
  },
  27362: {
    aliases: ["Polluted Queen Spider Card"],
    name: "Corrupted Queen Spider Card",
  },
  27363: {
    aliases: ["Polluted Dark Lord Card"],
    name: "Corrupted Dark Lord Card",
  },
  300551: {
    aliases: ["A-Ji & Geffen Card"],
  },
};

export const CUSTOM_CALCULATOR_ITEMS: RathenaCalculatorItem[] = [
  {
    id: 300754,
    aegisName: "Upgrade_Memory_Of_Thanatos_Card",
    name: "Upgrade Memory of Thanatos Card",
    category: "card",
    itemType: "Card",
    slots: ["weapon"],
    scriptPreview: ["Custom server card imported from statuscal.html."],
  },
  {
    id: 300553,
    aegisName: "4th_Anniversary_Card",
    name: "4th Anniversary Card",
    category: "card",
    itemType: "Card",
    slots: ["accessory"],
    scriptPreview: ["Custom server card imported from statuscal.html."],
  },
];
