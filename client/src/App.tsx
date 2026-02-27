import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { queryClient } from "@/lib/queryClient";
import Navigation from "@/components/Navigation";
import Dashboard from "@/pages/Dashboard";
import CrisisSupport from "@/pages/CrisisSupport";
import MoodTracking from "@/pages/MoodTracking";
import VirtualParent from "@/pages/VirtualParent";
import "./index.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="mental-health-theme">
        <div className="min-h-screen bg-background">
          <Navigation />
          <main>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/crisis" component={CrisisSupport} />
              <Route path="/mood" component={MoodTracking} />
              <Route path="/virtual-parent" component={VirtualParent} />
              <Route>
                <div className="container mx-auto px-4 py-8 text-center">
                  <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                  <p className="text-muted-foreground mb-6">
                    The page you're looking for doesn't exist.
                  </p>
                  <a href="/" className="text-primary hover:underline">
                    Return to Dashboard
                  </a>
                </div>
              </Route>
            </Switch>
          </main>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;