/**
 * 驗證結果
 */
export interface AuthenticationResponse {
  /**
   * JWT access token
   */
  token: string,
  /**
   * Refresh token
   */
  refreshToken: string,
}
