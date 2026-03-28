'use client';

// Quiz Diagnóstico 3AM - Madrugada Salvada
// v2.0
import { useState, useCallback } from 'react';

// Types
type AnswerKey = 'entre_2_3' | '3_4' | '4_5' | 'otras' | 
                 'pensamientos' | 'corazon' | 'calor' | 'hambre' |
                 'si_mucho' | 'si_leve' | 'no' | 'frio' |
                 'si_bucle' | 'si_lista' | 'si_ansiedad' | 'no_mente' |
                 '30_39' | '40_49' | '50_59' | '60_plus';

type ProfileKey = 'A' | 'B' | 'C' | 'D';

interface Profile {
  name: string;
  desc: string;
  cause: string;
  meaning: string;
  audio: string;
}

interface Answers {
  [key: number]: AnswerKey;
}

// Profile data
const profiles: Record<ProfileKey, Profile> = {
  A: {
    name: '🧠 La Mente Que No Para',
    desc: 'Ansiedad Cognitiva • Bucle Mental Nocturno',
    cause: 'Tu cortisol cae a las 3AM como debe ser, pero tu mente SUBE descontrolada. Es un desajuste específico del ciclo del sueño donde tu sistema activador reticular no se desactiva. Los pensamientos se aceleran en bucles imposibles de romper, generando un estado de alerta que impide volver a dormir.',
    meaning: 'Tu despertar no es aleatorio — sucede exactamente cuando debería ocurrir una transición cerebral. El problema es que tu mente no acompaña a tu cuerpo en ese descenso. Es como si tu cerebro estuviera en modo "resolver problemas" a la hora exacta más inapropiada. Esto representa el 35-40% de los despertares a las 3AM.',
    audio: '🎧 Corta la Ansiedad (7 min)'
  },
  B: {
    name: '💓 El Cuerpo En Alerta',
    desc: 'Pico de Cortisol • Activación Física',
    cause: 'A las 3AM experimentas un pico de cortisol (hormona del estrés) exactamente cuando tu cuerpo debería estar más relajado. Tu sistema nervioso se activa como si hubiera peligro real, causando palpitaciones, tensión muscular y una sensación de alarma corporal. Es predecible, ocurre a la misma hora cada noche.',
    meaning: 'Tu despertares es completamente físico. Tu corazón se acelera, tu cuerpo se tensa, sientes adrenalina corriendo por tus venas. El problema no es tu mente sino tu regulación hormonal. Tu cuerpo cree que hay peligro cuando simplemente está durmiendo. Es reversible con activación vagal correcta.',
    audio: '🎧 Suelta la Noche (8 min)'
  },
  C: {
    name: '🔥 La Hora De La Hormona',
    desc: 'Fluctuación Hormonal • Cambio Biológico',
    cause: 'Los cambios hormonales son la causa raíz. Típicamente en mujeres de 45-60 años, los estrógenos caen significativamente a las 3AM causando olas de calor, sudoración profusa y despertares inevitables. No es imaginación — es fisiología pura. Tu cuerpo está pasando por una transición biológica importante.',
    meaning: 'Lo que experimentas es completamente normal y completamente reversible. A esta edad, tu cuerpo está reajustando sus sistemas hormonales. Las 3AM es cuando esos cambios impactan más. Millones de mujeres experimentan exactamente esto. Con el protocolo correcto, vuelves a dormir como antes.',
    audio: '🎧 La Hora De La Hormona (9 min)'
  },
  D: {
    name: '🍔 El Hambre Nocturna',
    desc: 'Hipoglucemia Nocturna • Caída De Glucosa',
    cause: 'Tu glucosa desciende demasiado durante el sueño profundo. A las 3AM tu glucosa cae a niveles que activan el sistema de supervivencia de tu cuerpo. Tu sistema nervioso interpreta esto como una emergencia y te despierta pidiendo urgentemente energía. Es una respuesta fisiológica al hambre real.',
    meaning: 'Tu cuerpo no está "roto" — está funcionando perfectamente bien. El problema es que no hay suficiente glucosa disponible durante el sueño. Una pequeña modificación en tu nutrición nocturna resuelve esto completamente. Es uno de los problemas más fáciles de arreglar con los cambios correctos.',
    audio: '🎧 Vuelve a Dormir (6 min)'
  }
};

type ScreenType = 'welcome' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'loading' | 'result' | 'email' | 'upsell' | 'thanks';

export default function QuizPage() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [answers, setAnswers] = useState<Answers>({});
  const [currentProfile, setCurrentProfile] = useState<ProfileKey>('A');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const goToQuestion = useCallback((num: number) => {
    setCurrentScreen(`q${num}` as ScreenType);
  }, []);

  const answerQuestion = useCallback((num: number, value: AnswerKey) => {
    setAnswers(prev => ({ ...prev, [num]: value }));
    
    if (num === 5) {
      setCurrentScreen('loading');
      setTimeout(() => {
        calculateProfile({ ...answers, [num]: value });
      }, 2000);
    } else {
      goToQuestion(num + 1);
    }
  }, [answers, goToQuestion]);

  const calculateProfile = useCallback((allAnswers: Answers) => {
    let profile: ProfileKey = 'A';
    
    if ((allAnswers[3] === 'si_mucho' || allAnswers[3] === 'si_leve') && 
        (allAnswers[5] === '50_59' || allAnswers[5] === '60_plus')) {
      profile = 'C';
    } else if (allAnswers[2] === 'hambre') {
      profile = 'D';
    } else if (allAnswers[2] === 'corazon') {
      profile = 'B';
    } else if (allAnswers[2] === 'pensamientos' || allAnswers[4] === 'si_bucle') {
      profile = 'A';
    }

    setCurrentProfile(profile);
    setCurrentScreen('result');
  }, []);

  const sendEmail = useCallback(async () => {
    if (!email.includes('@')) {
      alert('Email inválido');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          profile: currentProfile,
          answers
        })
      });

      if (response.ok) {
        setCurrentScreen('thanks');
      } else {
        setCurrentScreen('thanks');
      }
    } catch {
      setCurrentScreen('thanks');
    } finally {
      setIsSending(false);
    }
  }, [email, currentProfile, answers]);

  const resetQuiz = useCallback(() => {
    setAnswers({});
    setCurrentProfile('A');
    setEmail('');
    setCurrentScreen('welcome');
  }, []);

  const p = profiles[currentProfile];

  return (
    <div className="quiz-container">
      <div className="quiz-screen">
        
        {/* BIENVENIDA */}
        {currentScreen === 'welcome' && (
          <div className="quiz-card">
            <h1 className="quiz-h1">Si te despiertas siempre a las 3AM...</h1>
            <p className="quiz-subtitle">no es coincidencia, no es tu culpa y definitivamente no es algo que debas tolerar por siempre.</p>
            
            <div className="quiz-highlight-box">
              <p>En los próximos 5 minutos descubrirás la CAUSA EXACTA de tus despertares y una solución personalizada que funciona</p>
            </div>

            <button className="quiz-btn quiz-btn-primary" onClick={() => goToQuestion(1)}>
              🎯 Descubrir Mi Diagnóstico Ahora
            </button>
          </div>
        )}

        {/* PREGUNTA 1 */}
        {currentScreen === 'q1' && (
          <div className="quiz-card">
            <div className="quiz-progress-container">
              <div className="quiz-progress-bar">
                <div className="quiz-progress-fill" style={{ width: '20%' }}></div>
              </div>
              <div className="quiz-progress-text">Pregunta 1 de 5 • 20% Completado</div>
            </div>
            <h1 className="quiz-h1">¿A qué hora exacta despiertas?</h1>
            <p className="quiz-subtitle">La precisión es clave para identificar tu patrón específico</p>
            
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(1, 'entre_2_3')}>
              🌙 Entre 2:00 y 3:00 AM
              <span className="quiz-span">El horario clásico de despertar</span>
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(1, '3_4')}>
              🌙 Entre 3:00 y 4:00 AM
              <span className="quiz-span">La hora pico de crisis nocturna</span>
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(1, '4_5')}>
              🌙 Entre 4:00 y 5:00 AM
              <span className="quiz-span">Madrugada profunda, difícil volver a dormir</span>
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(1, 'otras')}>
              🌙 Hora variable
              <span className="quiz-span">No sigue patrón, varía cada noche</span>
            </button>
          </div>
        )}

        {/* PREGUNTA 2 */}
        {currentScreen === 'q2' && (
          <div className="quiz-card">
            <div className="quiz-progress-container">
              <div className="quiz-progress-bar">
                <div className="quiz-progress-fill" style={{ width: '40%' }}></div>
              </div>
              <div className="quiz-progress-text">Pregunta 2 de 5 • 40% Completado</div>
            </div>
            <h1 className="quiz-h1">¿Cuál es tu PRIMER síntoma al despertar?</h1>
            <p className="quiz-subtitle">Ese instinto inicial revela la raíz del problema</p>
            
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(2, 'pensamientos')}>
              🧠 Mente acelerada
              <span className="quiz-span">Pensamientos disparados, lista infinita de preocupaciones, difícil parar</span>
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(2, 'corazon')}>
              💓 Corazón acelerado
              <span className="quiz-span">Palpitaciones fuertes, ansiedad física, sensación de peligro</span>
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(2, 'calor')}>
              🔥 Onda de calor
              <span className="quiz-span">Calor intenso, sudor, necesidad de cambiar de ropa</span>
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(2, 'hambre')}>
              🍔 Sensación de vacío
              <span className="quiz-span">Hambre, inquietud, mareo leve, necesidad de comer algo</span>
            </button>
          </div>
        )}

        {/* PREGUNTA 3 */}
        {currentScreen === 'q3' && (
          <div className="quiz-card">
            <div className="quiz-progress-container">
              <div className="quiz-progress-bar">
                <div className="quiz-progress-fill" style={{ width: '60%' }}></div>
              </div>
              <div className="quiz-progress-text">Pregunta 3 de 5 • 60% Completado</div>
            </div>
            <h1 className="quiz-h1">¿Experimentas calor o sudoración nocturna?</h1>
            <p className="quiz-subtitle">Este síntoma es especialmente revelador</p>
            
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(3, 'si_mucho')}>
              🔥 Sí, muchísimo
              <span className="quiz-span">Cambio completo de ropa, sábanas mojadas, totalmente incómodo</span>
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(3, 'si_leve')}>
              🌡️ Sí, pero moderado
              <span className="quiz-span">Transpiro, incómodo pero manejable</span>
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(3, 'no')}>
              ❌ No, ese no es mi problema
              <span className="quiz-span">Mi síntoma principal es diferente</span>
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(3, 'frio')}>
              ❄️ Al contrario, siento frío
              <span className="quiz-span">Frío y escalofríos, necesito más abrigo</span>
            </button>
          </div>
        )}

        {/* PREGUNTA 4 */}
        {currentScreen === 'q4' && (
          <div className="quiz-card">
            <div className="quiz-progress-container">
              <div className="quiz-progress-bar">
                <div className="quiz-progress-fill" style={{ width: '80%' }}></div>
              </div>
              <div className="quiz-progress-text">Pregunta 4 de 5 • 80% Completado</div>
            </div>
            <h1 className="quiz-h1">¿Tu mente se llena de pensamientos?</h1>
            <p className="quiz-subtitle">La actividad mental al despertar es crucial para entenderte</p>
            
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(4, 'si_bucle')}>
              🔁 Sí, bucle infinito
              <span className="quiz-span">Mismo pensamiento una y otra vez, imposible parar</span>
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(4, 'si_lista')}>
              📋 Sí, avalancha de tareas
              <span className="quiz-span">Todo lo que debo hacer hoy explota en mi mente</span>
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(4, 'si_ansiedad')}>
              😰 Sí, puro nerviosismo
              <span className="quiz-span">Ansiedad sin razón específica, sensación de peligro</span>
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(4, 'no_mente')}>
              ✓ No, es puramente físico
              <span className="quiz-span">Mi mente está quieta, es mi cuerpo el que se despierta</span>
            </button>
          </div>
        )}

        {/* PREGUNTA 5 */}
        {currentScreen === 'q5' && (
          <div className="quiz-card">
            <div className="quiz-progress-container">
              <div className="quiz-progress-bar">
                <div className="quiz-progress-fill" style={{ width: '100%' }}></div>
              </div>
              <div className="quiz-progress-text">Pregunta 5 de 5 • 100% Completado</div>
            </div>
            <h1 className="quiz-h1">¿Cuántos años tienes?</h1>
            <p className="quiz-subtitle">La edad revela cambios biológicos específicos en tu cuerpo</p>
            
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(5, '30_39')}>
              👤 30 a 39 años
              <span className="quiz-span">Adulto joven con vida activa</span>
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(5, '40_49')}>
              👤 40 a 49 años
              <span className="quiz-span">Cambios biológicos comienzan</span>
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(5, '50_59')}>
              👤 50 a 59 años
              <span className="quiz-span">Cambios hormonales intensos (perimenopausia/menopausia)</span>
            </button>
            <button className="quiz-btn quiz-btn-primary" onClick={() => answerQuestion(5, '60_plus')}>
              👤 60 años o más
              <span className="quiz-span">Nueva fase de vida con ritmos diferentes</span>
            </button>
          </div>
        )}

        {/* CARGANDO */}
        {currentScreen === 'loading' && (
          <div className="quiz-card">
            <div style={{ textAlign: 'center' }}>
              <div className="quiz-spinner"></div>
              <h2 className="quiz-h2">Analizando tu perfil...</h2>
              <p style={{ color: 'var(--quiz-text-muted)', fontSize: '16px' }}>Procesando tus patrones de sueño con IA</p>
            </div>
          </div>
        )}

        {/* RESULTADO */}
        {currentScreen === 'result' && (
          <div className="quiz-card">
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <span className="quiz-result-badge">Perfil {currentProfile}</span>
            </div>
            <h2 className="quiz-h2" style={{ textAlign: 'center', marginBottom: '15px' }}>{p.name}</h2>
            <p style={{ textAlign: 'center', marginBottom: '45px', fontSize: '17px' }}>{p.desc}</p>

            <div className="quiz-result-box">
              <h3>🔍 Causa Específica Identificada</h3>
              <p>{p.cause}</p>
            </div>

            <div className="quiz-result-box">
              <h3>💡 Lo Que Esto Significa Para Ti</h3>
              <p>{p.meaning}</p>
            </div>

            <div className="quiz-highlight-box">
              <p style={{ margin: 0, marginBottom: '10px' }}>🎧 Tu Audio Personalizado: <strong>{p.audio}</strong></p>
              <p style={{ margin: 0, fontSize: '14px', color: '#34d399' }}>✅ 100% GRATIS • Sin compromiso</p>
            </div>

            <button className="quiz-btn quiz-btn-primary" onClick={() => setCurrentScreen('email')}>
              📧 Recibir Mi Diagnóstico GRATIS
            </button>
          </div>
        )}

        {/* EMAIL */}
        {currentScreen === 'email' && (
          <div className="quiz-card">
            <div className="quiz-highlight-box" style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.2) 0%, rgba(52,211,153,0.08) 100%)', borderLeft: '4px solid #34d399' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>✅ Tu diagnóstico es <strong>100% GRATIS</strong></p>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#a0a0a0' }}>Sin pagos ocultos • Sin compromiso</p>
            </div>

            <h2 className="quiz-h2" style={{ textAlign: 'center', marginTop: '20px' }}>Tu Diagnóstico Está Listo</h2>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--quiz-primary)', fontWeight: 600, fontSize: '17px' }}>{p.audio}</p>

            <p style={{ marginBottom: '20px', color: 'var(--quiz-text-muted)', textAlign: 'center' }}>
              Ingresa tu email para recibir tu diagnóstico completo + audio + protocolo personalizado
            </p>

            <input 
              type="email" 
              className="quiz-input" 
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <button 
              className="quiz-btn quiz-btn-primary" 
              onClick={sendEmail}
              disabled={isSending}
            >
              {isSending ? '⏳ Enviando...' : '📧 Recibir Mi Diagnóstico GRATIS'}
            </button>
            <button className="quiz-btn quiz-btn-secondary" onClick={() => setCurrentScreen('upsell')}>
              Ver opción premium (opcional)
            </button>
          </div>
        )}

        {/* UPSELL */}
        {currentScreen === 'upsell' && (
          <div className="quiz-card">
            <div className="quiz-highlight-box" style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.15) 0%, rgba(52,211,153,0.05) 100%)' }}>
              <p style={{ margin: 0, color: '#34d399' }}>✅ Tu diagnóstico gratuito ya está siendo enviado a tu email</p>
            </div>

            <h2 className="quiz-h2" style={{ textAlign: 'center', marginTop: '30px', marginBottom: '10px' }}>¿Quieres resultados permanentes?</h2>
            <p style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--quiz-text-muted)' }}>El diagnóstico te ayuda HOY. PRO te ayuda TODAS las noches.</p>

            <div className="quiz-result-box">
              <p style={{ marginBottom: '14px' }}><span className="quiz-check-icon">✓</span><strong>6 audios completos</strong> — para cada tipo de despertar</p>
              <p style={{ marginBottom: '14px' }}><span className="quiz-check-icon">✓</span><strong>Protocolo completo</strong> — solución permanente</p>
              <p style={{ marginBottom: '14px' }}><span className="quiz-check-icon">✓</span><strong>Acceso de por vida</strong> — un solo pago</p>
              <p><span className="quiz-check-icon">✓</span><strong>Soporte prioritario</strong> — ayuda personal</p>
            </div>

            <div className="quiz-price-tag">$3.90</div>
            <p className="quiz-price-subtitle">Un solo pago • Acceso permanente</p>

            <button className="quiz-btn quiz-btn-primary" onClick={() => window.location.href = 'https://vuelveadormir.space.z.ai'}>
              🚀 Quiero Acceso Completo
            </button>
            <button className="quiz-btn quiz-btn-secondary" onClick={() => setCurrentScreen('thanks')}>
              Continuar con mi diagnóstico GRATIS
            </button>
          </div>
        )}

        {/* GRACIAS */}
        {currentScreen === 'thanks' && (
          <div className="quiz-card">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '70px', marginBottom: '30px' }}>✨</div>
              <h2 className="quiz-h2">¡Tu Diagnóstico Está en Camino!</h2>
              <p style={{ marginBottom: '30px', fontSize: '17px', lineHeight: '1.8' }}>Tu análisis personalizado + audio + protocolo completo está siendo enviado a tu email.</p>
              
              <div className="quiz-highlight-box">
                <p>📬 Revisa tu bandeja de entrada en los próximos 2-3 minutos (incluida la carpeta Spam)</p>
              </div>

              <button className="quiz-btn quiz-btn-primary" onClick={resetQuiz} style={{ marginTop: '30px' }}>
                🔄 Hacer el Quiz Nuevamente
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
