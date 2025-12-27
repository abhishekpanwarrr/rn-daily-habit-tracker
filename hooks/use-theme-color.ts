/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
type Theme = keyof typeof Colors;
type ColorName = keyof typeof Colors.light;

export function useThemeColor(props: { light?: string; dark?: string }, colorName: ColorName) {
  const theme: Theme = useColorScheme() ?? "light";

  const colorFromProps = props[theme];
  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName];
}
