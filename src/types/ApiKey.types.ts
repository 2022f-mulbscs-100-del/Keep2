export type ApiKeyType = {
  id: number;
  name?: string | null;
  key?: string | null;
  isActive?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  lastUsedAt?: string | null;
  revokedAt?: string | null;
};
