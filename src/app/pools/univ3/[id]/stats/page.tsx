import { UniV3StatsWidget } from "@/components/Pools/UniV3Widget/StatsWidget";
import "./styles.scss";

export default function Page() {
  return (
    <main className="PoolsStatsWrapper">
      <UniV3StatsWidget />
    </main>
  );
}
