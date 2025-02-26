import { DepositWidget } from "@/components/Pools/UniV3Widget/DepositWidget";
import "./styles.scss";

export default function Page() {
  return (
    <main className="UniV3PoolsWrapper">
      <DepositWidget />
    </main>
  );
}
