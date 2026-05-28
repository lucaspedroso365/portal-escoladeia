import {
  IconNews,
  IconApps,
  IconBook,
  IconArrowsLeftRight,
  IconTrophy,
  IconArrowsExchange,
  IconCoin,
  IconSparkles,
  IconBook2,
  IconLayoutDashboard,
  IconPlus,
  type IconProps,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

const MAP: Record<string, ComponentType<IconProps>> = {
  news: IconNews,
  tool: IconApps,
  tutorial: IconBook,
  comparison: IconArrowsLeftRight,
  ranking: IconTrophy,
  alternative: IconArrowsExchange,
  price: IconCoin,
  prompt: IconSparkles,
  glossary: IconBook2,
  dashboard: IconLayoutDashboard,
  plus: IconPlus,
};

export function AdminIcon({
  name,
  size = 18,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Cmp = MAP[name] ?? IconApps;
  return <Cmp size={size} stroke={1.6} className={className} />;
}
