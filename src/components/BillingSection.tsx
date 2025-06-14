
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { Check, CreditCard, Settings } from "lucide-react";

export const BillingSection = () => {
  const { subscription, loading, createCheckout, openCustomerPortal } = useSubscription();
  const { toast } = useToast();
  const [isAnnual, setIsAnnual] = useState(false);

  const handleSubscribe = async () => {
    try {
      await createCheckout(isAnnual ? 'annual' : 'monthly');
      toast({
        title: "Redirecting to checkout",
        description: "Opening Stripe checkout in a new tab...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start checkout",
        variant: "destructive",
      });
    }
  };

  const handleManageBilling = async () => {
    try {
      await openCustomerPortal();
      toast({
        title: "Opening billing portal",
        description: "Redirecting to Stripe customer portal...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to open billing portal",
        variant: "destructive",
      });
    }
  };

  const monthlyPrice = 60;
  const annualPrice = 600; // £50/month when billed annually
  const savings = monthlyPrice * 12 - annualPrice;

  return (
    <div className="space-y-6">
      {subscription.subscribed ? (
        <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-800 dark:text-green-200">
                  Optio Pro Active
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  {subscription.subscription_tier} • {subscription.billing_cycle} billing
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscription.subscription_end && (
                <p className="text-sm text-muted-foreground">
                  Next billing: {new Date(subscription.subscription_end).toLocaleDateString()}
                </p>
              )}
              <Button 
                onClick={handleManageBilling} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${!isAnnual ? 'font-semibold' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              aria-label="Toggle annual billing"
            />
            <span className={`text-sm ${isAnnual ? 'font-semibold' : 'text-muted-foreground'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge variant="secondary" className="ml-2">
                Save £{savings}
              </Badge>
            )}
          </div>

          {/* Pricing Card */}
          <Card className="max-w-lg mx-auto border-purple-200 dark:border-purple-800">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Badge className="bg-purple-500 text-white">Most Popular</Badge>
              </div>
              <CardTitle className="text-3xl">Optio Pro</CardTitle>
              <div className="text-5xl font-bold mt-4">
                £{isAnnual ? Math.round(annualPrice / 12) : monthlyPrice}
                <span className="text-xl text-muted-foreground font-normal">
                  /month
                </span>
              </div>
              {isAnnual && (
                <p className="text-sm text-muted-foreground">
                  Billed annually (£{annualPrice}/year)
                </p>
              )}
              <CardDescription className="mt-2">
                Your complete AI command center
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {[
                  "Full access to the Optio chat assistant",
                  "Command Center dashboard", 
                  "Weekly performance reports",
                  "Gmail & Google Calendar integration",
                  "Notion workspace sync",
                  "All future updates",
                  "30-day money-back guarantee"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg"
                onClick={handleSubscribe}
                disabled={loading}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {loading ? "Processing..." : "Start Your Journey"}
              </Button>
              
              <p className="text-center text-muted-foreground text-sm">
                30-day money-back guarantee • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
