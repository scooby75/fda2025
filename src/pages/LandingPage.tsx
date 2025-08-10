
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Target, 
  TrendingUp, 
  BarChart3, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Star,
  Trophy,
  Zap,
  MessageCircle,
  Brain,
  Database,
  ChevronRight,
  Play,
  Users,
  DollarSign
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showContactModal, setShowContactModal] = useState(false);
  const [authForm, setAuthForm] = useState<AuthFormData>({ email: '', password: '', fullName: '' });
  const [contactForm, setContactForm] = useState<ContactFormData>({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const features = [
    {
      icon: Brain,
      title: "IA Avançada",
      description: "Algoritmos de machine learning para análise preditiva de alta precisão"
    },
    {
      icon: BarChart3,
      title: "Backtesting Completo",
      description: "Teste suas estratégias com dados históricos reais de milhões de jogos"
    },
    {
      icon: Database,
      title: "Big Data Sports",
      description: "Base de dados massiva com estatísticas detalhadas de todas as ligas"
    },
    {
      icon: Target,
      title: "Gestão Inteligente",
      description: "Sistema avançado de gestão de bankroll com controle de risco automático"
    },
    {
      icon: Shield,
      title: "Análise em Tempo Real",
      description: "Monitoramento contínuo de oportunidades e alertas instantâneos"
    },
    {
      icon: TrendingUp,
      title: "ROI Maximizado",
      description: "Estratégias otimizadas para maximizar retornos e minimizar riscos"
    }
  ];

  const testimonials = [
    {
      name: "Carlos Eduardo",
      role: "Trader Profissional",
      content: "Em 6 meses consegui aumentar meu ROI em 280%. A plataforma é revolucionária!",
      rating: 5
    },
    {
      name: "Ana Paula",
      role: "Analista Quantitativa",
      content: "A qualidade dos dados e a precisão das análises superaram todas as expectativas.",
      rating: 5
    },
    {
      name: "Roberto Silva",
      role: "Investidor",
      content: "Interface intuitiva e resultados consistentes. Finalmente encontrei uma solução completa.",
      rating: 5
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "R$ 97",
      period: "/mês",
      description: "Perfeito para iniciantes",
      features: [
        "Análises básicas de IA",
        "5 estratégias por mês",
        "Suporte via email",
        "Dados de 2 temporadas"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "R$ 197",
      period: "/mês", 
      description: "Para traders sérios",
      features: [
        "IA avançada ilimitada",
        "Estratégias ilimitadas",
        "Suporte prioritário",
        "Dados históricos completos",
        "Backtesting avançado",
        "Alertas em tempo real"
      ],
      popular: true
    },
    {
      name: "Elite",
      price: "R$ 497",
      period: "/mês",
      description: "Para especialistas",
      features: [
        "Tudo do Professional",
        "IA personalizada",
        "Consultoria individual",
        "API exclusiva",
        "Modelos customizados",
        "Suporte 24/7"
      ],
      popular: false
    }
  ];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
          options: {
            data: {
              full_name: authForm.fullName
            }
          }
        });
        if (error) throw error;
        alert('Verifique seu email para confirmar o cadastro!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password
        });
        if (error) throw error;
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      alert(error.message);
    }
    
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setContactForm({ name: '', email: '', message: '' });
    setShowContactModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Trophy className="w-10 h-10 text-emerald-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  SportAI Pro
                </span>
                <div className="text-xs text-slate-400">Powered by AI</div>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
                Recursos
              </a>
              <a href="#testimonials" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
                Depoimentos
              </a>
              <a href="#pricing" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
                Preços
              </a>
              <button 
                onClick={() => setShowContactModal(true)}
                className="text-slate-300 hover:text-emerald-400 transition-colors font-medium"
              >
                Contato
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/dashboard'}
                    className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Entrar
                  </Button>
                  <Button 
                    onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Começar Agora
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Inteligência Artificial para Apostas Esportivas
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Transforme Dados em
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Lucros Consistentes
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              A plataforma de IA mais avançada do Brasil para análise preditiva esportiva. 
              <strong className="text-emerald-400"> Aumente seu ROI em até 300%</strong> com nossa tecnologia revolucionária.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              {!user && (
                <Button 
                  size="lg" 
                  onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-lg px-10 py-4 rounded-full"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Começar Teste Gratuito
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowContactModal(true)}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-10 py-4 rounded-full"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Agendar Demo
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                14 dias grátis
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                Sem cartão de crédito
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                Cancele quando quiser
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-105 transition-transform">
              <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">
                +1M
              </div>
              <p className="text-slate-400 text-lg">Jogos Analisados</p>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">
                98.7%
              </div>
              <p className="text-slate-400 text-lg">Precisão da IA</p>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">
                +25K
              </div>
              <p className="text-slate-400 text-lg">Usuários Ativos</p>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">
                280%
              </div>
              <p className="text-slate-400 text-lg">ROI Médio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 mb-6">
              Tecnologia Avançada
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Recursos que Fazem a
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Diferença
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Tecnologia de ponta para maximizar seus resultados no mercado esportivo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300 group hover:scale-105">
                <CardHeader>
                  <div className="relative">
                    <feature.icon className="w-14 h-14 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                    <div className="absolute -inset-2 bg-emerald-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mb-6">
              Depoimentos
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                O que Nossos Clientes
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Estão Dizendo
              </span>
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-2xl md:text-3xl font-medium text-white mb-8 italic">
                  "{testimonials[currentSlide].content}"
                </blockquote>
                <div>
                  <p className="font-semibold text-white text-xl">{testimonials[currentSlide].name}</p>
                  <p className="text-slate-400 text-lg">{testimonials[currentSlide].role}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-gradient-to-r from-emerald-400 to-blue-400 scale-125' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 mb-6">
              Planos e Preços
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Escolha o Plano
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Perfeito para Você
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`bg-slate-800/50 border-slate-700 relative transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-105' 
                    : 'hover:border-slate-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2">
                      <Trophy className="w-4 h-4 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <p className="text-slate-400">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-slate-400 text-lg">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white' 
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                    onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                  >
                    {plan.popular ? (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Começar Agora
                      </>
                    ) : (
                      <>
                        Escolher Plano
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-500/10 via-slate-800/50 to-blue-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 blur-3xl"></div>
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Pronto para
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Revolucionar seus Resultados?
                </span>
              </h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Junte-se a milhares de traders que já transformaram suas apostas em investimentos lucrativos
              </p>
              {!user && (
                <Button 
                  size="lg" 
                  onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-xl px-12 py-6 rounded-full"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Começar Teste Gratuito
                  <ChevronRight className="w-6 h-6 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Trophy className="w-8 h-8 text-emerald-400" />
              <span className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                SportAI Pro
              </span>
            </div>
            <div className="flex space-x-8 text-sm text-slate-400">
              <a href="#" className="hover:text-emerald-400 transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacidade</a>
              <button 
                onClick={() => setShowContactModal(true)}
                className="hover:text-emerald-400 transition-colors"
              >
                Suporte
              </button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 text-center text-sm text-slate-500">
            © 2024 SportAI Pro. Todos os direitos reservados. Desenvolvido com IA avançada.
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-2xl">
              {authMode === 'login' ? 'Entrar na Plataforma' : 'Criar Conta Gratuita'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-6">
            {authMode === 'register' && (
              <div>
                <Label htmlFor="fullName" className="text-slate-300">Nome Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={authForm.fullName || ''}
                  onChange={(e) => setAuthForm({...authForm, fullName: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-slate-300">Senha</Label>
              <Input
                id="password"
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Processando...' : (authMode === 'login' ? 'Entrar' : 'Criar Conta')}
            </Button>
          </form>
          <div className="text-center mt-4">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-emerald-400 hover:underline"
            >
              {authMode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-2xl">Entre em Contato</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleContact} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-slate-300">Nome</Label>
              <Input
                id="name"
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-slate-300">Mensagem</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                rows={4}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
            >
              Enviar Mensagem
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
