import { AppToolbar } from "@/components/app-toolbar";
import { PortalDashboard } from "@/components/portal-dashboard";
import { dataset } from "@/domain/sample-data";

export default function PortalPage() {
  return (
    <>
      <AppToolbar dataset={dataset} activeModule="Portal" />

      <div className="pageBar">
        <div>
          <p className="pageBarEyebrow">Client &amp; Auditor Portal</p>
          <h1>One place to share evidence and stay in sync.</h1>
          <p className="pageBarSubtitle">
            {dataset.company.name} works directly with the audit team here. Document
            requests, attachments, and conversations all live in one shared space.
          </p>
        </div>
        <div className="pageBarActions">
          <a href="/">Back to dashboard</a>
          <a href="#participants">Manage participants</a>
          <button type="button" className="primaryCta">
            + New request
          </button>
        </div>
      </div>

      <main>
        <PortalDashboard dataset={dataset} />
      </main>
    </>
  );
}
