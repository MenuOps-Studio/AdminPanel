import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Απαραίτητο για να μπορεί το frontend (browser) να καλέσει αυτή τη συνάρτηση
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Διαχείριση του preflight request (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Διαβάζουμε τα δεδομένα που θα μας στείλει το frontend
    const { template_id, template_params } = await req.json()

    // Τα κλειδιά σου τώρα ζουν ασφαλή στο backend!
    const EMAILJS_SERVICE_ID = 'service_t7rq0kq';
    const EMAILJS_USER_ID = 'TR0cDisVNKLl4sAOE';

    // Φτιάχνουμε το payload για το EmailJS
    const payload = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: template_id,
      user_id: EMAILJS_USER_ID,
      template_params: template_params
    };

    // Στέλνουμε το request στο API του EmailJS
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return new Response(JSON.stringify({ success: true, message: "Email sent!" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})