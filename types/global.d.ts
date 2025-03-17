export {}

// Create a type for the roles
export type Roles = "admin" | "user";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
      currentValue?: number
      totalInvestment?: number
      roi?: number
      kycStatus?: boolean
      accountStatus?: boolean
    }
  }
}
