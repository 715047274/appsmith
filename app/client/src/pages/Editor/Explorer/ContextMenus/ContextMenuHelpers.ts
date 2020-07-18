import { IPopoverSharedProps } from "@blueprintjs/core";
export const ContextMenuPopoverModifiers: IPopoverSharedProps["modifiers"] = {
  offset: {
    enabled: true,
    offset: 200,
  },

  preventOverflow: {
    enabled: true,
    boundariesElement: "viewport",
  },
  hide: {
    enabled: false,
  },
};
