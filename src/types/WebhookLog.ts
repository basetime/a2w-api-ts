/**
 * A record of a webhook delivery attempt.
 *
 * Returned by `client.organizations.webhooks.getLogs()`. The exact shape of `payload` and
 * `response` is webhook-event specific and intentionally typed loosely.
 */
export interface WebhookLog {
  /**
   * The ID of the log entry.
   */
  id: string;

  /**
   * The ID of the organization that owns the webhook.
   */
  organization: string;

  /**
   * The ID of the webhook that was invoked.
   */
  webhook: string;

  /**
   * The event that triggered the delivery.
   */
  event: string;

  /**
   * The URL the request was sent to.
   */
  url: string;

  /**
   * The HTTP status code returned by the receiver.
   */
  status: number;

  /**
   * The payload that was sent.
   */
  payload: any;

  /**
   * The response body returned by the receiver, when available.
   */
  response?: any;

  /**
   * The date of the delivery attempt.
   */
  createdDate: Date;
}
