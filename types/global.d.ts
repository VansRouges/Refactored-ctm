export {}

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
