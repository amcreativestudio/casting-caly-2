import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let authResult;
      
      if (isSignUp) {
        // Sign up flow - só permitir o email específico
        if (email !== 'alcymedia.app@gmail.com') {
          throw new Error("Apenas o administrador autorizado pode se registrar.");
        }
        
        authResult = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
      } else {
        // Sign in flow
        authResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      const { data, error } = authResult;
      if (error) throw error;

      if (data.user) {
        if (isSignUp) {
          toast({
            title: "Conta criada com sucesso",
            description: "Você pode fazer login agora.",
          });
          setIsSignUp(false);
        } else {
          // Check if user is admin
          const { data: adminProfile, error: profileError } = await supabase
            .from("admin_profiles")
            .select("*")
            .eq("user_id", data.user.id)
            .single();

          if (profileError || !adminProfile) {
            await supabase.auth.signOut();
            throw new Error("Acesso negado. Você não tem permissões administrativas.");
          }

          toast({
            title: "Login realizado com sucesso",
            description: `Bem-vindo, ${adminProfile.name}!`,
          });

          navigate("/admin/dashboard");
        }
      }
    } catch (error: any) {
      toast({
        title: isSignUp ? "Erro no cadastro" : "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-blue-100">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
              title={isSignUp ? "Mudar para Login" : "Mudar para Cadastro"}
            >
              <Lock className="h-8 w-8 text-blue-600" />
            </button>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {isSignUp ? "Criar Conta Admin" : "Área Administrativa"}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {isSignUp ? "Cadastrar novo administrador" : "Acesso restrito ao painel de controle"}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@exemplo.com"
                required
                className="border-blue-200 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="border-blue-200 focus:border-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (isSignUp ? "Criando conta..." : "Entrando...") : (isSignUp ? "Criar conta" : "Entrar")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Voltar ao site principal
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;