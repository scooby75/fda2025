
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
  Users, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Star,
  Trophy,
  Zap,
  Globe,
  MessageCircle,
  Brain,
  Database,
  ChevronRight
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

export default function Landing() {
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
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const features = [
    {
      icon: Target,
      title: "Análise Preditiva",
      description: "Algoritmos avançados para predição de resultados esportivos com alta precisão"
    },
    {
      icon: BarChart3,
      title: "Backtesting Completo",
      description: "Teste suas estratégias com dados históricos reais e otimize seus resultados"
    },
    {
      icon: Database,
      title: "Big Data Esportivo",
      description: "Acesso a milhões de dados de jogos, estatísticas e tendências do mercado"
    },
    {
      icon: Brain,
      title: "IA Especializada",
      description: "Inteligência artificial treinada especificamente para apostas esportivas"
    },
    {
      icon: Shield,
      title: "Gestão de Risco",
      description: "Ferramentas avançadas para controle de bankroll e minimização de perdas"
    },
    {
      icon: TrendingUp,
      title: "ROI Otimizado",
      description: "Maximize seus retornos com estratégias comprovadas e análises precisas"
    }
  ];

  const testimonials = [
    {
      name: "João Silva",
      role: "Trader Esportivo",
      content: "Aumentei meu ROI em 300% nos últimos 6 meses usando a plataforma. Simplesmente revolucionário!",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Analista de Dados",
      content: "A qualidade dos dados e análises é impressionante. Ferramenta indispensável para profissionais.",
      rating: 5
    },
    {
      name: "Carlos Oliveira",
      role: "Investidor",
      content: "Interface intuitiva e resultados consistentes. Finalmente encontrei uma solução confiável.",
      rating: 5
    }
  ];

  const plans = [
    {
      name: "Básico",
      price: "R$ 97",
      period: "/mês",
      description: "Ideal para iniciantes",
      features: [
        "Análises básicas",
        "5 estratégias por mês",
        "Suporte por email",
        "Dados históricos limitados"
      ],
      popular: false
    },
    {
      name: "Profissional",
      price: "R$ 197",
      period: "/mês", 
      description: "Para traders sérios",
      features: [
        "Análises avançadas",
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
      description: "Para profissionais",
      features: [
        "Tudo do Profissional",
        "IA personalizada",
        "Consultoria 1:1",
        "API personalizada",
        "Modelos exclusivos",
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
    // Handle contact form submission
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setContactForm({ name: '', email: '', message: '' });
    setShowContactModal(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">BetAnalytics Pro</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Recursos</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Depoimentos</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Preços</a>
              <button 
                onClick={() => setShowContactModal(true)}
                className="text-muted-foreground hover:text-foreground transition-colors"
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
                    className="border-border text-foreground hover:bg-muted/20"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="border-border text-muted-foreground hover:bg-muted/20"
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                    className="border-border text-muted-foreground hover:bg-muted/20"
                  >
                    Entrar
                  </Button>
                  <Button 
                    onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Começar Agora
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge variant="outline" className="mb-6 border-primary/20 text-primary">
              <Zap className="w-4 h-4 mr-2" />
              Inteligência Artificial para Apostas Esportivas
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Transforme Dados em
              <span className="text-primary block">Vitórias Consistentes</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              A plataforma mais avançada do Brasil para análise preditiva e backtesting de estratégias esportivas. 
              <strong className="text-foreground"> Aumente seu ROI em até 300%</strong> com nossa IA especializada.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!user && (
                <Button 
                  size="lg" 
                  onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4"
                >
                  Começar Gratuitamente
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowContactModal(true)}
                className="border-border text-foreground hover:bg-muted/20 text-lg px-8 py-4"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Agendar Demo
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                7 dias grátis
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                Sem cartão de crédito
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                Cancele a qualquer momento
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Recursos que Fazem a Diferença
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tecnologia de ponta para maximizar seus resultados no mundo das apostas esportivas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors group">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-xl text-card-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">+500K</div>
              <p className="text-muted-foreground">Jogos Analisados</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">98.7%</div>
              <p className="text-muted-foreground">Precisão na Análise</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">+15K</div>
              <p className="text-muted-foreground">Usuários Ativos</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">300%</div>
              <p className="text-muted-foreground">ROI Médio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-muted/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              O que Nossos Clientes Dizem
            </h2>
            <p className="text-xl text-muted-foreground">
              Histórias reais de sucesso de quem já transformou seus resultados
            </p>
          </div>

          <div className="relative">
            <Card className="bg-card border-border max-w-4xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-2xl md:text-3xl font-medium text-card-foreground mb-6 italic">
                  "{testimonials[currentSlide].content}"
                </blockquote>
                <div>
                  <p className="font-semibold text-card-foreground text-lg">{testimonials[currentSlide].name}</p>
                  <p className="text-muted-foreground">{testimonials[currentSlide].role}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Planos para Todos os Perfis
            </h2>
            <p className="text-xl text-muted-foreground">
              Escolha o plano ideal para seu nível de investimento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`bg-card border-border relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl text-card-foreground">{plan.name}</CardTitle>
                  <p className="text-muted-foreground">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-card-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                    onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                  >
                    {plan.popular ? 'Começar Agora' : 'Escolher Plano'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            Pronto para Revolucionar Seus Resultados?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a milhares de traders que já transformaram suas apostas em investimentos lucrativos
          </p>
          {!user && (
            <Button 
              size="lg" 
              onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xl px-12 py-6"
            >
              Começar Teste Gratuito
              <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Trophy className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">BetAnalytics Pro</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-foreground transition-colors">Política de Privacidade</a>
              <button 
                onClick={() => setShowContactModal(true)}
                className="hover:text-foreground transition-colors"
              >
                Suporte
              </button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 BetAnalytics Pro. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              {authMode === 'login' ? 'Entrar na Plataforma' : 'Criar Conta Gratuita'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <Label htmlFor="fullName" className="text-card-foreground">Nome Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={authForm.fullName || ''}
                  onChange={(e) => setAuthForm({...authForm, fullName: e.target.value})}
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-card-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                className="bg-input border-border text-foreground"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-card-foreground">Senha</Label>
              <Input
                id="password"
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                className="bg-input border-border text-foreground"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Processando...' : (authMode === 'login' ? 'Entrar' : 'Criar Conta')}
            </Button>
          </form>
          <div className="text-center mt-4">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-primary hover:underline"
            >
              {authMode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Entre em Contato</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleContact} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-card-foreground">Nome</Label>
              <Input
                id="name"
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                className="bg-input border-border text-foreground"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-card-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="bg-input border-border text-foreground"
                required
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-card-foreground">Mensagem</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="bg-input border-border text-foreground"
                rows={4}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Enviar Mensagem
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
