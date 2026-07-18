import { Plugin } from "./types";

interface SkillDetailProps {
  skill: Plugin | null;
  onBack: () => void;
  isAdmin?: boolean;
  accessToken?: string | null;
  onPublishClick?: () => void;
}

export default function SkillDetail(props: SkillDetailProps) {
  return null;
}
