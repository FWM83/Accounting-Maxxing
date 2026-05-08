import type { AccountingDataset } from "./types";

export const dataset: AccountingDataset = {
  tenant: {
    id: "tenant-northstar",
    name: "Mile High Wellness Group",
    plan: "growth"
  },
  company: {
    id: "company-northstar",
    tenantId: "tenant-northstar",
    name: "Mile High Wellness Co.",
    legalName: "Mile High Wellness Holdings LLC",
    baseCurrency: "USD",
    fiscalYearStartMonth: 1
  },
  users: [
    {
      id: "user-admin",
      name: "Maya Vega",
      email: "maya@milehighwellness.example",
      role: "admin"
    },
    {
      id: "user-bookkeeper",
      name: "Jordan Reyes",
      email: "jordan@milehighwellness.example",
      role: "bookkeeper"
    },
    {
      id: "user-auditor",
      name: "Casey Patel",
      email: "casey@420accountingco.example",
      role: "auditor"
    }
  ],
  accounts: [
    {
      id: "acct-cash",
      companyId: "company-northstar",
      code: "1000",
      name: "Operating Cash",
      type: "asset",
      normalBalance: "debit",
      isActive: true
    },
    {
      id: "acct-ar",
      companyId: "company-northstar",
      code: "1200",
      name: "Accounts Receivable",
      type: "asset",
      normalBalance: "debit",
      isActive: true
    },
    {
      id: "acct-ap",
      companyId: "company-northstar",
      code: "2000",
      name: "Accounts Payable",
      type: "liability",
      normalBalance: "credit",
      isActive: true
    },
    {
      id: "acct-equity",
      companyId: "company-northstar",
      code: "3000",
      name: "Owner Equity",
      type: "equity",
      normalBalance: "credit",
      isActive: true
    },
    {
      id: "acct-inventory",
      companyId: "company-northstar",
      code: "1300",
      name: "Cannabis Inventory",
      type: "asset",
      normalBalance: "debit",
      isActive: true
    },
    {
      id: "acct-excise-co",
      companyId: "company-northstar",
      code: "2100",
      name: "Excise Tax Payable - CO",
      type: "liability",
      normalBalance: "credit",
      isActive: true
    },
    {
      id: "acct-excise-il",
      companyId: "company-northstar",
      code: "2110",
      name: "Excise Tax Payable - IL",
      type: "liability",
      normalBalance: "credit",
      isActive: true
    },
    {
      id: "acct-sales-tax",
      companyId: "company-northstar",
      code: "2200",
      name: "Sales Tax Payable",
      type: "liability",
      normalBalance: "credit",
      isActive: true
    },
    {
      id: "acct-revenue",
      companyId: "company-northstar",
      code: "4000",
      name: "Cannabis Sales Revenue",
      type: "revenue",
      normalBalance: "credit",
      isActive: true
    },
    {
      id: "acct-cogs-cannabis",
      companyId: "company-northstar",
      code: "5000",
      name: "COGS - Cannabis (280E deductible)",
      type: "expense",
      normalBalance: "debit",
      isActive: true
    },
    {
      id: "acct-software",
      companyId: "company-northstar",
      code: "6100",
      name: "POS & Software Subscriptions",
      type: "expense",
      normalBalance: "debit",
      isActive: true
    },
    {
      id: "acct-rent",
      companyId: "company-northstar",
      code: "6200",
      name: "Retail Location Rent",
      type: "expense",
      normalBalance: "debit",
      isActive: true
    },
    {
      id: "acct-security",
      companyId: "company-northstar",
      code: "6300",
      name: "Security & Vault Services (280E disallowed)",
      type: "expense",
      normalBalance: "debit",
      isActive: true
    },
    {
      id: "acct-compliance",
      companyId: "company-northstar",
      code: "6400",
      name: "Compliance & Licensing",
      type: "expense",
      normalBalance: "debit",
      isActive: true
    }
  ],
  periods: [
    {
      id: "period-2026-03",
      companyId: "company-northstar",
      name: "Mar 2026",
      startsOn: "2026-03-01",
      endsOn: "2026-03-31",
      status: "closed"
    },
    {
      id: "period-2026-04",
      companyId: "company-northstar",
      name: "Apr 2026",
      startsOn: "2026-04-01",
      endsOn: "2026-04-30",
      status: "open"
    }
  ],
  journalEntries: [
    {
      id: "je-invoice-1008",
      companyId: "company-northstar",
      periodId: "period-2026-04",
      entryNumber: "JE-2026-0412",
      date: "2026-04-04",
      description: "Invoice INV-1008 for branding project",
      status: "posted",
      createdByUserId: "user-bookkeeper",
      lines: [
        {
          id: "jel-invoice-1008-ar",
          journalEntryId: "je-invoice-1008",
          accountId: "acct-ar",
          memo: "Recognize customer receivable",
          debit: 8400,
          credit: 0,
          sourceDocumentId: "doc-inv-1008"
        },
        {
          id: "jel-invoice-1008-rev",
          journalEntryId: "je-invoice-1008",
          accountId: "acct-revenue",
          memo: "Recognize design revenue",
          debit: 0,
          credit: 8400,
          sourceDocumentId: "doc-inv-1008"
        }
      ]
    },
    {
      id: "je-payment-1008",
      companyId: "company-northstar",
      periodId: "period-2026-04",
      entryNumber: "JE-2026-0421",
      date: "2026-04-15",
      description: "Payment received for INV-1008",
      status: "posted",
      createdByUserId: "user-bookkeeper",
      lines: [
        {
          id: "jel-payment-1008-cash",
          journalEntryId: "je-payment-1008",
          accountId: "acct-cash",
          memo: "Deposit from Acme Retail",
          debit: 8400,
          credit: 0,
          sourceDocumentId: "doc-bank-apr"
        },
        {
          id: "jel-payment-1008-ar",
          journalEntryId: "je-payment-1008",
          accountId: "acct-ar",
          memo: "Clear Acme Retail receivable",
          debit: 0,
          credit: 8400,
          sourceDocumentId: "doc-inv-1008"
        }
      ]
    },
    {
      id: "je-bill-332",
      companyId: "company-northstar",
      periodId: "period-2026-04",
      entryNumber: "JE-2026-0428",
      date: "2026-04-18",
      description: "Bill BILL-332 for design software",
      status: "posted",
      createdByUserId: "user-bookkeeper",
      lines: [
        {
          id: "jel-bill-332-exp",
          journalEntryId: "je-bill-332",
          accountId: "acct-software",
          memo: "Annual software plan",
          debit: 1200,
          credit: 0,
          sourceDocumentId: "doc-bill-332"
        },
        {
          id: "jel-bill-332-ap",
          journalEntryId: "je-bill-332",
          accountId: "acct-ap",
          memo: "Record vendor payable",
          debit: 0,
          credit: 1200,
          sourceDocumentId: "doc-bill-332"
        }
      ]
    },
    {
      id: "je-payment-332",
      companyId: "company-northstar",
      periodId: "period-2026-04",
      entryNumber: "JE-2026-0430",
      date: "2026-04-23",
      description: "Partial payment for BILL-332",
      status: "posted",
      createdByUserId: "user-bookkeeper",
      lines: [
        {
          id: "jel-payment-332-ap",
          journalEntryId: "je-payment-332",
          accountId: "acct-ap",
          memo: "Reduce payable to CloudSuite",
          debit: 700,
          credit: 0,
          sourceDocumentId: "doc-bill-332"
        },
        {
          id: "jel-payment-332-cash",
          journalEntryId: "je-payment-332",
          accountId: "acct-cash",
          memo: "ACH payment to CloudSuite",
          debit: 0,
          credit: 700,
          sourceDocumentId: "doc-bank-apr"
        }
      ]
    },
    {
      id: "je-rent",
      companyId: "company-northstar",
      periodId: "period-2026-04",
      entryNumber: "JE-2026-0433",
      date: "2026-04-25",
      description: "Office rent payment",
      status: "posted",
      createdByUserId: "user-bookkeeper",
      lines: [
        {
          id: "jel-rent-exp",
          journalEntryId: "je-rent",
          accountId: "acct-rent",
          memo: "April coworking rent",
          debit: 2500,
          credit: 0,
          sourceDocumentId: "doc-rent"
        },
        {
          id: "jel-rent-cash",
          journalEntryId: "je-rent",
          accountId: "acct-cash",
          memo: "ACH to WorkHub",
          debit: 0,
          credit: 2500,
          sourceDocumentId: "doc-bank-apr"
        }
      ]
    }
  ],
  documents: [
    {
      id: "doc-inv-1008",
      companyId: "company-northstar",
      type: "invoice",
      name: "INV-1008 Acme Retail.pdf",
      uploadedAt: "2026-04-04T14:33:00.000Z",
      linkedEntityId: "invoice-1008"
    },
    {
      id: "doc-bill-332",
      companyId: "company-northstar",
      type: "bill",
      name: "BILL-332 CloudSuite.pdf",
      uploadedAt: "2026-04-18T10:05:00.000Z",
      linkedEntityId: "bill-332"
    },
    {
      id: "doc-bank-apr",
      companyId: "company-northstar",
      type: "bank_statement",
      name: "Operating Cash April Statement.csv",
      uploadedAt: "2026-05-01T09:15:00.000Z"
    },
    {
      id: "doc-rent",
      companyId: "company-northstar",
      type: "receipt",
      name: "WorkHub April Rent Receipt.pdf",
      uploadedAt: "2026-04-25T08:20:00.000Z"
    }
  ],
  customers: [
    {
      id: "cust-acme",
      companyId: "company-northstar",
      name: "Cannabis Co-op of Colorado",
      email: "ap@cannabiscoop-co.example"
    },
    {
      id: "cust-harbor",
      companyId: "company-northstar",
      name: "Northside Wellness, Chicago IL",
      email: "ap@northsidewellness.example"
    }
  ],
  vendors: [
    {
      id: "vendor-cloudsuite",
      companyId: "company-northstar",
      name: "CloudSuite POS",
      email: "billing@cloudsuitepos.example"
    },
    {
      id: "vendor-workhub",
      companyId: "company-northstar",
      name: "Mile High Property LLC",
      email: "ar@milehighproperty.example"
    }
  ],
  invoices: [
    {
      id: "invoice-1008",
      companyId: "company-northstar",
      customerId: "cust-acme",
      invoiceNumber: "INV-1008",
      issuedOn: "2026-04-04",
      dueOn: "2026-04-30",
      amount: 8400,
      paidAmount: 8400,
      journalEntryId: "je-invoice-1008"
    },
    {
      id: "invoice-1009",
      companyId: "company-northstar",
      customerId: "cust-harbor",
      invoiceNumber: "INV-1009",
      issuedOn: "2026-04-26",
      dueOn: "2026-05-15",
      amount: 5200,
      paidAmount: 0,
      journalEntryId: "je-invoice-1008"
    }
  ],
  bills: [
    {
      id: "bill-332",
      companyId: "company-northstar",
      vendorId: "vendor-cloudsuite",
      billNumber: "BILL-332",
      issuedOn: "2026-04-18",
      dueOn: "2026-05-18",
      amount: 1200,
      paidAmount: 700,
      journalEntryId: "je-bill-332"
    }
  ],
  payments: [
    {
      id: "payment-1008",
      companyId: "company-northstar",
      direction: "inbound",
      counterpartyId: "cust-acme",
      date: "2026-04-15",
      amount: 8400,
      appliesToId: "invoice-1008",
      journalEntryId: "je-payment-1008"
    },
    {
      id: "payment-332",
      companyId: "company-northstar",
      direction: "outbound",
      counterpartyId: "vendor-cloudsuite",
      date: "2026-04-23",
      amount: 700,
      appliesToId: "bill-332",
      journalEntryId: "je-payment-332"
    }
  ],
  bankAccounts: [
    {
      id: "bank-operating",
      companyId: "company-northstar",
      accountId: "acct-cash",
      institutionName: "First National Bank",
      last4: "2281"
    }
  ],
  bankTransactions: [
    {
      id: "banktx-acme",
      companyId: "company-northstar",
      bankAccountId: "bank-operating",
      postedOn: "2026-04-15",
      description: "ACH CREDIT ACME RETAIL INV1008",
      amount: 8400,
      reference: "INV1008"
    },
    {
      id: "banktx-cloudsuite",
      companyId: "company-northstar",
      bankAccountId: "bank-operating",
      postedOn: "2026-04-23",
      description: "ACH DEBIT CLOUDSUITE APPS",
      amount: -700,
      reference: "BILL332"
    },
    {
      id: "banktx-workhub",
      companyId: "company-northstar",
      bankAccountId: "bank-operating",
      postedOn: "2026-04-25",
      description: "ACH DEBIT WORKHUB OFFICES",
      amount: -2500
    },
    {
      id: "banktx-unmatched",
      companyId: "company-northstar",
      bankAccountId: "bank-operating",
      postedOn: "2026-04-29",
      description: "CARD PURCHASE OFFICE DEPOT",
      amount: -318.72
    }
  ],
  reconciliationSessions: [
    {
      id: "recon-apr-cash",
      companyId: "company-northstar",
      bankAccountId: "bank-operating",
      periodId: "period-2026-04",
      status: "in_progress",
      statementEndingBalance: 12180,
      startedByUserId: "user-bookkeeper",
      startedAt: "2026-05-01T09:20:00.000Z"
    }
  ],
  reconciliationMatches: [
    {
      id: "match-acme",
      sessionId: "recon-apr-cash",
      bankTransactionId: "banktx-acme",
      journalEntryLineIds: ["jel-payment-1008-cash"],
      status: "matched",
      variance: 0,
      confidence: 99,
      matchedByUserId: "user-bookkeeper",
      matchedAt: "2026-05-01T09:32:00.000Z",
      note: "Exact invoice reference and amount."
    },
    {
      id: "match-cloudsuite",
      sessionId: "recon-apr-cash",
      bankTransactionId: "banktx-cloudsuite",
      journalEntryLineIds: ["jel-payment-332-cash"],
      status: "matched",
      variance: 0,
      confidence: 94,
      matchedByUserId: "user-bookkeeper",
      matchedAt: "2026-05-01T09:35:00.000Z",
      note: "Exact vendor and amount."
    },
    {
      id: "match-workhub",
      sessionId: "recon-apr-cash",
      bankTransactionId: "banktx-workhub",
      journalEntryLineIds: ["jel-rent-cash"],
      status: "matched",
      variance: 0,
      confidence: 91,
      matchedByUserId: "user-bookkeeper",
      matchedAt: "2026-05-01T09:40:00.000Z",
      note: "Matched to rent receipt."
    },
    {
      id: "match-unmatched",
      sessionId: "recon-apr-cash",
      bankTransactionId: "banktx-unmatched",
      journalEntryLineIds: [],
      status: "unmatched",
      variance: -318.72,
      confidence: 0,
      note: "Needs receipt or adjusting entry."
    }
  ],
  auditEvents: [
    {
      id: "audit-entry-posted",
      companyId: "company-northstar",
      actorUserId: "user-bookkeeper",
      occurredAt: "2026-04-15T16:05:00.000Z",
      action: "posted",
      entityType: "journal_entry",
      entityId: "je-payment-1008",
      summary: "Posted JE-2026-0421 for Acme Retail payment."
    },
    {
      id: "audit-recon-match",
      companyId: "company-northstar",
      actorUserId: "user-bookkeeper",
      occurredAt: "2026-05-01T09:32:00.000Z",
      action: "matched",
      entityType: "reconciliation_match",
      entityId: "match-acme",
      summary: "Matched bank deposit to cash line on JE-2026-0421."
    },
    {
      id: "audit-period-closed",
      companyId: "company-northstar",
      actorUserId: "user-admin",
      occurredAt: "2026-04-05T12:00:00.000Z",
      action: "closed",
      entityType: "accounting_period",
      entityId: "period-2026-03",
      summary: "Closed March 2026 after management review."
    }
  ],
  documentRequests: [
    {
      id: "req-bank-march",
      companyId: "company-northstar",
      conversationId: "conv-q1-review",
      requesterUserId: "user-auditor",
      recipientUserId: "user-admin",
      title: "March operating bank statement",
      description:
        "Need the full March statement for the operating cash account, including ending balance for tie-out.",
      dueOn: "2026-05-05",
      status: "approved",
      periodId: "period-2026-03",
      attachmentDocumentIds: ["doc-bank-apr"],
      notes: "Tied out to GL on May 4. Variance was zero."
    },
    {
      id: "req-cloudsuite",
      companyId: "company-northstar",
      conversationId: "conv-cloudsuite-classification",
      requesterUserId: "user-auditor",
      recipientUserId: "user-admin",
      title: "CloudSuite vendor agreement",
      description:
        "Looking for the signed annual agreement to confirm classification of BILL-332 as a subscription.",
      dueOn: "2026-05-08",
      status: "submitted",
      journalEntryId: "je-bill-332",
      attachmentDocumentIds: ["doc-bill-332"],
      notes: "Submitted on May 2. Awaiting auditor review."
    },
    {
      id: "req-workhub-lease",
      companyId: "company-northstar",
      conversationId: "conv-q1-review",
      requesterUserId: "user-auditor",
      recipientUserId: "user-admin",
      title: "WorkHub office lease",
      description:
        "Please upload the active office lease so we can support the April rent journal entry.",
      dueOn: "2026-05-10",
      status: "open",
      journalEntryId: "je-rent",
      attachmentDocumentIds: [],
      notes: ""
    },
    {
      id: "req-inv-1009",
      companyId: "company-northstar",
      requesterUserId: "user-auditor",
      recipientUserId: "user-admin",
      title: "Cutoff explanation for INV-1009",
      description:
        "INV-1009 was issued late in April with terms ending in May. Please confirm cutoff treatment and share the engagement letter.",
      dueOn: "2026-05-04",
      status: "needs_more",
      attachmentDocumentIds: [],
      notes: "Auditor asked for the engagement letter and project schedule."
    }
  ],
  conversations: [
    {
      id: "conv-q1-review",
      companyId: "company-northstar",
      subject: "Q1 2026 review and bank tie-out",
      participantIds: ["user-admin", "user-auditor", "user-bookkeeper"],
      lastMessageAt: "2026-05-04T15:42:00.000Z",
      unreadCount: 1
    },
    {
      id: "conv-cloudsuite-classification",
      companyId: "company-northstar",
      subject: "CloudSuite subscription classification",
      participantIds: ["user-admin", "user-auditor"],
      lastMessageAt: "2026-05-02T09:18:00.000Z",
      unreadCount: 0
    },
    {
      id: "conv-onboarding",
      companyId: "company-northstar",
      subject: "Welcome to your audit portal",
      participantIds: ["user-admin", "user-auditor"],
      lastMessageAt: "2026-04-28T14:00:00.000Z",
      unreadCount: 0
    }
  ],
  messages: [
    {
      id: "msg-onboard-1",
      conversationId: "conv-onboarding",
      senderUserId: "user-auditor",
      sentAt: "2026-04-28T14:00:00.000Z",
      body:
        "Welcome to the portal. You'll see my document requests here, and we can chat about anything that comes up during the engagement."
    },
    {
      id: "msg-q1-1",
      conversationId: "conv-q1-review",
      senderUserId: "user-auditor",
      sentAt: "2026-05-01T10:05:00.000Z",
      body: "Hi Maya, kicking off the Q1 review. I'll send a few document requests this week."
    },
    {
      id: "msg-q1-2",
      conversationId: "conv-q1-review",
      senderUserId: "user-admin",
      sentAt: "2026-05-01T10:42:00.000Z",
      body: "Sounds good. Jordan and I will keep an eye on the portal and respond quickly."
    },
    {
      id: "msg-q1-3",
      conversationId: "conv-q1-review",
      senderUserId: "user-auditor",
      sentAt: "2026-05-04T15:42:00.000Z",
      body:
        "Got the bank statement and INV-1008 evidence, thanks. Could you also share the office lease for WorkHub when you have a chance?"
    },
    {
      id: "msg-cloud-1",
      conversationId: "conv-cloudsuite-classification",
      senderUserId: "user-auditor",
      sentAt: "2026-05-02T08:55:00.000Z",
      body: "Quick question: is BILL-332 a one-time purchase or an annual subscription?"
    },
    {
      id: "msg-cloud-2",
      conversationId: "conv-cloudsuite-classification",
      senderUserId: "user-admin",
      sentAt: "2026-05-02T09:18:00.000Z",
      body: "Annual subscription. It renews next March. I attached the agreement."
    }
  ],
  licenses: [
    {
      id: "lic-co-retail",
      companyId: "company-northstar",
      jurisdiction: "CO",
      type: "retail",
      licenseNumber: "403R-00012345",
      issuingAuthority: "Colorado Marijuana Enforcement Division (MED)",
      locationName: "Denver - Federal Heights",
      issuedOn: "2024-08-15",
      expiresOn: "2026-08-15",
      status: "active"
    },
    {
      id: "lic-co-cultivation",
      companyId: "company-northstar",
      jurisdiction: "CO",
      type: "cultivation",
      licenseNumber: "403C-00067890",
      issuingAuthority: "Colorado Marijuana Enforcement Division (MED)",
      locationName: "Pueblo Cultivation Facility",
      issuedOn: "2024-11-01",
      expiresOn: "2026-11-01",
      status: "active"
    },
    {
      id: "lic-il-disp",
      companyId: "company-northstar",
      jurisdiction: "IL",
      type: "retail",
      licenseNumber: "DISP.000123",
      issuingAuthority: "Illinois Department of Financial and Professional Regulation (IDFPR)",
      locationName: "Chicago - West Loop",
      issuedOn: "2025-02-10",
      expiresOn: "2026-08-10",
      status: "renewal_due"
    }
  ],
  integrations: [
    {
      id: "int-flowhub",
      name: "Flowhub",
      type: "pos",
      status: "connected",
      vendorMonogram: "FH",
      lastSyncAt: "2026-05-07T16:14:00.000Z",
      jurisdiction: "CO",
      itemsSynced: 1842,
      description: "Real-time POS sales sync. Maps SKUs to GL accounts and pushes daily summaries."
    },
    {
      id: "int-metrc-co",
      name: "METRC (Colorado)",
      type: "track-and-trace",
      status: "connected",
      vendorMonogram: "MC",
      lastSyncAt: "2026-05-07T15:43:00.000Z",
      jurisdiction: "CO",
      itemsSynced: 2104,
      description: "Mandatory state seed-to-sale. Syncs package weights, tags, and transfers."
    },
    {
      id: "int-metrc-il",
      name: "METRC (Illinois)",
      type: "track-and-trace",
      status: "connected",
      vendorMonogram: "MI",
      lastSyncAt: "2026-05-07T14:02:00.000Z",
      jurisdiction: "IL",
      itemsSynced: 1298,
      description: "Mandatory state seed-to-sale system for Illinois adult-use operators."
    },
    {
      id: "int-dutchie",
      name: "Dutchie",
      type: "ecommerce",
      status: "available",
      vendorMonogram: "DU",
      description: "Online ordering and POS used by many small dispensaries."
    },
    {
      id: "int-treez",
      name: "Treez",
      type: "pos",
      status: "available",
      vendorMonogram: "TR",
      description: "Enterprise POS with strong analytics for multi-location retailers."
    },
    {
      id: "int-cova",
      name: "Cova",
      type: "pos",
      status: "available",
      vendorMonogram: "CV",
      description: "Compliance-first POS with built-in METRC integration."
    },
    {
      id: "int-biotrack",
      name: "BioTrack",
      type: "pos",
      status: "available",
      vendorMonogram: "BT",
      description: "Seed-to-sale + POS, common in vertically integrated operators."
    },
    {
      id: "int-csv",
      name: "CSV import",
      type: "manual",
      status: "available",
      vendorMonogram: "CS",
      description: "Drop in a daily sales export from any POS to bridge a gap."
    }
  ],
  inventorySnapshot: [
    { category: "Flower", units: 1240, valueAtCost: 18600, lowStock: false, metrcPackages: 412 },
    { category: "Pre-rolls", units: 460, valueAtCost: 4140, lowStock: true, metrcPackages: 138 },
    { category: "Concentrates", units: 280, valueAtCost: 9800, lowStock: false, metrcPackages: 92 },
    { category: "Edibles", units: 540, valueAtCost: 6480, lowStock: false, metrcPackages: 148 },
    { category: "Vape cartridges", units: 320, valueAtCost: 7680, lowStock: true, metrcPackages: 102 },
    { category: "Topicals", units: 90, valueAtCost: 1620, lowStock: false, metrcPackages: 32 }
  ],
  complianceItems: [
    {
      id: "comp-280e",
      companyId: "company-northstar",
      title: "Review 280E expense classifications",
      description:
        "12 expenses need review to confirm whether they belong in COGS (deductible) or selling/G&A (disallowed under IRC 280E).",
      framework: "IRS 280E",
      severity: "high",
      status: "in_review",
      dueOn: "2026-05-15"
    },
    {
      id: "comp-co-excise",
      companyId: "company-northstar",
      jurisdiction: "CO",
      title: "Colorado retail marijuana excise tax filing",
      description:
        "DR 0500 due monthly for prior month sales. Includes 15% retail marijuana excise tax for April 2026.",
      framework: "Colorado MED / Department of Revenue",
      severity: "high",
      status: "due_soon",
      dueOn: "2026-05-20"
    },
    {
      id: "comp-il-tax",
      companyId: "company-northstar",
      jurisdiction: "IL",
      title: "Illinois cannabis purchaser excise tax",
      description:
        "Due 20th of each month, includes the per-product potency-based rate (10%, 20%, or 25%).",
      framework: "Illinois IDFPR / IDOR",
      severity: "high",
      status: "due_soon",
      dueOn: "2026-05-20"
    },
    {
      id: "comp-metrc-variance",
      companyId: "company-northstar",
      jurisdiction: "CO",
      title: "METRC inventory variance check",
      description:
        "Two CO packages show a 1.2g variance vs POS sales. Reconcile before close to avoid a MED finding.",
      framework: "Colorado METRC",
      severity: "medium",
      status: "open",
      dueOn: "2026-05-10"
    },
    {
      id: "comp-cash-log",
      companyId: "company-northstar",
      title: "Daily cash drop reconciliation",
      description:
        "Match POS cash sales to vault drops. 2 days unmatched - critical for cash-heavy operations and BSA compliance.",
      framework: "Internal controls / FinCEN guidance",
      severity: "medium",
      status: "open",
      dueOn: "2026-05-08"
    },
    {
      id: "comp-il-license",
      companyId: "company-northstar",
      jurisdiction: "IL",
      title: "Illinois dispensing license renewal",
      description:
        "License DISP.000123 expires Aug 10, 2026. Begin renewal application and gather supporting docs.",
      framework: "Illinois IDFPR",
      severity: "medium",
      status: "in_progress",
      dueOn: "2026-06-10"
    }
  ],
  taxFilings: [
    {
      id: "tax-co-excise-may",
      companyId: "company-northstar",
      jurisdiction: "CO",
      name: "Colorado Retail Marijuana Excise Tax",
      formNumber: "DR 0500",
      period: "April 2026",
      dueOn: "2026-05-20",
      rate: "15% retail excise",
      estimatedAmount: 18420,
      status: "due_soon"
    },
    {
      id: "tax-co-sales-may",
      companyId: "company-northstar",
      jurisdiction: "CO",
      name: "Colorado state sales tax",
      formNumber: "DR 0100",
      period: "April 2026",
      dueOn: "2026-05-20",
      rate: "2.9% state + Denver 4.81% local + RTD 1.1%",
      estimatedAmount: 4620,
      status: "due_soon"
    },
    {
      id: "tax-il-excise-may",
      companyId: "company-northstar",
      jurisdiction: "IL",
      name: "Illinois Cannabis Purchaser Excise Tax",
      formNumber: "REG-1",
      period: "April 2026",
      dueOn: "2026-05-20",
      rate: "10-25% by potency",
      estimatedAmount: 9275,
      status: "due_soon"
    },
    {
      id: "tax-il-sales-may",
      companyId: "company-northstar",
      jurisdiction: "IL",
      name: "Illinois state + local sales tax",
      formNumber: "ST-1",
      period: "April 2026",
      dueOn: "2026-05-20",
      rate: "6.25% state + Cook County + Chicago",
      estimatedAmount: 3120,
      status: "due_soon"
    }
  ]
};
