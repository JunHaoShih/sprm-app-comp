export interface WorldTimeResponse {
  /**
   * the abbreviated name of the timezone
   */
  abbreviation: string,
  client_ip: string,
  /**
   * an ISO8601-valid string representing the current, local date/time
   */
  datetime: string,
  /**
   * current day number of the week, where sunday is 0
   */
  day_of_week: number,
  /**
   * ordinal date of the current year
   */
  day_of_year: number,
  /**
   * flag indicating whether the local time is in daylight savings
   */
  dst: boolean,
  /**
   * an ISO8601-valid string representing the datetime when daylight savings started
   * for this timezone
   */
  dst_from: string | null,
  /**
   * the difference in seconds between the current local time and daylight saving time
   * for the location
   */
  dst_offset: number,
  /**
   * an ISO8601-valid string representing the datetime when daylight savings will end
   * for this timezone
   */
  dst_until: string | null,
  /**
   * the difference in seconds between the current local time and the time in UTC,
   * excluding any daylight saving difference (see dst_offset)
   */
  raw_offset: number,
  /**
   * timezone in Area/Location or Area/Location/Region format
   */
  timezone: string,
  /**
   * number of seconds since the Epoch
   */
  unixtime: number,
  /**
   * an ISO8601-valid string representing the current date/time in UTC
   */
  utc_datetime: string,
  /**
   * an ISO8601-valid string representing the offset from UTC
   */
  utc_offset: string,
  /**
   * the current week number
   */
  week_number: number,
}
