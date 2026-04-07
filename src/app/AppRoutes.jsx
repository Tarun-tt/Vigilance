import { Routes, Route, Navigate } from "react-router-dom";
import { PortalLayout } from "../components/layout/PortalLayout";
import {
  DEFAULT_REDIRECT,
  getInvestigationDefaultStep,
  investigationPath,
} from "./routeConfig";
import { ApprovalWorkspace } from "../stages/stage-1/approval/ApprovalWorkspace";
import { ComplaintWorkspace } from "../stages/stage-1/complaint/ComplaintWorkspace";
import { InvestigationWorkspace } from "../stages/stage-2/investigation/InvestigationWorkspace";
import { CaCommentsWorkspace } from "../stages/stage-2/ca-comments/CaCommentsWorkspace";
import { IacWorkspace } from "../stages/stage-2/iac/IacWorkspace";
import { FspWorkspace } from "../stages/stage-2/fsp/FspWorkspace";
import { AocWorkspace } from "../stages/stage-3/aoc/AocWorkspace";
import { EnquiryWorkspace } from "../stages/stage-3/enquiry/EnquiryWorkspace";
import { SspWorkspace } from "../stages/stage-3/ssp/SspWorkspace";
import { PenaltyWorkspace } from "../stages/stage-3/penalty/PenaltyWorkspace";
import { AbbffWorkspace } from "../stages/stage-4/abbff/AbbffWorkspace";
import { AppealWorkspace } from "../stages/stage-5/appeal/AppealWorkspace";
import { ReviewWorkspace } from "../stages/stage-5/review/ReviewWorkspace";

const investigationEntry = investigationPath(getInvestigationDefaultStep());

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PortalLayout />}>
        <Route index element={<Navigate to={DEFAULT_REDIRECT} replace />} />
        <Route path="stage-1/approval" element={<ApprovalWorkspace />} />
        <Route
          path="stage-1/complaint-registration"
          element={<ComplaintWorkspace />}
        />
        <Route
          path="stage-2/investigation"
          element={<Navigate to={investigationEntry} replace />}
        />
        <Route
          path="stage-2/investigation/:step"
          element={<InvestigationWorkspace />}
        />
        <Route path="stage-2/ca-comments" element={<CaCommentsWorkspace />} />
        <Route path="stage-2/iac" element={<IacWorkspace />} />
        <Route path="stage-2/fsp" element={<FspWorkspace />} />
        <Route path="stage-3/aoc" element={<AocWorkspace />} />
        <Route path="stage-3/enquiry" element={<EnquiryWorkspace />} />
        <Route path="stage-3/ssp" element={<SspWorkspace />} />
        <Route path="stage-3/penalty" element={<PenaltyWorkspace />} />
        <Route path="stage-4/abbff" element={<AbbffWorkspace />} />
        <Route path="stage-5/appeal" element={<AppealWorkspace />} />
        <Route path="stage-5/review" element={<ReviewWorkspace />} />
      </Route>
      <Route path="*" element={<Navigate to={DEFAULT_REDIRECT} replace />} />
    </Routes>
  );
}
