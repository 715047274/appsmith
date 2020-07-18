import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import TreeDropdown from "components/editorComponents/actioncreator/TreeDropdown";
import { noop } from "lodash";
import ContextMenuTrigger from "./ContextMenuTrigger";
import { ReduxActionTypes } from "constants/ReduxActionConstants";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { ContextMenuPopoverModifiers } from "./ContextMenuHelpers";
import { initExplorerEntityNameEdit } from "actions/explorerActions";

export const PageContextMenu = (props: {
  pageId: string;
  name: string;
  applicationId: string;
  className?: string;
}) => {
  const dispatch = useDispatch();

  const deletePage = useCallback(
    (pageId: string, pageName: string): void => {
      dispatch({
        type: ReduxActionTypes.DELETE_PAGE_INIT,
        payload: {
          id: pageId,
        },
      });
      AnalyticsUtil.logEvent("DELETE_PAGE", {
        pageName,
      });
    },
    [dispatch],
  );

  const setPageAsDefault = useCallback(
    (pageId: string, applicationId?: string): void => {
      dispatch({
        type: ReduxActionTypes.SET_DEFAULT_APPLICATION_PAGE_INIT,
        payload: {
          id: pageId,
          applicationId,
        },
      });
    },
    [dispatch],
  );

  const editPageName = useCallback(
    () => dispatch(initExplorerEntityNameEdit(props.pageId)),
    [dispatch, props.pageId],
  );
  return (
    <TreeDropdown
      className={props.className}
      defaultText=""
      modifiers={ContextMenuPopoverModifiers}
      onSelect={noop}
      selectedValue=""
      optionTree={[
        {
          value: "rename",
          onSelect: editPageName,
          label: "Edit Name",
        },
        {
          value: "setdefault",
          onSelect: () => setPageAsDefault(props.pageId, props.applicationId),
          label: "Set as Home Page",
        },
        {
          value: "delete",
          onSelect: () => deletePage(props.pageId, props.name),
          label: "Delete",
          intent: "danger",
        },
      ]}
      toggle={<ContextMenuTrigger />}
    />
  );
};

export default PageContextMenu;
