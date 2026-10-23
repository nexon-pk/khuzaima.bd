/**
 * ====================================================================
 * MUHAMMAD KHUZAIMA'S 2ND BIRTHDAY — CONFIGURATION DATA
 * ====================================================================
 * A special birthday surprise from Uncle Ali Khawaja.
 */

const BIRTHDAY_CONFIG = {
  nephewName: "Muhammad Khuzaima",
  nickname: "Superstar",
  age: 2,
  ageText: "2nd",
  uncleName: "Ali Khawaja",

  // STAGE 1: COUNTDOWN & FIREWORKS
  stage1: {
    countdownNumbers: [3, 2, 1],
    countdownIntervalMs: 1000,
    introHeading: "IT'S YOUR SPECIAL DAY",
    nameHeading: "MUHAMMAD KHUZAIMA",
    badge: "Happy 2nd Birthday",
    nextButtonText: "Let's Celebrate",
  },

  // STAGE 2: BALLOONS NAME REVEAL
  stage2: {
    badge: "A Special Surprise",
    greetingLine1: "HAPPY BIRTHDAY",
    greetingLine2: "MUHAMMAD KHUZAIMA",
    nextButtonText: "Assemble Cake",
  },

  // STAGE 3: 3-TIER PHOTO CAKE ASSEMBLY
  stage3: {
    cakeTopper: "Khuzaima",
    caption: "LEVEL 2 UNLOCKED",
    nextButtonText: "Open Gifts",
    tiers: {
      bottom: {
        src: "./assets/images/cake-layer-1.jpg",
        title: "Khuzaima",
        objectPosition: "center 22%",
      },
      middle: {
        src: "./assets/images/cake-layer-2.jpg",
        title: "Age 2",
        objectPosition: "center 18%",
      },
      top: {
        src: "./assets/images/cake-layer-3.jpg",
        title: "Superstar",
        objectPosition: "center 18%",
      },
    },
  },

  // STAGE 4: BIRTHDAY GIFTS
  stage4: {
    gifts: [
      {
        id: "cheque",
        badge: "GIFT 1 OF 3",
        title: "£100,000,000 Birthday Cheque",
        disclaimer: "IMAGINARY BIRTHDAY GIFT",
        nextButtonText: "Next: iPhones",
        cheque: {
          image: "./assets/images/cheque-gift.jpg",
        },
      },
      {
        id: "iphones",
        badge: "GIFT 2 OF 3",
        title: "2 × iPhone 18 Pro Max",
        disclaimer: "IMAGINARY BIRTHDAY GIFT",
        image: "./assets/images/iphone-gift.png",
        nextButtonText: "Next: Range Rovers",
      },
      {
        id: "cars",
        badge: "GIFT 3 OF 3",
        title: "2 × RANGE ROVER",
        disclaimer: "IMAGINARY BIRTHDAY GIFT",
        image: "./assets/images/rangerover-gift.jpg",
        nextButtonText: "Personal Wishes",
      },
    ],
  },

  // STAGE 5: PERSONAL BIRTHDAY WISHES
  stage5: {
    badge: "FROM UNCLE ALI KHAWAJA",
    heading: "HAPPY 2ND BIRTHDAY",
    name: "MUHAMMAD KHUZAIMA",
    portrait: {
      src: "./assets/images/birthday-portrait.jpg",
      objectPosition: "center 18%",
    },
    message:
      "Happy 2nd birthday, my little superstar! May Allah bless you with happiness, health, endless smiles, and a beautiful life. Lots of love from your uncle, Ali Khawaja.",
    signOff: "LOTS OF LOVE, ALI KHAWAJA",
    replayButtonText: "Play Again",
  },

  // AUDIO SETTINGS
  audio: {
    bgMusicSrc: "./assets/audio/celebration.mp3",
    synthChimesFallback: true,
  },
};

if (typeof window !== "undefined") {
  window.BIRTHDAY_CONFIG = BIRTHDAY_CONFIG;
}
