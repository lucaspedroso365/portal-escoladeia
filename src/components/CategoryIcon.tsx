import {
  IconMessage,
  IconPhoto,
  IconVideo,
  IconMicrophone,
  IconCode,
  IconPlug,
  IconPuzzle,
  IconSparkles,
  type IconProps,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

const MAP: Record<string, ComponentType<IconProps>> = {
  message: IconMessage,
  photo: IconPhoto,
  video: IconVideo,
  microphone: IconMicrophone,
  code: IconCode,
  plug: IconPlug,
  puzzle: IconPuzzle,
};

export function CategoryIcon({
  icon,
  size = 24,
  className,
}: {
  icon: string | null | undefined;
  size?: number;
  className?: string;
}) {
  const Cmp = (icon && MAP[icon]) || IconSparkles;
  return <Cmp size={size} stroke={1.5} className={className} />;
}
