import { NextRequest, NextResponse } from 'next/server';
import { findLead, createLead, updateLead, createDiagnosis } from '@/lib/db-simple';

// Webhook de Make para capturar emails
const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/985ntpds93gro0p1q95w46puft2ln2eu';
const SALES_PAGE_URL = 'https://vuelveadormir.space.z.ai';

// Profile data
const profiles = {
  A: { name: '🧠 La Mente Que No Para', desc: 'Ansiedad Cognitiva • Bucle Mental Nocturno' },
  B: { name: '💓 El Cuerpo En Alerta', desc: 'Pico de Cortisol • Activación Física' },
  C: { name: '🔥 La Hora De La Hormona', desc: 'Fluctuación Hormonal • Cambio Biológico' },
  D: { name: '🍔 El Hambre Nocturno', desc: 'Hipoglucemia Nocturna • Caída De Glucosa' }
};

// Función para enviar datos al webhook de Make
async function sendToMakeWebhook(data: {
  email: string;
  profile: string;
  profileName: string;
  answers: Record<string, string>;
  diagnosisId: string;
  timestamp: string;
  secuencia: number;
  estado: string;
}) {
  console.log('📤 Enviando a Make:', JSON.stringify(data, null, 2));
  
  const response = await fetch(MAKE_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseText = await response.text();
  console.log('📥 Respuesta Make:', response.status, responseText);

  return response.ok;
}

export async function POST(request: NextRequest) {
  console.log('📩 API llamada recibida');
  
  try {
    const body = await request.json();
    const { email, profile, answers } = body as {
      email: string;
      profile: keyof typeof profiles;
      answers: Record<string, string>;
    };

    console.log('📩 Datos:', { email, profile, answers });

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    if (!profile || !profiles[profile]) {
      return NextResponse.json({ error: 'Perfil inválido' }, { status: 400 });
    }

    // ==========================================
    // VERIFICAR SI YA ES LA TERCERA VISITA
    // ==========================================
    try {
      const existingLead = await findLead(email);
      
      // Si ya tiene secuencia >= 2, es su tercera visita
      // NO guardar nada, solo redirigir
      if (existingLead && existingLead.secuencia >= 2) {
        console.log('🚫 Tercera visita detectada - Redirigiendo sin guardar');
        return NextResponse.json({
          success: true,
          redirect: SALES_PAGE_URL,
          redirectMessage: 'Esta es tu tercera visita. Serás redirigido a la página de ventas.',
          secuencia: 3,
          estado: 'terminado'
        });
      }
    } catch (checkError) {
      console.error('⚠️ Error al verificar lead:', checkError);
      // Continuar con el proceso normal si hay error
    }

    // ==========================================
    // PROCESO NORMAL (1ª o 2ª visita)
    // ==========================================
    let secuencia = 1;
    let estado = 'nuevo';
    let diagnosisId = '';

    try {
      const existingLead = await findLead(email);
      
      if (existingLead) {
        // Segunda visita
        secuencia = existingLead.secuencia + 1; // Será 2
        estado = 'activo';
        await updateLead(email, secuencia, estado);
        console.log('📊 Segunda visita:', { email, secuencia, estado });
      } else {
        // Primera visita
        await createLead(email);
        console.log('📊 Primera visita:', email);
      }

      // Crear diagnóstico
      diagnosisId = await createDiagnosis({
        email,
        profile,
        answer1: answers['1'] || '',
        answer2: answers['2'] || '',
        answer3: answers['3'] || '',
        answer4: answers['4'] || '',
        answer5: answers['5'] || '',
        secuencia,
        estado,
      });
      
      console.log('📝 Diagnosis ID:', diagnosisId);

    } catch (dbError) {
      console.error('⚠️ Error DB:', dbError);
      diagnosisId = 'error-' + Date.now();
    }

    // Enviar webhook a Make
    const timestamp = new Date().toISOString();
    const webhookSuccess = await sendToMakeWebhook({
      email,
      profile,
      profileName: profiles[profile].name,
      answers,
      diagnosisId,
      timestamp,
      secuencia,
      estado,
    });

    console.log('✅ Resultado:', { secuencia, estado, diagnosisId, webhookSuccess });

    return NextResponse.json({
      success: true,
      message: 'Webhook enviado correctamente a Make',
      email,
      profile,
      profileName: profiles[profile].name,
      diagnosisId,
      timestamp,
      secuencia,
      estado,
      webhookSuccess
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: 'Error al procesar', details: String(error) },
      { status: 500 }
    );
  }
}
