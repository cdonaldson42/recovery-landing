export type ThemeAnimal = {
  emoji: string;
  lottieSrc: string;
  name: string;
};

export type DailyTheme = {
  name: string;
  icon: string;
  animals: ThemeAnimal[];
};

// Indexed 0-6 to match Date.getDay() (Sunday=0)
const DAILY_THEMES: DailyTheme[] = [
  // Sunday
  {
    name: "Super Bugs Sunday",
    icon: "🐛",
    animals: [
      { emoji: "🐛", lottieSrc: "", name: "bug" },
      { emoji: "🦋", lottieSrc: "https://assets-v2.lottiefiles.com/a/f053792a-1167-11ee-a92e-2f39a52fa547/YlEkQ4Kx1s.lottie", name: "butterfly" },
      { emoji: "🐝", lottieSrc: "https://assets-v2.lottiefiles.com/a/c3127838-116e-11ee-b34d-df0fc24e3fe0/c66Dsb6FuU.lottie", name: "bee" },
      { emoji: "🐞", lottieSrc: "", name: "ladybug" },
      { emoji: "🪲", lottieSrc: "", name: "beetle" },
      { emoji: "🦗", lottieSrc: "", name: "cricket" },
      { emoji: "🪳", lottieSrc: "", name: "cockroach" },
      { emoji: "🕷️", lottieSrc: "https://assets-v2.lottiefiles.com/a/74dafd2c-117b-11ee-97ba-a3eccb038a7e/ulDLRndrPW.lottie", name: "spider" },
      { emoji: "🐜", lottieSrc: "", name: "ant" },
      { emoji: "🦟", lottieSrc: "", name: "mosquito" },
      { emoji: "🪰", lottieSrc: "", name: "fly" },
      { emoji: "🐌", lottieSrc: "", name: "snail" },
    ],
  },
  // Monday
  {
    name: "Mammal Monday",
    icon: "🐾",
    animals: [
      { emoji: "🐅", lottieSrc: "https://assets-v2.lottiefiles.com/a/c5b460ac-5920-11ee-8880-83ff594da76f/QNN98Uj58M.lottie", name: "tiger" },
      { emoji: "🦁", lottieSrc: "https://assets-v2.lottiefiles.com/a/644a7580-4d4a-11ef-8f96-734a89143e7f/kthfPH4TGe.lottie", name: "lion" },
      { emoji: "🐺", lottieSrc: "https://assets-v2.lottiefiles.com/a/060020b6-1177-11ee-ac10-9f66834627cf/NsmJj62ZXt.lottie", name: "wolf" },
      { emoji: "🐻", lottieSrc: "https://assets-v2.lottiefiles.com/a/7b36d6ac-3cb7-11ee-a573-175a0b884d98/FADcWTAHo4.lottie", name: "bear" },
      { emoji: "🦊", lottieSrc: "https://assets-v2.lottiefiles.com/a/13151f44-2685-11ef-8bdd-27b94968ce47/mxFtNdCNCq.lottie", name: "fox" },
      { emoji: "🐘", lottieSrc: "https://assets-v2.lottiefiles.com/a/b9f05e30-1161-11ee-90f6-070dd4e3175c/JNutNHy99i.lottie", name: "elephant" },
      { emoji: "🦒", lottieSrc: "https://assets-v2.lottiefiles.com/a/900982ae-1175-11ee-938e-4b28af8bbf2b/vfMkuXxRdr.lottie", name: "giraffe" },
      { emoji: "🐆", lottieSrc: "", name: "leopard" },
      { emoji: "🦬", lottieSrc: "", name: "bison" },
      { emoji: "🐂", lottieSrc: "", name: "ox" },
      { emoji: "🐪", lottieSrc: "", name: "camel" },
      { emoji: "🦏", lottieSrc: "", name: "rhino" },
    ],
  },
  // Tuesday
  {
    name: "Tropical Tuesday",
    icon: "🌴",
    animals: [
      { emoji: "🦜", lottieSrc: "https://assets-v2.lottiefiles.com/a/4e7bf598-116f-11ee-9989-c78b961b5bbe/IpSMbBxXiN.lottie", name: "parrot" },
      { emoji: "🐸", lottieSrc: "https://assets-v2.lottiefiles.com/a/9ece5b6e-117c-11ee-afe8-fbf03bf4c4c1/mHAF0yChfr.lottie", name: "frog" },
      { emoji: "🦎", lottieSrc: "", name: "lizard" },
      { emoji: "🦩", lottieSrc: "", name: "flamingo" },
      { emoji: "🐊", lottieSrc: "", name: "crocodile" },
      { emoji: "🦋", lottieSrc: "https://assets-v2.lottiefiles.com/a/f053792a-1167-11ee-a92e-2f39a52fa547/YlEkQ4Kx1s.lottie", name: "butterfly" },
      { emoji: "🐒", lottieSrc: "https://assets-v2.lottiefiles.com/a/a89581e8-1174-11ee-9e12-27a4a81543cd/DRfccGVTo0.lottie", name: "monkey" },
      { emoji: "🦥", lottieSrc: "", name: "sloth" },
      { emoji: "🐍", lottieSrc: "https://assets-v2.lottiefiles.com/a/fd5e87b4-1189-11ee-9745-e700d1385b38/0eoj4EiJfW.lottie", name: "snake" },
      { emoji: "🦚", lottieSrc: "", name: "peacock" },
      { emoji: "🦘", lottieSrc: "", name: "kangaroo" },
      { emoji: "🐠", lottieSrc: "https://assets-v2.lottiefiles.com/a/b9eb1632-1161-11ee-90f0-7b0d5d2f8751/n9msocxqRd.lottie", name: "tropical fish" },
    ],
  },
  // Wednesday
  {
    name: "Wings Wednesday",
    icon: "🦅",
    animals: [
      { emoji: "🦅", lottieSrc: "", name: "eagle" },
      { emoji: "🦉", lottieSrc: "https://assets-v2.lottiefiles.com/a/e05f5c98-116a-11ee-adaa-1bd34c90ef2c/kc4tcqEFuZ.lottie", name: "owl" },
      { emoji: "🐦", lottieSrc: "https://assets-v2.lottiefiles.com/a/2347f63e-1169-11ee-aff4-efa209c5de2b/JlYuz7AJIb.lottie", name: "bird" },
      { emoji: "🦆", lottieSrc: "https://assets-v2.lottiefiles.com/a/82ea6eea-1151-11ee-9856-6b98bba9984d/7oIMbI4tMe.lottie", name: "duck" },
      { emoji: "🦢", lottieSrc: "", name: "swan" },
      { emoji: "🦇", lottieSrc: "https://assets-v2.lottiefiles.com/a/a25153d2-116c-11ee-9041-4fd921181688/TYQkmEt4gd.lottie", name: "bat" },
      { emoji: "🕊️", lottieSrc: "", name: "dove" },
      { emoji: "🐓", lottieSrc: "", name: "rooster" },
      { emoji: "🦤", lottieSrc: "", name: "dodo" },
      { emoji: "🪿", lottieSrc: "", name: "goose" },
      { emoji: "🦚", lottieSrc: "", name: "peacock" },
      { emoji: "🦜", lottieSrc: "https://assets-v2.lottiefiles.com/a/4e7bf598-116f-11ee-9989-c78b961b5bbe/IpSMbBxXiN.lottie", name: "parrot" },
    ],
  },
  // Thursday
  {
    name: "Throwback Thursday",
    icon: "🦕",
    animals: [
      { emoji: "🦕", lottieSrc: "", name: "sauropod" },
      { emoji: "🦖", lottieSrc: "", name: "t-rex" },
      { emoji: "🐉", lottieSrc: "https://assets-v2.lottiefiles.com/a/278c3470-2bd7-11ee-83a4-770efad183f2/avtnWfHDGF.lottie", name: "dragon" },
      { emoji: "🦂", lottieSrc: "", name: "scorpion" },
      { emoji: "🕷️", lottieSrc: "https://assets-v2.lottiefiles.com/a/74dafd2c-117b-11ee-97ba-a3eccb038a7e/ulDLRndrPW.lottie", name: "spider" },
      { emoji: "🦀", lottieSrc: "", name: "crab" },
      { emoji: "🦞", lottieSrc: "", name: "lobster" },
      { emoji: "🐢", lottieSrc: "https://assets-v2.lottiefiles.com/a/86fa98bc-1169-11ee-a6f2-8fda000b8095/sGCxuEMJ6x.lottie", name: "turtle" },
      { emoji: "🐊", lottieSrc: "", name: "crocodile" },
      { emoji: "🦎", lottieSrc: "", name: "lizard" },
      { emoji: "🐍", lottieSrc: "https://assets-v2.lottiefiles.com/a/fd5e87b4-1189-11ee-9745-e700d1385b38/0eoj4EiJfW.lottie", name: "snake" },
      { emoji: "🪲", lottieSrc: "", name: "beetle" },
    ],
  },
  // Friday
  {
    name: "Furry Friends Friday",
    icon: "🐶",
    animals: [
      { emoji: "🐶", lottieSrc: "https://assets-v2.lottiefiles.com/a/925e0e08-1161-11ee-81d7-4f83d43ed222/IwCX4myqYC.lottie", name: "dog" },
      { emoji: "🐱", lottieSrc: "https://assets-v2.lottiefiles.com/a/e88e947e-117e-11ee-b32b-1f49352a17f5/h9q2N827xF.lottie", name: "cat" },
      { emoji: "🐹", lottieSrc: "", name: "hamster" },
      { emoji: "🐰", lottieSrc: "https://assets-v2.lottiefiles.com/a/935dfeb0-118b-11ee-9126-43e3de286e2f/2kAMlUkFxM.lottie", name: "rabbit" },
      { emoji: "🐿️", lottieSrc: "", name: "chipmunk" },
      { emoji: "🐼", lottieSrc: "https://assets-v2.lottiefiles.com/a/9bb82aee-e129-11ef-a89b-1762bf4fe4c5/4Mc9hH3KAr.lottie", name: "panda" },
      { emoji: "🐨", lottieSrc: "https://assets-v2.lottiefiles.com/a/ddeed294-117a-11ee-af4b-bb3b3bfda89b/VhozWb5G42.lottie", name: "koala" },
      { emoji: "🦫", lottieSrc: "", name: "beaver" },
      { emoji: "🦔", lottieSrc: "", name: "hedgehog" },
      { emoji: "🐾", lottieSrc: "", name: "paw prints" },
      { emoji: "🐇", lottieSrc: "https://assets-v2.lottiefiles.com/a/935dfeb0-118b-11ee-9126-43e3de286e2f/2kAMlUkFxM.lottie", name: "bunny" },
      { emoji: "🐈", lottieSrc: "https://assets-v2.lottiefiles.com/a/e88e947e-117e-11ee-b32b-1f49352a17f5/h9q2N827xF.lottie", name: "cat face" },
    ],
  },
  // Saturday
  {
    name: "Sea Safari Saturday",
    icon: "🌊",
    animals: [
      { emoji: "🦈", lottieSrc: "https://assets-v2.lottiefiles.com/a/1ea833d8-1177-11ee-91b7-1f9db0aff2e2/0G4kdL249h.lottie", name: "shark" },
      { emoji: "🐙", lottieSrc: "https://assets-v2.lottiefiles.com/a/1dc5c1f0-1182-11ee-9faa-e7af748d50e0/NFEEnoQFJZ.lottie", name: "octopus" },
      { emoji: "🐬", lottieSrc: "https://assets-v2.lottiefiles.com/a/b9ef8c12-1161-11ee-90f5-a3680064bf0c/QGpH29Ae2l.lottie", name: "dolphin" },
      { emoji: "🐳", lottieSrc: "https://assets-v2.lottiefiles.com/a/432126fa-1151-11ee-81d6-fbec6e0e68cb/yvKkYB9pgL.lottie", name: "whale" },
      { emoji: "🦭", lottieSrc: "", name: "seal" },
      { emoji: "🐟", lottieSrc: "https://assets-v2.lottiefiles.com/a/b9eb1632-1161-11ee-90f0-7b0d5d2f8751/n9msocxqRd.lottie", name: "fish" },
      { emoji: "🐡", lottieSrc: "https://assets-v2.lottiefiles.com/a/06718dd2-1177-11ee-ac73-7f32cbed8144/aVU1hAWaUw.lottie", name: "blowfish" },
      { emoji: "🦑", lottieSrc: "https://assets-v2.lottiefiles.com/a/0cf6d338-1186-11ee-a7f1-2b069c627364/yi4SAZoJdj.lottie", name: "squid" },
      { emoji: "🦐", lottieSrc: "", name: "shrimp" },
      { emoji: "🪸", lottieSrc: "", name: "coral" },
      { emoji: "🐚", lottieSrc: "", name: "shell" },
      { emoji: "🦀", lottieSrc: "", name: "crab" },
    ],
  },
];

export function getTodayTheme(): DailyTheme {
  return DAILY_THEMES[new Date().getDay()];
}

export function getRandomThemeAnimal(): ThemeAnimal {
  const { animals } = getTodayTheme();
  return animals[Math.floor(Math.random() * animals.length)];
}

export function getRandomThemeEmoji(): string {
  return getRandomThemeAnimal().emoji;
}
