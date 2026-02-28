const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, document, phone, email, amount, description, reference } = await req.json();

    if (!name || !document) {
      return new Response(
        JSON.stringify({ success: false, error: 'Nome e CPF são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const secretKey = Deno.env.get('VORNEXPAY_SECRET_KEY');
    const companyId = Deno.env.get('VORNEXPAY_COMPANY_ID');

    if (!secretKey || !companyId) {
      console.error('VORNEXPAY credentials not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Credenciais do gateway não configuradas' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const credentials = btoa(`${secretKey}:${companyId}`);
    const cleanDoc = document.replace(/\D/g, '');

    const body = {
      customer: {
        name: name,
        email: email || `${cleanDoc}@inscricao.marinha.mil.br`,
        document: cleanDoc,
        phone: phone || "00000000000",
      },
      paymentMethod: "PIX",
      items: [
        {
          title: description || "Inscrição Concurso Marinha do Brasil 2026",
          unitPrice: amount || 4150,
          quantity: 1,
          externalRef: reference || `MRN-${Date.now()}`,
        },
      ],
      amount: amount || 4150,
      description: description || "Inscrição Concurso Marinha do Brasil 2026",
    };

    console.log('Creating VornexPay PIX transaction:', JSON.stringify(body));

    const response = await fetch('https://api.vornexpay.com/functions/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('VornexPay API response:', JSON.stringify(data));

    if (!response.ok) {
      return new Response(
        JSON.stringify({ success: false, error: data.message || data.error || 'Erro ao criar transação PIX' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract PIX data from VornexPay response
    const pixData = data.pix || data.pixData || {};

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: data.id || data.transactionId,
        qr_code: pixData.qrcode || pixData.qrCode || pixData.qr_code || data.qrCode || "",
        qr_code_base64: pixData.qrcodeBase64 || pixData.qrCodeBase64 || pixData.qr_code_base64 || data.qrCodeBase64 || "",
        amount: data.amount,
        expires_at: pixData.expirationDate || pixData.expiresAt || data.expiresAt || "",
        status: data.status,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating PIX:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro interno ao processar pagamento' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
