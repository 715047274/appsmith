import React, { useMemo, ReactNode } from "react";
import { datasourceIcon } from "../ExplorerIcons";
import Entity from "../Entity";
import { groupBy } from "lodash";
import { DATA_SOURCES_EDITOR_URL } from "constants/routes";
import { useParams } from "react-router";
import { ExplorerURLParams } from "../helpers";
import history from "utils/history";
import { Plugin } from "api/PluginApi";
import DatasourcePluginGroup from "./PluginGroup";
import { useFilteredDatasources } from "../hooks";
import { useSelector } from "react-redux";
import { AppState } from "@appsmith/reducers";

type ExplorerDatasourcesGroupProps = {
  step: number;
  searchKeyword?: string;
};

export const ExplorerDatasourcesGroup = (
  props: ExplorerDatasourcesGroupProps,
) => {
  const params = useParams<ExplorerURLParams>();
  const datasources = useFilteredDatasources(props.searchKeyword);
  const plugins = useSelector((state: AppState) => {
    return state.entities.plugins.list;
  });
  const disableDatasourceGroup = !datasources || !datasources.length;

  const pluginGroups = useMemo(() => groupBy(datasources, "pluginId"), [
    datasources,
  ]);

  const pluginGroupNodes: ReactNode[] = [];
  for (const [pluginId, datasources] of Object.entries(pluginGroups)) {
    const plugin = plugins.find((plugin: Plugin) => plugin.id === pluginId);

    pluginGroupNodes.push(
      <DatasourcePluginGroup
        plugin={plugin}
        datasources={datasources}
        searchKeyword={props.searchKeyword}
        step={props.step + 1}
        key={plugin?.id || "unknown-plugin"}
      />,
    );
  }
  return (
    <Entity
      entityId="DataSources"
      step={props.step}
      className="group plugins"
      name="DataSources"
      icon={datasourceIcon}
      active={
        window.location.pathname.indexOf(
          DATA_SOURCES_EDITOR_URL(params.applicationId, params.pageId),
        ) > -1
      }
      isDefaultExpanded={
        window.location.pathname.indexOf(
          DATA_SOURCES_EDITOR_URL(params.applicationId, params.pageId),
        ) > -1 || !!props.searchKeyword
      }
      disabled={disableDatasourceGroup}
      createFn={() => {
        history.push(
          DATA_SOURCES_EDITOR_URL(params.applicationId, params.pageId),
        );
      }}
    >
      {pluginGroupNodes}
    </Entity>
  );
};

export default ExplorerDatasourcesGroup;
