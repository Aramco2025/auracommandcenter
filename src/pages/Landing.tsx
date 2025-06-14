
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Brain, MessageCircle, Calendar, Mail, FileText, BarChart3, Star, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Conversational AI",
      description: "Ask anything, get it done. Powered by GPT-4o for intelligent command processing."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Calendar Management",
      description: "Book meetings, check schedules, and manage your time effortlessly."
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Integration",
      description: "Send emails, check inbox, and manage communications seamlessly."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Notion Sync",
      description: "Create tasks, update databases, and manage your workspace."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Crystal-clear view of your business metrics and performance."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Smart Memory",
      description: "Optio remembers patterns and acts on your preferences."
    }
  ];

  const benefits = [
    "Full access to the Optio chat assistant",
    "Command Center dashboard",
    "Weekly performance reports",
    "Gmail & Google Calendar integration",
    "Notion workspace sync",
    "All future updates",
    "30-day money-back guarantee"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center animate-glow">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                OPTIO
              </span>
            </div>
            <Button 
              variant="outline" 
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Command Center
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            Your AI Super Assistant
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Manage operations. Track performance. Move like a machine, think like a visionary.
            <span className="block mt-2 text-purple-300">Slash 60% of your admin with conversational AI.</span>
          </p>

          <div className="flex justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
              onClick={() => navigate("/auth")}
            >
              Activate Optio Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Professional Business Image */}
          <div className="relative mx-auto w-80 h-80 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse opacity-20"></div>
            <img 
              src="/lovable-uploads/738600bd-3503-4de0-8624-3122ad4ed9dd.png"
              alt="Professional Business Leader"
              className="w-full h-full object-cover rounded-full border-4 border-purple-500/30 shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent rounded-full"></div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            What Optio Does
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to supercharge your productivity
            </p>
          </div>

          <Card className="max-w-lg mx-auto bg-gradient-to-br from-gray-800 to-gray-900 border-purple-500/30 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Badge className="bg-purple-500 text-white">Most Popular</Badge>
              </div>
              <CardTitle className="text-3xl text-white">Optio Pro</CardTitle>
              <div className="text-5xl font-bold text-white mt-4">
                £60
                <span className="text-xl text-gray-400 font-normal">/month</span>
              </div>
              <CardDescription className="text-gray-300 mt-2">
                Your complete AI command center
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg"
                onClick={() => navigate("/auth")}
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <p className="text-center text-gray-400 text-sm">
                30-day money-back guarantee • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Testimonial */}
        <section className="container mx-auto px-6 py-20">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-2xl text-gray-300 mb-6 italic">
                "It's like hiring an ops team, strategist, and PA for the price of dinner."
              </blockquote>
              <cite className="text-purple-400 font-semibold">
                — Sarah Chen, Founder @ TechFlow
              </cite>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-300">OPTIO Command Center</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 Optio. Built for the AI-native leader.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
