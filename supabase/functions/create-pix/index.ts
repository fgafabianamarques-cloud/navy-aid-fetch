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
        JSON.stringify({ success: false, error: 'API key não configurada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const transactionRef = reference || `MRN-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const body = {
      amount: amount || 4150,
      description: description || "Pagamento seguro",
      reference: transactionRef,
      source: "api_externa",
      customer: {
        name: name,
        email: email || `${document}@inscricao.marinha.mil.br`,
        document: document.replace(/\D/g, ''),
        phone: phone || "00000000000",
      },
    };

    console.log('Creating PIX transaction:', JSON.stringify(body));

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

    if (!response.ok || data.status === 'error') {
      return new Response(
        JSON.stringify({ success: false, error: data.message || 'Erro ao criar transação PIX' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: data.transaction_id,
        qr_code: data.qr_code,
        qr_code_base64: data.qr_code_base64,
        amount: data.amount,
        expires_at: data.expires_at,
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
