# Kotipizza ElevenLabs Webhook Integration

This application includes a webhook endpoint for ElevenLabs Conversational AI platform that receives caller information from Twilio calls.

## Setup Instructions

1. Deploy this application to a publicly accessible server with HTTPS support
2. In the [ElevenLabs Conversational AI settings](https://elevenlabs.io/app/conversational-ai/settings):
   - Set the webhook URL to: `https://your-server-address/webhook/elevenlabs`
   - Configure any necessary authentication secrets
3. Enable fetching conversation initiation data in your agent's security settings

## Webhook Endpoint

The application exposes the following webhook endpoint:

- **URL**: `/webhook/elevenlabs`
- **Method**: `POST`
- **Purpose**: Receives caller information and returns conversation context

### Input Parameters

| Parameter     | Type   | Description                            |
| ------------- | ------ | -------------------------------------- |
| caller_id     | string | The phone number of the caller         |
| agent_id      | string | The ID of the agent receiving the call |
| called_number | string | The Twilio number that was called      |
| call_sid      | string | Unique identifier for the Twilio call  |

### Response Format

```json
{
  "dynamic_variables": {
    "phone_number": "[caller's phone number]",
    "call_time": "[current timestamp]",
    "agent_name": "Pizza Assistant"
  },
  "conversation_config_override": {
    "agent": {
      "prompt": {
        "prompt": "The customer is calling from [phone number]. Be friendly and helpful."
      },
      "first_message": "Thank you for calling Kotipizza! How can I help you today?"
    }
  }
}
```

## Security Considerations

- Add IP whitelisting to ensure only requests from ElevenLabs are accepted
- Consider adding authentication headers for additional security
- Store sensitive values as secrets through the ElevenLabs secrets manager
