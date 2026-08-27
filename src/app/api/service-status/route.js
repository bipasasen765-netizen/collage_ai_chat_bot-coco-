import { SERVICE_ENABLED } from "../config/service";

export async function GET() {
  return Response.json({
    enabled: SERVICE_ENABLED,
  });
}