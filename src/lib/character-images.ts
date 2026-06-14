import type { StaticImageData } from "next/image";
import francesGazImage from "@/char/Screenshot_25690604095103.png";
import junoirExtremeImage from "@/char/Screenshot_25690604095121.png";
import archAngelpluzImage from "@/char/Screenshot_25690604095128.png";
import queen0FeriaImage from "@/char/Screenshot_25690604095133.png";
import izanoAlpImage from "@/char/Screenshot_25690604095139.png";
import reginaAlpImage from "@/char/Screenshot_25690604095146.png";
import candySellerAlpImage from "@/char/Screenshot_25690604095153.png";
import khrasedraAlpImage from "@/char/Screenshot_25690604095200.png";
import soulAlpImage from "@/char/Screenshot_25690604095206.png";
import power0FranzImage from "@/char/Screenshot_25690604095211.png";
import jessiGazAlpImage from "@/char/Screenshot_25690604095216.png";
import souffleExtremeImage from "@/char/Screenshot_25690604095221.png";
import chronosImage from "@/char/bishop/b1.jpg";
import molloreenaImage from "@/char/bishop/b2.jpg";
import kimreiImage from "@/char/bishop/b3.jpg";
import hazeleImage from "@/char/bishop/b4.jpg";
import andromecheImage from "@/char/bishop/b5.jpg";
import felisharImage from "@/char/bishop/b6.jpg";
import karellaImage from "@/char/bishop/b7.jpg";
import queenightImage from "@/char/bishop/b8.jpg";
import xenodiceImage from "@/char/bishop/b9.jpg";
import pinaayaImage from "@/char/bishop/b10.jpg";
import vanesfrancaImage from "@/char/bishop/b11.jpg";
import reefaImage from "@/char/dancer/d1.jpg";
import viornaImage from "@/char/dancer/d2.jpg";
import catharinaImage from "@/char/dancer/d3.jpg";
import achillaImage from "@/char/dancer/d4.jpg";
import drakImage from "@/char/dancer/d5.jpg";
import hideImage from "@/char/dancer/d6.jpg";
import rragImage from "@/char/dancer/d7.jpg";
import beeImage from "@/char/dancer/d8.jpg";

export const CHARACTER_IMAGES = {
  francesgaz: francesGazImage,
  junoirextreme: junoirExtremeImage,
  archangelpluz: archAngelpluzImage,
  queen0feria: queen0FeriaImage,
  izanoalp: izanoAlpImage,
  reginaalp: reginaAlpImage,
  candyselleralp: candySellerAlpImage,
  khrasedraalp: khrasedraAlpImage,
  soulalp: soulAlpImage,
  power0franz: power0FranzImage,
  jessigaalp: jessiGazAlpImage,
  soufflextreme: souffleExtremeImage,
  chronos: chronosImage,
  molloreena: molloreenaImage,
  kimrei: kimreiImage,
  hazele: hazeleImage,
  andromeche: andromecheImage,
  felishar: felisharImage,
  karella: karellaImage,
  queenight: queenightImage,
  xenodice: xenodiceImage,
  pinaaya: pinaayaImage,
  vanesfranca: vanesfrancaImage,
  reefa: reefaImage,
  viorna: viornaImage,
  catharina: catharinaImage,
  achilla: achillaImage,
  drak: drakImage,
  hide: hideImage,
  rrag: rragImage,
  bee: beeImage,
} satisfies Record<string, StaticImageData>;

const CHARACTER_IMAGE_ALIASES: Record<string, StaticImageData> = {
  ...CHARACTER_IMAGES,
  jessigazalp: jessiGazAlpImage,
  queenofferia: queen0FeriaImage,
  poweroffranz: power0FranzImage,
  souffleextreme: souffleExtremeImage,
  pdrakid08: drakImage,
};

function normalizeCharacterKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function getCharacterImage(id: string, name?: string): StaticImageData | undefined {
  return CHARACTER_IMAGE_ALIASES[normalizeCharacterKey(id)] ??
    (name ? CHARACTER_IMAGE_ALIASES[normalizeCharacterKey(name)] : undefined);
}
