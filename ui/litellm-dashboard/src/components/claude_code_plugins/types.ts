export interface Plugin {
  id: string;
  name: string;
  domain?: string;
  namespace?: string;
  description?: string;
  keywords?: string[];
  category?: string;
  enabled?: boolean;
  source?: {
    source: "github" | "git-subdir" | "url";
    repo?: string;
    url?: string;
    path?: string;
  };
}

export interface SkillRegisterRequest {
  [key: string]: any;
}
