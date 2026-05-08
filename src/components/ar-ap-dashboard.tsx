import { currency, getBillAging, getInvoiceAging } from "@/domain/accounting";
import type { AccountingDataset, PaymentStatus } from "@/domain/types";
import { Badge, Card, Metric } from "./ui";

type Props = {
  dataset: AccountingDataset;
};

export function ArApDashboard({ dataset }: Props) {
  const invoices = getInvoiceAging(dataset);
  const bills = getBillAging(dataset);
  const receivablesOpen = invoices.reduce((sum, item) => sum + item.openAmount, 0);
  const payablesOpen = bills.reduce((sum, item) => sum + item.openAmount, 0);
  const collected = invoices.reduce((sum, item) => sum + item.paidAmount, 0);
  const paidBills = bills.reduce((sum, item) => sum + item.paidAmount, 0);

  return (
    <div className="sectionGrid">
      <Card title="AR/AP Command Center" eyebrow="Operating workflows">
        <div className="metricGrid">
          <Metric label="Open receivables" value={currency(receivablesOpen)} detail="Customer money outstanding" />
          <Metric label="Open payables" value={currency(payablesOpen)} detail="Vendor money outstanding" />
          <Metric label="Cash collected" value={currency(collected)} detail="Applied to invoices" />
          <Metric label="Vendor payments" value={currency(paidBills)} detail="Applied to bills" />
        </div>
      </Card>

      <Card title="Receivables Aging" eyebrow="Customers">
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Due</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Open</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.number}</td>
                  <td>{invoice.counterparty}</td>
                  <td>{invoice.dueOn}</td>
                  <td>{currency(invoice.amount)}</td>
                  <td>{currency(invoice.paidAmount)}</td>
                  <td>{currency(invoice.openAmount)}</td>
                  <td>
                    <Badge tone={paymentTone(invoice.status)}>{invoice.status.replace("_", " ")}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Payables Aging" eyebrow="Vendors">
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Bill</th>
                <th>Vendor</th>
                <th>Due</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Open</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill.number}</td>
                  <td>{bill.counterparty}</td>
                  <td>{bill.dueOn}</td>
                  <td>{currency(bill.amount)}</td>
                  <td>{currency(bill.paidAmount)}</td>
                  <td>{currency(bill.openAmount)}</td>
                  <td>
                    <Badge tone={paymentTone(bill.status)}>{bill.status.replace("_", " ")}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Payment Applications" eyebrow="Paid in full checks">
        <div className="list">
          {dataset.payments.map((payment) => {
            const isInbound = payment.direction === "inbound";
            const counterparty = isInbound
              ? dataset.customers.find((customer) => customer.id === payment.counterpartyId)
              : dataset.vendors.find((vendor) => vendor.id === payment.counterpartyId);
            const target = isInbound
              ? dataset.invoices.find((invoice) => invoice.id === payment.appliesToId)?.invoiceNumber
              : dataset.bills.find((bill) => bill.id === payment.appliesToId)?.billNumber;
            const entry = dataset.journalEntries.find((journalEntry) => journalEntry.id === payment.journalEntryId);

            return (
              <div className="listRow" key={payment.id}>
                <div>
                  <strong>
                    {currency(payment.amount)} {isInbound ? "received from" : "paid to"} {counterparty?.name}
                  </strong>
                  <p>
                    Applied to {target} · Posted via {entry?.entryNumber} on {payment.date}
                  </p>
                </div>
                <Badge tone={isInbound ? "good" : "info"}>{payment.direction}</Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function paymentTone(status: PaymentStatus) {
  if (status === "paid") {
    return "good";
  }

  if (status === "partially_paid") {
    return "warn";
  }

  return "danger";
}
