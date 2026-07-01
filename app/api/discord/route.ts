import { NextRequest, NextResponse } from "next/server";
import nacl from "tweetnacl";
import { saveThought } from "../../lib/kv";

function hex(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, "hex"));
}

function verify(publicKey: string, signature: string, timestamp: string, body: string): boolean {
  try {
    return nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      hex(signature),
      hex(publicKey)
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY ?? "";
  const signature = req.headers.get("x-signature-ed25519") ?? "";
  const timestamp = req.headers.get("x-signature-timestamp") ?? "";
  const body = await req.text();

  if (!verify(PUBLIC_KEY, signature, timestamp, body)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const interaction = JSON.parse(body);

  // Discord PING
  if (interaction.type === 1) {
    return NextResponse.json({ type: 1 });
  }

  // Slash command
  if (interaction.type === 2 && interaction.data?.name === "碎碎念") {
    const text = interaction.data.options?.[0]?.value as string | undefined;
    if (text) {
      await saveThought(text);
      return NextResponse.json({
        type: 4,
        data: { content: `已記錄：${text}`, flags: 64 },
      });
    }
  }

  return NextResponse.json({ type: 1 });
}
