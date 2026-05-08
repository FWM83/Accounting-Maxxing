import { AppToolbar } from "@/components/app-toolbar";
import { InventoryDashboard } from "@/components/inventory-dashboard";
import { dataset } from "@/domain/sample-data";

export default function InventoryPage() {
  return (
    <>
      <AppToolbar dataset={dataset} activeModule="Inventory" />

      <div className="pageBar">
        <div>
          <p className="pageBarEyebrow">Inventory &amp; integrations</p>
          <h1>Your POS and METRC, talking to your books.</h1>
          <p className="pageBarSubtitle">
            Bring inventory in from Flowhub, Dutchie, Treez, Cova, or BioTrack and keep METRC in
            sync for both Colorado and Illinois locations - no double entry.
          </p>
        </div>
        <div className="pageBarActions">
          <a href="/">Back to dashboard</a>
          <a href="/compliance">Compliance</a>
          <button type="button" className="primaryCta">
            + Add integration
          </button>
        </div>
      </div>

      <main>
        <InventoryDashboard dataset={dataset} />
      </main>
    </>
  );
}
