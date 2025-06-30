import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Brain, MessageCircle, Calendar, Mail, FileText, BarChart3, Star, ArrowRight, Sparkles, Target, Clock, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ToolsBanner } from "@/components/ToolsBanner";

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Command Center",
      description: "Your personal AI that understands context and executes complex tasks across all your tools."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Calendar",
      description: "Never miss a meeting. AI automatically schedules, reschedules, and optimizes your time."
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Automation",
      description: "Draft, send, and manage emails with AI that learns your communication style."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Notion Integration",
      description: "Seamlessly sync tasks, notes, and projects with your existing Notion workspace."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Get insights into your productivity patterns and optimization opportunities."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal Tracking",
      description: "Set objectives and let AI help you stay on track with smart reminders and progress updates."
    }
  ];

  const benefits = [
    "Complete AI assistant access",
    "Unified command dashboard",
    "Advanced automation workflows",
    "Gmail & Calendar sync",
    "Notion workspace integration",
    "Real-time analytics",
    "Priority support",
    "30-day money-back guarantee"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-slate-800 overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-150"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-40 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-1/4 w-6 h-6 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
        <div className="absolute top-1/2 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-150"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-emerald-700 bg-clip-text text-transparent">
                  OPTIO
                </span>
                <div className="text-xs text-slate-500 font-medium">AI Command Center</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-blue-200 text-blue-700 hover:bg-blue-50 font-medium"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          </nav>
        </header>

        {/* Hero Section - Centered Layout */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <Badge className="mb-8 bg-gradient-to-r from-blue-100 to-emerald-100 text-blue-700 border-blue-200 px-6 py-2 text-sm font-medium">
              <Zap className="w-4 h-4 mr-2" />
              The Future of Productivity is Here
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Stop Managing.
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Start Commanding.
              </span>
            </h1>
            
            <p className="text-2xl text-slate-600 mb-12 leading-relaxed max-w-4xl mx-auto">
              The only AI assistant that actually gets things done. Connect all your tools, 
              speak naturally, and watch as complex workflows execute themselves.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-12 py-8 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => navigate("/auth")}
              >
                Get Started Now
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-12 py-8 text-xl font-medium"
              >
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-12 text-base text-slate-500">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>2-minute Setup</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Banner */}
        <ToolsBanner />

        {/* Features Grid */}
        <section className="container mx-auto px-6 py-20 bg-white/50 backdrop-blur-sm rounded-3xl mx-4 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              One AI. Infinite Possibilities.
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Connect your favorite tools and let AI handle the complexity while you focus on what matters most.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-slate-800 text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Social Proof */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-slate-500 text-lg mb-8">Trusted by 10,000+ professionals worldwide</p>
            <div className="flex justify-center items-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
              <span className="text-slate-600 ml-2 font-semibold">4.9 out of 5</span>
            </div>
          </div>

          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-emerald-50 border-blue-200">
            <CardContent className="p-12 text-center">
              <blockquote className="text-2xl md:text-3xl text-slate-700 mb-8 italic font-light">
                "Optio doesn't just save time – it gives me superpowers. I can now handle tasks that used to take hours with just a simple conversation."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                  SC
                </div>
                <div>
                  <cite className="text-blue-700 font-semibold not-italic">Sarah Chen</cite>
                  <p className="text-slate-500">Founder, TechFlow</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Pricing Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Transform Your Workflow Today
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join thousands of professionals who've already upgraded their productivity with AI
            </p>
          </div>

          <Card className="max-w-lg mx-auto bg-white shadow-2xl border-2 border-blue-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
            <CardHeader className="text-center pt-8">
              <Badge className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white mb-4 self-center">
                ⚡ Most Popular
              </Badge>
              <CardTitle className="text-3xl text-slate-800">Optio Pro</CardTitle>
              <div className="text-6xl font-bold text-slate-800 mt-6">
                $19
                <span className="text-xl text-slate-500 font-normal">/month</span>
              </div>
              <CardDescription className="text-slate-600 mt-3 text-lg">
                Everything you need to supercharge your productivity
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8 pb-8">
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => navigate("/auth")}
              >
                Subscribe Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="text-center space-y-2">
                <p className="text-slate-500 text-sm">
                  ✓ Instant access • ✓ Cancel anytime
                </p>
                <p className="text-slate-400 text-xs">
                  30-day money-back guarantee
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"></div>
              </div>
              <span className="text-lg font-semibold text-slate-700">OPTIO AI Command Center</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2024 Optio. Empowering the next generation of productivity.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
