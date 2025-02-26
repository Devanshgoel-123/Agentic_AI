import "./styles.scss";

import { PoolsWidget } from "@/components/Pools/PoolsWidget";

interface Props {}

export default function Page() {
  return (
    <main className="PoolsWrapper">
      <PoolsWidget />
    </main>
  );
}
