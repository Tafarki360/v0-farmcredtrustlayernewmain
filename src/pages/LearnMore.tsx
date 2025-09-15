import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FarmCredLogo } from "@/components/FarmCredLogo";
import { FeatureCard } from "@/components/FeatureCard";
import { StatsCard } from "@/components/StatsCard";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Users, Shield, TrendingUp, Leaf, Building2, Briefcase, Star, Award, Target } from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";

const LearnMore = () => {
  const benefits = [
    "No collateral required for most loans",
    "Competitive interest rates based on trust scores",
    "Flexible repayment terms aligned with harvest cycles",
    "Digital platform accessible via mobile devices", 
    "Community-based verification system",
    "Agricultural insurance integration",
    "Real-time credit score monitoring",
    "Direct market access for produce sales"
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Register & Verify",
      description: "Create your profile with basic information and complete identity verification using NIN and BVN."
    },
    {
      step: "2", 
      title: "Build Trust Score",
      description: "Our algorithm evaluates your farming history, community standing, and agricultural potential."
    },
    {
      step: "3",
      title: "Apply for Credit",
      description: "Submit loan applications with transparent terms based on your personalized trust score."
    },
    {
      step: "4",
      title: "Get Funded",
      description: "Receive funds quickly through mobile money or bank transfer upon approval."
    }
  ];

  const trustFactors = [
    {
      icon: Users,
      title: "Community Verification",
      description: "Local cooperative leaders and fellow farmers vouch for your character and farming practices."
    },
    {
      icon: Leaf,
      title: "Agricultural Track Record",
      description: "Your farming history, crop yields, and land management practices are evaluated."
    },
    {
      icon: TrendingUp,
      title: "Financial Behavior",
      description: "Payment history, savings patterns, and responsible financial management boost your score."
    },
    {
      icon: Award,
      title: "Training & Education",
      description: "Participation in agricultural training programs demonstrates commitment to improvement."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5">
      {/* Header */}
      <div className="bg-background border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <FarmCredLogo size="md" />
          </div>
          <Link to="/portals">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8 space-y-16">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">How FarmCred Works</h1>
            <p className="text-xl text-muted-foreground">
              Discover how our innovative trust-based credit system is revolutionizing 
              agricultural finance across Nigeria, making credit accessible to farmers 
              who were previously excluded from the formal financial system.
            </p>
            <Link to="/portals">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Start Your Journey
              </Button>
            </Link>
          </div>
          <div className="relative">
            <img 
              src={heroImage} 
              alt="Farmers working together"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        {/* How It Works */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Simple 4-Step Process</h2>
            <p className="text-lg text-muted-foreground">
              Getting started with FarmCred is easy and straightforward
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <Card key={index} className="p-6 text-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Score Factors */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">What Makes Up Your Trust Score</h2>
            <p className="text-lg text-muted-foreground">
              Our comprehensive evaluation considers multiple factors to build a complete picture
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustFactors.map((factor, index) => (
              <FeatureCard 
                key={index}
                icon={factor.icon}
                title={factor.title}
                description={factor.description}
                benefits={[]}
              />
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose FarmCred</h2>
            <p className="text-lg text-muted-foreground">
              Experience the advantages of trust-based lending
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {benefits.slice(0, 4).map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {benefits.slice(4).map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg text-muted-foreground">
              See how we're transforming lives across Nigeria
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <StatsCard 
              icon={Users} 
              title="Active Farmers" 
              value="50,000+" 
              description="Farmers using our platform"
            />
            <StatsCard 
              icon={TrendingUp} 
              title="Loans Disbursed" 
              value="₦2.5B+" 
              description="Total credit provided"
            />
            <StatsCard 
              icon={Target} 
              title="Success Rate" 
              value="94%" 
              description="Loan repayment rate"
            />
            <StatsCard 
              icon={Star} 
              title="Cooperatives" 
              value="200+" 
              description="Partner organizations"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6 py-12 bg-primary/5 rounded-xl">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of farmers who have already transformed their agricultural 
            operations with FarmCred's trust-based credit system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/portals">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Start Application
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
