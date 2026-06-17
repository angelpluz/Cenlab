import type { StaticImageData } from "next/image";
import abysmalWitchImage from "@/cenlab/Abysmal Witch.png";
import amonRaNightmareImage from "@/cenlab/Amon Ra (Nightmare).png";
import awakenKtullanuxImage from "@/cenlab/Awaken Ktullanux.png";
import boneDetardeurusImage from "@/cenlab/Bone Detardeurus.png";
import burningFangImage from "@/cenlab/Burning Fang.png";
import corruptedSpiderQueenImage from "@/cenlab/Corrupted Spider Queen.png";
import deathWitchImage from "@/cenlab/Death Witch.png";
import fallenBishopImage from "@/cenlab/Fallen Bishop.png";
import gioiaImage from "@/cenlab/Gioia.png";
import jewgoliantImage from "@/cenlab/Jewgoliant.png";
import r001BestiaImage from "@/cenlab/R001-Bestia.png";
import shiningTeddyBearImage from "@/cenlab/Shining Teddy Bear.png";
import theOneImage from "@/cenlab/The One.png";
import timeholderImage from "@/cenlab/timeholder.png";
import ultraLimacinaImage from "@/cenlab/Ultra Limacina.png";
import valkyrieIngridImage from "@/cenlab/Valkyrie Ingrid.png";
import valkyrieReginleifImage from "@/cenlab/Valkyrie Reginleif.png";

export type CenLabBoss = {
  id: string;
  name: string;
  imageSrc: StaticImageData;
};

export const CENLAB_BOSSES: CenLabBoss[] = [
  { id: "abysmal-witch", name: "Abysmal Witch", imageSrc: abysmalWitchImage },
  { id: "amon-ra-nightmare", name: "Amon Ra (Nightmare)", imageSrc: amonRaNightmareImage },
  { id: "awaken-ktullanux", name: "Awaken Ktullanux", imageSrc: awakenKtullanuxImage },
  { id: "bone-detardeurus", name: "Bone Detardeurus", imageSrc: boneDetardeurusImage },
  { id: "burning-fang", name: "Burning Fang", imageSrc: burningFangImage },
  { id: "corrupted-spider-queen", name: "Corrupted Spider Queen", imageSrc: corruptedSpiderQueenImage },
  { id: "death-witch", name: "Death Witch", imageSrc: deathWitchImage },
  { id: "fallen-bishop", name: "Fallen Bishop", imageSrc: fallenBishopImage },
  { id: "gioia", name: "Gioia", imageSrc: gioiaImage },
  { id: "jewgoliant", name: "Jewgoliant", imageSrc: jewgoliantImage },
  { id: "r001-bestia", name: "R001-Bestia", imageSrc: r001BestiaImage },
  { id: "shining-teddy-bear", name: "Shining Teddy Bear", imageSrc: shiningTeddyBearImage },
  { id: "the-one", name: "The One", imageSrc: theOneImage },
  { id: "timeholder", name: "timeholder", imageSrc: timeholderImage },
  { id: "ultra-limacina", name: "Ultra Limacina", imageSrc: ultraLimacinaImage },
  { id: "valkyrie-ingrid", name: "Valkyrie Ingrid", imageSrc: valkyrieIngridImage },
  { id: "valkyrie-reginleif", name: "Valkyrie Reginleif", imageSrc: valkyrieReginleifImage },
];
