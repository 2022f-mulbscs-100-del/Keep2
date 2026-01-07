export type paymentMethodtype = {
  id: string;
  object: string;
  card: {
    brand: string;
    checks: {
      address_line1_check: string | null;
      address_postal_code_check: string | null;
      cvc_check: string | null;
    };
    country: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    last4: string;
    networks: {
      available: string[];
      preferred: string | null;
    };
    three_d_secure_usage: {
      supported: boolean;
    };
    wallet: null;
  };
  created: number;
  customer: string;
  livemode: boolean;
  metadata: Record<string, string>;
  type: string;
  funding: string;
  country: string;
};
