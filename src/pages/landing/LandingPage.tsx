import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../utils/constants';

export const LandingPage: React.FC = () => {
  const plans = [
    {
      name: 'Básico',
      price: 99.90,
      calculations: 50,
      features: [
        'Cálculo de CBS, IBS e IS',
        'Histórico de cálculos',
        'Suporte por email',
        '50 cálculos por mês',
        'Acesso aos dados abertos',
      ],
      popular: false,
      planId: 'BASIC',
    },
    {
      name: 'Profissional',
      price: 299.90,
      calculations: 200,
      features: [
        'Tudo do plano Básico',
        '200 cálculos por mês',
        'Exportação de relatórios',
        'API de integração',
        'Suporte prioritário',
      ],
      popular: true,
      planId: 'PROFESSIONAL',
    },
    {
      name: 'Empresarial',
      price: 999.90,
      calculations: -1,
      features: [
        'Tudo do plano Profissional',
        'Cálculos ilimitados',
        'Suporte 24/7',
        'Gestor de conta dedicado',
        'SLA garantido',
        'Treinamento personalizado',
      ],
      popular: false,
      planId: 'ENTERPRISE',
    },
  ];

  const benefits = [
    {
      icon: '⚡',
      title: 'Cálculo Rápido',
      description: 'Calcule CBS, IBS e IS em segundos com precisão garantida',
    },
    {
      icon: '📊',
      title: 'Relatórios Completos',
      description: 'Exporte relatórios detalhados para suas análises tributárias',
    },
    {
      icon: '🔒',
      title: 'Segurança Total',
      description: 'Seus dados protegidos com criptografia e backup automático',
    },
    {
      icon: '📈',
      title: 'Histórico Completo',
      description: 'Acesse todo histórico de cálculos a qualquer momento',
    },
    {
      icon: '🤝',
      title: 'Suporte Dedicado',
      description: 'Equipe especializada pronta para ajudar você',
    },
    {
      icon: '🔄',
      title: 'Atualizações Automáticas',
      description: 'Sistema sempre atualizado com as últimas regulamentações',
    },
  ];

  const faqs = [
    {
      question: 'Como funciona o período de teste?',
      answer: 'Ao se cadastrar, você recebe 5 cálculos grátis para testar todas as funcionalidades. Após usar os 5 cálculos, você precisa fazer upgrade para um plano pago.',
    },
    {
      question: 'Posso mudar de plano depois?',
      answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento no painel de assinaturas.',
    },
    {
      question: 'Os dados estão seguros?',
      answer: 'Sim. Utilizamos criptografia SSL, backup automático e isolamento total de dados entre empresas.',
    },
    {
      question: 'Qual a diferença entre os planos?',
      answer: 'A principal diferença está no número de cálculos mensais e recursos adicionais como API, relatórios e suporte.',
    },
    {
      question: 'Posso cancelar a qualquer momento?',
      answer: 'Sim, você pode cancelar sua assinatura a qualquer momento sem multas ou taxas adicionais.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header/Navbar */}
      <nav className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Calculadora Tributária
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to={ROUTES.LOGIN}>
                <Button variant="secondary">Entrar</Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button variant="primary">Criar Conta Grátis</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white sm:text-6xl">
            Simplifique seus cálculos
            <span className="block text-blue-600 dark:text-blue-400">tributários CBS, IBS e IS</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Plataforma completa para calcular tributos do novo sistema tributário.
            Economize tempo e evite erros com nossa solução.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to={ROUTES.REGISTER}>
              <Button variant="primary" className="text-lg px-8 py-4">
                Começar com 5 cálculos grátis
              </Button>
            </Link>
            <a href="#plans">
              <Button variant="secondary" className="text-lg px-8 py-4">
                Ver Planos
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Não precisa cartão de crédito • Teste sem compromisso
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Por que escolher nossa plataforma?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Recursos pensados para facilitar sua rotina tributária
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Planos e Preços
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Escolha o plano ideal para o tamanho do seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.planId}
                className={`relative rounded-lg p-8 bg-white dark:bg-gray-900 border-2 ${
                  plan.popular
                    ? 'border-blue-500 shadow-2xl scale-105'
                    : 'border-gray-200 dark:border-gray-700 shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                      R$ {plan.price.toFixed(2)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">/mês</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {plan.calculations === -1
                      ? 'Cálculos ilimitados'
                      : `${plan.calculations} cálculos/mês`}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={ROUTES.REGISTER}>
                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    Começar Agora
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              >
                <summary className="flex justify-between items-center cursor-pointer p-6 font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                  <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para simplificar seus cálculos tributários?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Comece agora com 5 cálculos grátis. Não precisa cartão de crédito.
          </p>
          <Link to={ROUTES.REGISTER}>
            <Button
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
            >
              Começar Teste Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Calculadora Tributária</h3>
              <p className="text-sm">
                Simplifique seus cálculos de CBS, IBS e IS com nossa plataforma automatizada.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#plans" className="hover:text-white">Planos e Preços</a></li>
                <li><Link to={ROUTES.REGISTER} className="hover:text-white">Começar Grátis</Link></li>
                <li><a href="#benefits" className="hover:text-white">Funcionalidades</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
                <li><a href="mailto:suporte@exemplo.com" className="hover:text-white">Contato</a></li>
                <li><a href="#" className="hover:text-white">Documentação</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; 2025 Calculadora Tributária. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
