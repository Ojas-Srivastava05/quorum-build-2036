import type { AgentId } from "@/lib/types";

export interface AgentPersona {
  id: AgentId;
  name: string;
  role: string;
  mandate: string;
  system: string;
  color: string;
}
