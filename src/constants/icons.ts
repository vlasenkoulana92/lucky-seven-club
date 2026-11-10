import React from 'react';

/**
 * One icon library for the whole project: lucide-react-native. This alias
 * keeps every component's Icon prop compatible with a LucideIcon, which is a
 * forwardRef component rather than a plain function component.
 */
export type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export type IconComponent = React.ComponentType<any>;

export const ICON_SIZE_BUTTON = 24;
export const ICON_SIZE_PILL = 20;
export const ICON_SIZE_INLINE = 18;
