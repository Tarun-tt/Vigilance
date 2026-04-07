// approvalFormDefaults.js
export function emptyApprovalForm() {
  return {
    // Header fields
    refNo: "",
    date: "",

    // Section 1: Reference
    nameOfAccount: "",
    dateOfComplaint: "",
    typeOfComplaint: "",
    sourceOfComplaint: "",
    npaDate: "",
    presentAccountStatus: "",
    lendingBranch: "",
    staffInvolved: "",

    // Section 2: Details of complainant / Account
    complainantName: "",
    address: "",
    state: "",
    email: "",
    mobile: "",
    pin: "",
    amountInvolved: "",
    probableLoss: "",

    // Section 3: Establishment of KYC
    kycLetter1: "",
    kycLetter2: "",
    kycLetter3: "",
    kycStatus: "",
    kycRemarks: "",

    // Section 4: Allegation / Modus operandi
    branchOffice: "",
    zoneNbg: "",
    allegationDetails: "",
    modusOperandi: "",

    // Section 5: Scope of Investigation
    scopeRows: [
      { sno: 1, particulars: "" },
      { sno: 2, particulars: "" },
      { sno: 3, particulars: "" },
      { sno: 4, particulars: "" },
      { sno: 5, particulars: "" },
    ],

    // Section 6: Allotment and timeline of investigation
    officerName: "",
    officerPf: "",
    designation: "",
    posting: "",
    proposedDate: "",

    // Section 7: Department Observation
    deptObservation: "",

    // Section 8: CVO Comments
    cvoComments: "",

    // Generation fields
    isFormApproved: "",
    dateOfApproval: null,
    attachDocument: null,
  };
}
