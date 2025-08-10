import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  BarChart3,
  Target,
  TrendingUp,
  Users,
  Shield,
  Star,
  Check,
  ArrowRight,
  Zap,
  Database,
  Calendar,
  Activity
} from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  duration: string;
  features: string[];
  isPopular?: boolean;
  stripeLink: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  title, 
  price, 
  originalPrice, 
  discount, 
  duration, 
  features, 
  isPopular, 
  stripeLink 
}) => {
  return (
    <Card className={`relative bg-card border-border ${isPopular ? 'ring-2 ring-primary' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            Mais Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center p-6">
        <CardTitle className="text-xl text-card-foreground mb-2">{title}</CardTitle>
        <div className="space-y-2">
          {originalPrice && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>
              {discount && <Badge variant="destructive" className="text-xs">{discount}</Badge>}
            </div>
          )}
          <div className="text-3xl font-bold text-primary">{price}</div>
          <div className="text-sm text-muted-foreground">{duration}</div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <ul className="space-y-3 mb-6">
          {features.map((feature: string, index: number) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-card-foreground text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <a href={stripeLink} className="block w-full">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Escolher Plano
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </a>
      </CardContent>
    </Card>
  );
};

interface FeatureCardProps {
  Icon: React.ComponentType<any>;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, description }) => (
  <Card className="bg-card border-border">
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-6 h-6 text-primary" />
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const TestimonialCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Card className="bg-card border-border">
    <CardContent className="p-6">
      {children}
    </CardContent>
  </Card>
);

export default function Landing() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.log("User not logged in");
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is logged in, show different content based on status
  if (currentUser) {
    const userStatus = currentUser.status || 'pending';
    
    if (userStatus === 'approved') {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="bg-card border-border max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <Check className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-card-foreground mb-2">
                Bem-vindo, {currentUser.full_name || currentUser.email}!
              </h2>
              <p className="text-muted-foreground mb-6">
                Sua conta foi aprovada. Acesse o dashboard para começar a usar a plataforma.
              </p>
              <Link to={createPageUrl("Dashboard")}>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Acessar Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card border-border max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-card-foreground mb-2">
              Conta em Análise
            </h2>
            <p className="text-muted-foreground mb-6">
              Obrigado por se inscrever! Sua conta está sendo analisada e você receberá um email quando for aprovada.
            </p>
            <Button
              onClick={() => User.logout?.()}
              variant="outline"
              className="w-full border-border text-foreground hover:bg-muted/20"
            >
              Fazer Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Landing page for non-logged users
  const pricingPlans = [
    {
      title: "Plano Mensal",
      price: "R$ 37",
      duration: "por mês",
      stripeLink: "https://buy.stripe.com/test_6oE9Ar2bP8Tu7zW8ww",
      features: [
        "Acesso completo ao sistema",
        "Backtesting ilimitado",
        "Análise H2H avançada",
        "Gestão de bankroll",
        "Upload de dados",
        "Suporte por email"
      ]
    },
    {
      title: "Plano Trimestral",
      price: "R$ 97",
      originalPrice: "R$ 111",
      discount: "-13%",
      duration: "por 3 meses",
      stripeLink: "https://buy.stripe.com/test_5kA4gX09Hbq1dfO3cd",
      isPopular: true,
      features: [
        "Acesso completo ao sistema",
        "Backtesting ilimitado",
        "Análise H2H avançada",
        "Gestão de bankroll",
        "Upload de dados",
        "Suporte prioritário",
        "2 semanas grátis"
      ]
    },
    {
      title: "Plano Anual",
      price: "R$ 297",
      originalPrice: "R$ 444",
      discount: "-33%",
      duration: "por 12 meses",
      stripeLink: "https://buy.stripe.com/test_eVa5kV09HgQCebKaEF",
      features: [
        "Acesso completo ao sistema",
        "Backtesting ilimitado",
        "Análise H2H avançada",
        "Gestão de bankroll",
        "Upload de dados",
        "Suporte prioritário",
        "4 meses grátis",
        "Consultoria estratégica"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Análise Profissional de
            <span className="text-primary"> Apostas Esportivas</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Transforme seus dados em estratégias vencedoras com nossa plataforma completa 
            de backtesting, análise H2H e gestão de bankroll.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Começar Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted/20">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Funcionalidades Principais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              Icon={BarChart3}
              title="Sistema de Backtesting"
              description="Teste suas estratégias com dados históricos e obtenha métricas detalhadas de performance."
            />
            <FeatureCard
              Icon={Users}
              title="Análise Head-to-Head"
              description="Analise confrontos diretos entre equipes com estatísticas avançadas e padrões históricos."
            />
            <FeatureCard
              Icon={Target}
              title="Gestão de Bankroll"
              description="Gerencie suas bancas de forma profissional com controle de apostas e relatórios detalhados."
            />
            <FeatureCard
              Icon={Database}
              title="Upload de Dados"
              description="Importe seus próprios dados de jogos, rankings e estatísticas de forma simples."
            />
            <FeatureCard
              Icon={Activity}
              title="Dashboard Avançado"
              description="Visualize todas suas métricas e performance em um painel intuitivo e completo."
            />
            <FeatureCard
              Icon={Calendar}
              title="Jogos Diários"
              description="Acesse informações sobre jogos do dia com odds e estatísticas atualizadas."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">
            Escolha Seu Plano
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Comece sua jornada profissional nas apostas esportivas com nossos planos flexíveis.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                price={plan.price}
                originalPrice={plan.originalPrice}
                discount={plan.discount}
                duration={plan.duration}
                features={plan.features}
                isPopular={plan.isPopular}
                stripeLink={plan.stripeLink}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            O Que Nossos Usuários Dizem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard>
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-card-foreground mb-4">
                "O sistema de backtesting mudou completamente minha abordagem. 
                Agora posso testar estratégias antes de apostar dinheiro real."
              </p>
              <div className="text-sm text-muted-foreground">— Carlos S.</div>
            </TestimonialCard>
            
            <TestimonialCard>
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-card-foreground mb-4">
                "A análise H2H é fantástica. Consigo identificar padrões que 
                antes passavam despercebidos."
              </p>
              <div className="text-sm text-muted-foreground">— Marina L.</div>
            </TestimonialCard>
            
            <TestimonialCard>
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-card-foreground mb-4">
                "Gestão de bankroll profissional finalmente ao alcance. 
                Meus resultados melhoraram significativamente."
              </p>
              <div className="text-sm text-muted-foreground">— Pedro M.</div>
            </TestimonialCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
            Pronto para Levar Suas Apostas para o Próximo Nível?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Junte-se à nossa comunidade de apostadores profissionais e comece a transformar seus dados em lucro.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Experimente Agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
