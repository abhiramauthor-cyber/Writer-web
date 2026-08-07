export const categories = ["All", "Family", "Memory", "Longing"] as const;
export type Category = (typeof categories)[number];
