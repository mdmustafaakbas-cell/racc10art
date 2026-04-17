import { NextRequest, NextResponse } from "next/server";

// Shopier ödeme bildirimi webhook endpoint'i
// Shopier panelinde: Hesabım > API Entegrasyonu > Bildirim URL
// Bu URL'yi gir: https://siteadresi.com/api/shopier-webhook

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();

    const orderId = body.get("platform_order_id")?.toString() || "";
    const status = body.get("status")?.toString() || "";
    const amount = parseFloat(body.get("total_order_value")?.toString() || "0");
    const buyerName = body.get("buyer_name")?.toString() || "";
    const buyerSurname = body.get("buyer_surname")?.toString() || "";
    const buyerEmail = body.get("buyer_email")?.toString() || "";
    const buyerPhone = body.get("buyer_phone")?.toString() || "";
    const buyerCity = body.get("billing_city")?.toString() || "";
    const productName = body.get("product_name")?.toString() || "";
    const shopierOrderId = body.get("order_id")?.toString() || "";

    // Sipariş verisini logla (production'da DB'ye yaz)
    console.log("Shopier Webhook:", {
      orderId,
      status,
      amount,
      buyerName,
      buyerEmail,
      productName,
      shopierOrderId,
    });

    // Shopier başarılı yanıt bekler
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Shopier webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

// Shopier ödeme formu için imza oluştur
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId") || Date.now().toString();
  const amount = searchParams.get("amount") || "0";
  const currency = searchParams.get("currency") || "TRY";

  const apiKey = process.env.SHOPIER_API_KEY || "";
  const apiSecret = process.env.SHOPIER_API_SECRET || "";
  const websiteIndex = process.env.SHOPIER_WEBSITE_INDEX || "1";

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Shopier API bilgileri eksik. .env.local dosyasını kontrol et." },
      { status: 400 }
    );
  }

  const randomNr = Math.random().toString(36).substring(2, 10);

  // HMAC-SHA256 imzası
  const crypto = await import("crypto");
  const data = randomNr + orderId + amount + currency;
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(data)
    .digest("base64");

  return NextResponse.json({
    apiKey,
    websiteIndex,
    randomNr,
    orderId,
    amount,
    currency,
    signature,
    platform: "other",
    modul_version: "1.0.4",
  });
}
