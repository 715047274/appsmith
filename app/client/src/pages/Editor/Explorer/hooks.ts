import { useSelector } from "react-redux";
import { AppState } from "reducers";
import CanvasWidgetsNormalizer from "normalizers/CanvasWidgetsNormalizer";
import { ENTITY_TYPE } from "entities/DataTree/dataTreeFactory";
import { Page } from "constants/ReduxActionConstants";

export const useEntities = () => {
  const canvasWidgets = useSelector((state: AppState) => {
    return state.entities.canvasWidgets;
  });

  const currentPageId = useSelector((state: AppState) => {
    return state.entities.pageList.currentPageId;
  });

  const widgetTree = CanvasWidgetsNormalizer.denormalize("0", {
    canvasWidgets,
  });

  widgetTree.ENTITY_TYPE = ENTITY_TYPE.WIDGET;
  widgetTree.pageId = currentPageId;

  const actions = useSelector((state: AppState) => {
    return state.entities.actions.map(action => ({
      ...action,
      ENTITY_TYPE: ENTITY_TYPE.ACTION,
    }));
  });

  const pages: Array<Page & { ENTITY_TYPE: ENTITY_TYPE }> = useSelector(
    (state: AppState) =>
      state.entities.pageList.pages.map(page => {
        return { ...page, ENTITY_TYPE: ENTITY_TYPE.PAGE };
      }),
  );
  return { widgetTree, actions, pages, currentPageId };
};
