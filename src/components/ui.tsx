import type { ReactNode } from "react";

type CardProps = {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function Card({ title, eyebrow, action, children }: CardProps) {
  return (
    <section className="card">
      <div className="cardHeader">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

type MetricProps = {
  label: string;
  value: string;
  detail?: string;
};

export function Metric({ label, value, detail }: MetricProps) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </div>
  );
}

type BadgeTone = "good" | "warn" | "danger" | "neutral" | "info";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="emptyState">{children}</p>;
}
