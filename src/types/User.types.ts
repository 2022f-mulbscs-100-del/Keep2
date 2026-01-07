export type ProfileDataType = {
  name?: string;
  email?: string;
  profileImage?: string;
  phone?: number | null;
  isTwoFaEnabled?: boolean;
  autoLogoutEnabled?: boolean;
  autoLogoutTime?: number;
  MfaEnabled?: boolean;
  subscriptionStatus?: string;
  subscriptionPlan?: string;
  subscriptionExpiry?: string;
};
