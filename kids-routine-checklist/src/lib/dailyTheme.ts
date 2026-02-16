export type DailyTheme = {
  name: string;
  icon: string;
  animals: string[];
};

// Indexed 0-6 to match Date.getDay() (Sunday=0)
const DAILY_THEMES: DailyTheme[] = [
  // Sunday
  {
    name: "Super Bugs Sunday",
    icon: "🐛",
    animals: ["🐛", "🦋", "🐝", "🐞", "🪲", "🦗", "🪳", "🕷️", "🐜", "🦟", "🪰", "🐌"],
  },
  // Monday
  {
    name: "Mammal Monday",
    icon: "🐾",
    animals: ["🐅", "🦁", "🐺", "🐻", "🦊", "🐘", "🦒", "🐆", "🦬", "🐂", "🐪", "🦏"],
  },
  // Tuesday
  {
    name: "Tropical Tuesday",
    icon: "🌴",
    animals: ["🦜", "🐸", "🦎", "🦩", "🐊", "🦋", "🐒", "🦥", "🐍", "🦚", "🦘", "🐠"],
  },
  // Wednesday
  {
    name: "Wings Wednesday",
    icon: "🦅",
    animals: ["🦅", "🦉", "🐦", "🦆", "🦢", "🦇", "🕊️", "🐓", "🦤", "🪿", "🦚", "🦜"],
  },
  // Thursday
  {
    name: "Throwback Thursday",
    icon: "🦕",
    animals: ["🦕", "🦖", "🐉", "🦂", "🕷️", "🦀", "🦞", "🐢", "🐊", "🦎", "🐍", "🪲"],
  },
  // Friday
  {
    name: "Furry Friends Friday",
    icon: "🐶",
    animals: ["🐶", "🐱", "🐹", "🐰", "🐿️", "🐼", "🐨", "🦫", "🦔", "🐾", "🐇", "🐈"],
  },
  // Saturday
  {
    name: "Sea Safari Saturday",
    icon: "🌊",
    animals: ["🦈", "🐙", "🐬", "🐳", "🦭", "🐟", "🐡", "🦑", "🦐", "🪸", "🐚", "🦀"],
  },
];

export function getTodayTheme(): DailyTheme {
  return DAILY_THEMES[new Date().getDay()];
}

export function getRandomThemeAnimal(): string {
  const { animals } = getTodayTheme();
  return animals[Math.floor(Math.random() * animals.length)];
}
