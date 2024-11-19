import { ref } from "vue";

export interface Clue {
  id: string
  num: string
  direction: string
  assets: {
    img?: string
    audio?: string
    cipher?: string
    url?: {
      href: string
      text: string
    }
  }
  invert?: boolean
};

export const acrossClues = ref([
  {
    id: "1a",
    num: "1",
    direction: "across",
    assets: {
      img: "ROTORS.png",
      cipher: "ZIPGFPGDWVHNOJBYVHBSCLBEOQAYNSWUJAZONXFJWXJSTEKLZPBJCRVAEXFAVLHMTCHYTWE",
    },
    invert: true,
  },
  {
    id: "4a",
    num: "4",
    direction: "across",
    assets: {
      audio: "HERTZ.wav",
    },
  },
  {
    id: "7a",
    num: "7",
    direction: "across",
    assets: {
      audio: "NUTS.wav",
    },
  },
  {
    id: "9a",
    num: "9",
    direction: "across",
    assets: {
      img: "РУССКИЙ.png",
    },
    invert: true,
  },
  {
    id: "10a",
    num: "10",
    direction: "across",
    assets: {
      img: "ONE_DECIMAL_PLACE.png",
    },
  },
  {
    id: "11a",
    num: "11",
    direction: "across",
    assets: {
      img: "SPUR.png",
    },
    invert: true,
  },
]);

export const downClues = ref([
  {
    id: "1d",
    num: "1",
    direction: "down",
    assets: {
      audio: "SYMPHONY.mp3",
    },
  },
  {
    id: "2d",
    num: "2",
    direction: "down",
    assets: {
      audio: "IL_SIRACUSANO.wav",
    },
  },
  {
    id: "3d",
    num: "3",
    direction: "down",
    assets: {
      img: "TREVOR.png",
      cipher: "XUMVRKFRFENZLFMOAGHKSKGNPQXWY",
    },
  },
  {
    id: "5d",
    num: "5",
    direction: "down",
    assets: {
      img: "CRANN_AG_GOL.jpg",
    },
  },
  {
    id: "6d",
    num: "6",
    direction: "down",
    assets: {
      img: "3INTERSECTION.png",
      url: {
        href: "https://geo.javawa.nl/coordcalc/index_en.html",
        text: "OPZIONE SETTE",
      },
    },
    invert: true,
  },
  {
    id: "8d",
    num: "8",
    direction: "down",
    assets: {
      img: "ODDONEOUT.png",
    },
    invert: true,
  },
]);
