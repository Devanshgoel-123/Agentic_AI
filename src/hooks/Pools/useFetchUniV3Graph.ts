import { useQuery } from "@apollo/client";
import { GET_UNIV3_GRAPH } from "@/components/graphql/queries/getUniV3GraphData";
import { useEffect } from "react";
import useUniV3Store from "@/store/univ3-store";

interface Props {
  poolId: string;
  reverse: boolean;
  isSkip?: boolean;
}

const useFetchUniV3Graph = ({ poolId, isSkip, reverse }: Props) => {
  const { loading, error, data, refetch } = useQuery(GET_UNIV3_GRAPH, {
    variables: { slug: poolId, reverseGraph: reverse },
    skip: isSkip,
  });

  useEffect(() => {
    if (data && data.getGraphData) {
      useUniV3Store.getState().setCurrentTick(data.getGraphData.currentTick);
      console.log(data.getGraphData.currentTick, "current");
      const roundedMinTick = parseInt(
        (
          Math.floor((data.getGraphData.currentTick - 3000) / 60) * 60
        ).toString()
      );
      const roundedMaxTick = parseInt(
        (Math.ceil((data.getGraphData.currentTick + 3000) / 60) * 60).toString()
      );
      if (reverse) {
        useUniV3Store
          .getState()
          .setLowerBoundTick(
            parseInt(
              data.getGraphData.ticks[
                data.getGraphData.ticks.length - 1
              ].tickIdx.toString()
            )
          );
        useUniV3Store
          .getState()
          .setUpperBoundTick(data.getGraphData.ticks[0].tickIdx.toString());
      } else {
        useUniV3Store
          .getState()
          .setLowerBoundTick(
            parseInt(data.getGraphData.ticks[0].tickIdx.toString())
          );
        useUniV3Store
          .getState()
          .setUpperBoundTick(
            parseInt(
              data.getGraphData.ticks[
                data.getGraphData.ticks.length - 1
              ].tickIdx.toString()
            )
          );
      }
      useUniV3Store.getState().setMaxTick(parseInt(roundedMaxTick.toString()));
      useUniV3Store.getState().setMinTick(parseInt(roundedMinTick.toString()));
    }
  }, [data, reverse]);

  return {
    data:
      data && data.getGraphData
        ? {
            ...data.getGraphData,
            minTick: parseInt((data.getGraphData.currentTick * 1.1).toString()),
          }
        : {
            currentTick: 0,
            minTick: 0,
            ticks: [],
          },
    loading,
    error,
    refetch,
  };
};

export default useFetchUniV3Graph;
