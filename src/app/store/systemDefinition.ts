interface ComponentStatus {
  status: "UP" | "DOWN" | "DEGRADED";
  details?: {
    reason: string;
    code: string;
  };
}

export interface Health {
  status: string;
  components: Record<string, ComponentStatus>;
}
