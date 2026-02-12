import type { AnimalId, ColorTheme } from "./types";

export const ANIMALS: Record<AnimalId, { emoji: string; label: string; celebrationAnimation: string }> = {
  tiger:      { emoji: "🐅", label: "Tiger",      celebrationAnimation: "animate-charge-across" },
  unicorn:    { emoji: "🦄", label: "Unicorn",    celebrationAnimation: "animate-fly-across" },
  hamster:    { emoji: "🐹", label: "Hamster",     celebrationAnimation: "animate-bounce-jump" },
  chameleon:  { emoji: "🦎", label: "Chameleon",   celebrationAnimation: "animate-cheer-spin" },
  dragon:     { emoji: "🐉", label: "Dragon",      celebrationAnimation: "animate-dragon-fire" },
  rhino:      { emoji: "🦏", label: "Rhino",       celebrationAnimation: "animate-charge-across" },
  eagle:      { emoji: "🦅", label: "Eagle",       celebrationAnimation: "animate-eagle-soar" },
  capybara:   { emoji: "🦫", label: "Capybara",    celebrationAnimation: "animate-chill-waddle" },
  panda:      { emoji: "🐼", label: "Panda",       celebrationAnimation: "animate-tumble-roll" },
  koala:      { emoji: "🐨", label: "Koala",       celebrationAnimation: "animate-climb-wave" },
  scorpion:   { emoji: "🦂", label: "Scorpion",    celebrationAnimation: "animate-scuttle-snap" },
  crocodile:  { emoji: "🐊", label: "Crocodile",   celebrationAnimation: "animate-jaw-charge" },
  spider:     { emoji: "🕷️", label: "Spider",      celebrationAnimation: "animate-cute-rappel" },
  crab:       { emoji: "🦀", label: "Crab",        celebrationAnimation: "animate-scuttle-snap" },
  shark:      { emoji: "🦈", label: "Shark",       celebrationAnimation: "animate-jaw-charge" },
  chipmunk:   { emoji: "🐿️", label: "Chipmunk",    celebrationAnimation: "animate-bounce-jump" },
  squirrel:   { emoji: "🐿️", label: "Squirrel",    celebrationAnimation: "animate-climb-wave" },
};

export const THEMES: Record<ColorTheme, { label: string; activeClasses: string; inactiveHoverColor: string }> = {
  blue: {
    label: "Blue",
    activeClasses: "bg-blue-100 dark:bg-[rgba(30,64,175,0.35)] text-blue-700 dark:text-blue-300 border-2 border-blue-400 dark:border-blue-500 shadow-sm",
    inactiveHoverColor: "hover:text-blue-500 dark:hover:text-blue-400",
  },
  green: {
    label: "Green",
    activeClasses: "bg-emerald-100 dark:bg-[rgba(6,95,70,0.35)] text-emerald-700 dark:text-emerald-300 border-2 border-emerald-400 dark:border-emerald-500 shadow-sm",
    inactiveHoverColor: "hover:text-emerald-500 dark:hover:text-emerald-400",
  },
  purple: {
    label: "Purple",
    activeClasses: "bg-violet-100 dark:bg-[rgba(91,33,182,0.35)] text-violet-700 dark:text-violet-300 border-2 border-violet-400 dark:border-violet-500 shadow-sm",
    inactiveHoverColor: "hover:text-violet-500 dark:hover:text-violet-400",
  },
  orange: {
    label: "Orange",
    activeClasses: "bg-orange-100 dark:bg-[rgba(154,52,18,0.35)] text-orange-700 dark:text-orange-300 border-2 border-orange-400 dark:border-orange-500 shadow-sm",
    inactiveHoverColor: "hover:text-orange-500 dark:hover:text-orange-400",
  },
  pink: {
    label: "Pink",
    activeClasses: "bg-pink-100 dark:bg-[rgba(157,23,77,0.35)] text-pink-700 dark:text-pink-300 border-2 border-pink-400 dark:border-pink-500 shadow-sm",
    inactiveHoverColor: "hover:text-pink-500 dark:hover:text-pink-400",
  },
};

export const THEME_ORDER: ColorTheme[] = ["blue", "green", "purple", "orange", "pink"];

