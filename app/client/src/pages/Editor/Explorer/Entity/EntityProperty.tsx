import React, { useRef, MutableRefObject, memo } from "react";
import styled from "styled-components";
import HighlightedCode, {
  SYNTAX_HIGHLIGHTING_SUPPORTED_LANGUAGES,
} from "components/editorComponents/HighlightedCode";
import { Popover, PopoverInteractionKind } from "@blueprintjs/core";
import { CurrentValueViewer } from "components/editorComponents/CodeEditor/EvaluatedValuePopup";
import { EditorTheme } from "components/editorComponents/CodeEditor/EditorConfig";
import useClipboard from "utils/hooks/useClipboard";
import { Colors } from "constants/Colors";
import Tooltip from "components/editorComponents/Tooltip";

const StyledValue = styled.pre`
  & {
    font-size: ${props => props.theme.fontSizes[1]}px;
    margin: 2px 0px;
    color: ${Colors.GRAY_CHATEAU};
  }
`;

const Wrapper = styled.div<{ step: number }>`
  &&&& {
    cursor: pointer;
    margin: ${props => props.theme.spaces[2]}px 0;
    padding-left: ${props =>
      props.step * props.theme.spaces[2] + props.theme.spaces[3]}px;
    position: relative;
    code {
      border: none;
      box-shadow: none;
      padding: 5px 0em;
      background: none;
    }
    & div.clipboard-message {
      position: absolute;
      left: 0;
      height: 100%;
      top: 0;
      width: 100%;

      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      z-index: 1;
      &.success {
        background: ${Colors.MAKO};
      }
      &.error {
        background: ${Colors.RED};
      }
    }

    & {
      code.${SYNTAX_HIGHLIGHTING_SUPPORTED_LANGUAGES.APPSMITH} {
        white-space: pre-wrap;
        background: transparent;
        font-size: ${props => props.theme.fontSizes[2]}px;
        overflow-wrap: break-word;
        text-shadow: none;
      }
    }
  }
`;

const StyledPopoverContent = styled.div`
  background: black;
  max-height: 400px;
  width: 400px;
  padding: 10px;
  overflow: auto;
  & > div {
    max-height: 100%;
    & > pre {
      overflow: hidden;
    }
  }
  & > pre {
    width: 100%;
    overflow: hidden;
    white-space: pre-wrap;
    color: white;
  }
`;

export type EntityPropertyProps = {
  propertyName: string;
  entityName: string;
  value: string;
  step: number;
};

const transformedValue = (value: any) => {
  if (
    typeof value === "object" ||
    Array.isArray(value) ||
    (value && value.length && value.length > 30)
  ) {
    return JSON.stringify(value).slice(0, 25) + "...";
  }
  return `${value}`;
};

/* eslint-disable react/display-name */
export const EntityProperty = memo((props: EntityPropertyProps) => {
  const propertyRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const write = useClipboard(propertyRef);

  const codeText = `{{${props.entityName}.${props.propertyName}}}`;

  const showPopup =
    typeof props.value === "object" ||
    Array.isArray(props.value) ||
    (props.value && props.value.length && props.value.length > 25);
  const isString = typeof props.value === "string";

  const copyBindingToClipboard = () => {
    write(codeText);
  };

  let propertyValue = (
    <StyledValue>{transformedValue(props.value)}</StyledValue>
  );
  if (showPopup) {
    propertyValue = (
      <Popover
        interactionKind={PopoverInteractionKind.HOVER}
        position="left"
        modifiers={{
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
        }}
      >
        <StyledValue>{transformedValue(props.value)} </StyledValue>
        {showPopup && (
          <StyledPopoverContent>
            {!isString && (
              <CurrentValueViewer
                theme={EditorTheme.DARK}
                evaluatedValue={props.value}
                hideLabel
              />
            )}
            {isString && <pre>{props.value}</pre>}
          </StyledPopoverContent>
        )}
      </Popover>
    );
  }

  return (
    <Wrapper
      ref={propertyRef}
      onClick={copyBindingToClipboard}
      step={props.step}
    >
      <Tooltip content="Click to copy">
        <HighlightedCode
          codeText={codeText}
          language={SYNTAX_HIGHLIGHTING_SUPPORTED_LANGUAGES.APPSMITH}
        />
      </Tooltip>
      {propertyValue}
    </Wrapper>
  );
});

export default EntityProperty;
