// sampleApprovalForm.js
import { emptyApprovalForm } from "./approvalFormDefaults";

export function sampleFilledForm() {
  return {
    ...emptyApprovalForm(),
    refNo: "VIG:INV 2026/INV045",
    date: "2026-04-02",
    nameOfAccount: "ABC Traders Pvt Ltd",
    dateOfComplaint: "2026-01-12",
    typeOfComplaint: "Fraud",
    sourceOfComplaint: "CVC",
    npaDate: "—",
    presentAccountStatus: "Standard",
    lendingBranch: "Noida Main Branch",
    staffInvolved: "No",
    branchOffice: "Noida Main Branch",
    zoneNbg: "Delhi NCR",
    complainantName: "Rajesh Sharma",
    address: "Noida Sector 62",
    state: "Uttar Pradesh",
    email: "rajesh.sharma@example.com",
    mobile: "9876543210",
    pin: "201301",
    amountInvolved: "12,50,000",
    probableLoss: "4,00,000",
    kycLetter1: "Sent 10-01-2026",
    kycLetter2: "Reminder 22-01-2026",
    kycLetter3: "—",
    kycStatus: "Established",
    kycRemarks: "OVD verified",
    allegationDetails:
      "Yes — branch official involvement suspected; details on record.",
    modusOperandi: "Misuse of sanctioning authority and layered transfers.",
    scopeRows: [
      { sno: 1, particulars: "Document verification" },
      { sno: 2, particulars: "Staff involvement" },
      { sno: 3, particulars: "Transaction audit" },
      { sno: 4, particulars: "Customer verification" },
      { sno: 5, particulars: "" },
    ],
    officerName: "Amit Verma",
    officerPf: "PF12345",
    designation: "Chief Manager",
    posting: "Vigilance, ZO",
    proposedDate: "2026-05-15",
    deptObservation:
      "The complaint prima facie reveals systemic gaps in monitoring. Detailed investigation is recommended to establish accountability.",
    cvoComments:
      "Approve detailed vigilance investigation subject to submission of periodic progress reports.",
    isFormApproved: "Yes",
    dateOfApproval: "2026-04-01",
    attachDocument: null,
  };
}
