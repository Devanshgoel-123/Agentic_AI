import { IncentivesWidget } from "@/components/IncentivesWidget";
import "./styles.scss";

interface Props {}

export default function Page() {
  return (
    <main className="IncentivesWrapper">
      <IncentivesWidget />
    </main>
  );
}
