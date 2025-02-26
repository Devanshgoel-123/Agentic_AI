"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import useUniV3Store from "@/store/univ3-store";
import { useShallow } from "zustand/react/shallow";

import { Area, AreaChart, ReferenceArea, ReferenceLine, XAxis } from "recharts";
import { GraphDataType } from "@/store/types/pool-type";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);

interface Props {
  loading: boolean;
  data: GraphDataType;
  poolId: string;
  range: number;
  reverse: boolean;
}

const GraphWidget = ({ poolId, data, loading, range, reverse }: Props) => {
  const {
    currentTick,
    minTick,
    maxTick,
    setIsAnimateMinTickBorder,
    setIsAnimateMaxTickBorder,
  } = useUniV3Store(
    useShallow((state) => ({
      currentTick: state.currentTick,
      minTick: state.minTick,
      maxTick: state.maxTick,
      setIsAnimateMinTickBorder: state.setIsAnimateMinTickBorder,
      setIsAnimateMaxTickBorder: state.setIsAnimateMaxTickBorder,
    }))
  );
  const [isMinTickMoving, setIsMinTickMoving] = useState(false);
  const [isMaxTickMoving, setIsMaxTickMoving] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [minTickValue, setMinTickValue] = useState(minTick);
  const [maxTickValue, setMaxTickValue] = useState(maxTick);

  useEffect(() => {
    setMinTickValue(minTick);
  }, [minTick]);

  useEffect(() => {
    setMaxTickValue(maxTick);
  }, [maxTick]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  /**
   * Function to trim array as range selected by user.
   * @param array tick array.
   * @param tickIdx current tick index.
   * @param range selected range.
   * @returns
   */
  const trimArray = (
    array: Array<{
      tickIdx: number;
      liquidityActive: number;
      liquidityLockedToken0: number;
      liquidityLockedToken1: number;
      isCurrent: boolean;
    }>,
    tickIdx: number,
    range: number
  ) => {
    const targetIndex = array.findIndex((item) => item.isCurrent);

    if (targetIndex === -1) {
      return [];
    }
    const startIndex = Math.max(0, targetIndex - range);
    const endIndex = Math.min(array.length, targetIndex + range + 1);
    return array.slice(startIndex, endIndex);
  };

  const trimmedData = trimArray(data.ticks, currentTick, range);

  /**
   * Function to capture x-axis value from graph onMouseMove
   * @param event
   */
  const handleMinTickMouseMove = (event: any) => {
    if (event && event.activeLabel && isMinTickMoving) {
      const roundedTick = parseInt(
        (Math.ceil(event.activeLabel / 60) * 60).toString()
      );
      setMinTickValue(roundedTick);
    } else if (event && event.activeLabel && isMaxTickMoving) {
      const roundedTick = parseInt(
        (Math.ceil(event.activeLabel / 60) * 60).toString()
      );
      setMaxTickValue(roundedTick);
    }
  };

  /**
   * Custom label for minTick line.
   * @param param0 point details.
   * @returns JSX
   */
  const renderCustomMinTickLabel = ({ viewBox }: any) => {
    return (
      <g>
        <foreignObject
          x={reverse ? viewBox.x - 2 : viewBox.x - 17.5}
          y={viewBox.y}
          width={20}
          height={30}
        >
          <div
            style={
              reverse
                ? {
                    width: "20px",
                    height: "30px",
                    backgroundColor: "#7BF179",
                    borderTopRightRadius: "8px",
                    borderBottomRightRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }
                : {
                    width: "20px",
                    height: "30px",
                    backgroundColor: "#7BF179",
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    padding: "5px",
                    cursor: "pointer",
                  }
            }
            onMouseDown={() => {
              setIsMinTickMoving(true);
            }}
            onMouseUp={onMouseUpMinTickHandleFunction}
          ></div>
        </foreignObject>
      </g>
    );
  };

  /**
   * Custom label for maxTick line.
   * @param param0 point details.
   * @returns JSX
   */
  const renderCustomMaxTickLabel = ({ viewBox }: any) => {
    return (
      <g>
        <foreignObject
          x={reverse ? viewBox.x - 17.5 : viewBox.x - 2}
          y={viewBox.y}
          width={30}
          height={30}
        >
          <div
            style={
              reverse
                ? {
                    width: "20px",
                    height: "30px",
                    backgroundColor: "#7BF179",
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    padding: "5px",
                    cursor: "pointer",
                  }
                : {
                    width: "20px",
                    height: "30px",
                    backgroundColor: "#7BF179",
                    borderTopRightRadius: "8px",
                    borderBottomRightRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }
            }
            onMouseDown={() => {
              setIsMaxTickMoving(true);
            }}
            onMouseUp={onMouseUpMaxTickHandleFunction}
          ></div>
        </foreignObject>
      </g>
    );
  };

  const onMouseUpMinTickHandleFunction = () => {
    const roundedTick = parseInt(
      (Math.ceil(minTickValue / 60) * 60).toString()
    );
    useUniV3Store.getState().setMinTick(roundedTick);
    if (reverse) {
      setIsAnimateMaxTickBorder();
    } else {
      setIsAnimateMinTickBorder();
    }
    setIsMinTickMoving(false);
  };

  const onMouseUpMaxTickHandleFunction = () => {
    const roundedTick = parseInt(
      (Math.ceil(maxTickValue / 60) * 60).toString()
    );
    useUniV3Store.getState().setMaxTick(roundedTick);
    if (reverse) {
      setIsAnimateMinTickBorder();
    } else {
      setIsAnimateMaxTickBorder();
    }
    setIsMaxTickMoving(false);
  };

  return (
    <>
      {!loading && data.ticks.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trimmedData}
            onMouseMove={handleMinTickMouseMove}
            onMouseUp={() => {
              if (isMinTickMoving) {
                onMouseUpMinTickHandleFunction();
              } else if (isMaxTickMoving) {
                onMouseUpMaxTickHandleFunction();
              }
            }}
          >
            <XAxis
              dataKey="tickIdx"
              tickLine={false}
              tick={false}
              allowDuplicatedCategory={false}
              interval={0}
              domain={[
                trimmedData[0].tickIdx,
                trimmedData[trimmedData.length - 1].tickIdx,
              ]}
              type="number"
              allowDataOverflow
            />
            <ReferenceLine
              x={currentTick}
              stroke="#f2fef1"
              strokeDasharray="5 5"
              ifOverflow="extendDomain"
            />
            {maxTick !== undefined && !isNaN(maxTick) && (
              <ReferenceLine
                x={maxTickValue}
                stroke="#7BF179"
                strokeWidth={8}
                ifOverflow="extendDomain"
                onMouseDown={() => {
                  setIsMaxTickMoving(true);
                }}
                onMouseUp={onMouseUpMaxTickHandleFunction}
                label={renderCustomMaxTickLabel}
                isFront={true}
              />
            )}
            {minTick !== undefined && !isNaN(minTick) && (
              <ReferenceLine
                x={minTickValue}
                stroke="#7BF179"
                strokeWidth={8}
                ifOverflow="extendDomain"
                onMouseDown={() => {
                  setIsMinTickMoving(true);
                }}
                onMouseUp={onMouseUpMinTickHandleFunction}
                label={renderCustomMinTickLabel}
                isFront={true}
              />
            )}
            <Area
              type="monotone"
              dataKey="liquidityActive"
              stroke="#F2F2F21F"
              fill="#F2F2F21F"
            />
            <ReferenceArea
              x1={minTickValue}
              x2={maxTickValue}
              fill="#7BF17940"
              ifOverflow="extendDomain"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default GraphWidget;
