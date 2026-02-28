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

    const apiKey = Deno.env.get('PARADISE_API_KEY');

    if (!apiKey) {
      console.error('PARADISE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Credenciais do gateway não configuradas' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanDoc = document.replace(/\D/g, '');

    const body = {
      amount: amount || 4150,
      description: description || "Pagamento seguro",
      reference: reference || `MRN-${Date.now()}`,
      source: "api_externa",
      customer: {
        name: name,
        email: email || `${cleanDoc}@pagamentoseguro.com.br`,
        document: cleanDoc,
        phone: phone || "00000000000",
      },
    };

    console.log('Creating Paradise PIX transaction:', JSON.stringify(body));

    const response = await fetch('https://multi.paradisepags.com/api/v1/transaction.php', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Paradise API response:', JSON.stringify(data));

    if (data.status !== 'success') {
      return new Response(
        JSON.stringify({ success: false, error: data.message || data.error || 'Erro ao criar transação PIX' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: data.transaction_id,
        qr_code: data.qr_code || "",
        qr_code_base64: data.qr_code_base64 || "",
        amount: data.amount,
        expires_at: data.expires_at || "",
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
