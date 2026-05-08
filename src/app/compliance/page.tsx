import { AppToolbar } from "@/components/app-toolbar";
import { ComplianceDashboard } from "@/components/compliance-dashboard";
import { dataset } from "@/domain/sample-data";

export default function CompliancePage() {
  return (
    <>
      <AppToolbar dataset={dataset} activeModule="Compliance" />

      <div className="pageBar">
        <div>
          <p className="pageBarEyebrow">Compliance &amp; tax</p>
          <h1>Stay 280E-clean and audit-ready in CO and IL.</h1>
          <p className="pageBarSubtitle">
            Track licenses, classify expenses for IRC 280E, and stay ahead of monthly excise tax
            filings - all from one shared workspace with your CPA.
          </p>
        </div>
        <div className="pageBarActions">
          <a href="/">Back to dashboard</a>
          <a href="/inventory">Inventory</a>
          <button type="button" className="primaryCta">
            + New filing
          </button>
        </div>
      </div>

      <main>
        <ComplianceDashboard dataset={dataset} />
      </main>
    </>
  );
}
