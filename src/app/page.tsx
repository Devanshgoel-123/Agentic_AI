
import "./styles.scss";
import dynamic from "next/dynamic";


const DynamicCrossChainWidget = dynamic(
  () =>
    import("@/components/CrossChainWidget").then((mod) => mod.CrossChainWidget),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <main className="TransferWrapper">
      <DynamicCrossChainWidget />
    </main>
  );
}
