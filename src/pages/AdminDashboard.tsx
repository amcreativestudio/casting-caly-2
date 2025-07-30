import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Download, Users, FileText, Calendar, Phone, MapPin, Eye } from "lucide-react";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CastingSubmission {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  phone: string;
  province: string;
  motivation: string;
  photos: string[];
  cv_portfolio?: string;
  created_at: string;
}

interface AdminProfile {
  name: string;
  role: string;
}

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState<CastingSubmission[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<CastingSubmission | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadSubmissions();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/admin");
      return;
    }

    // Check if user is admin
    const { data: profile, error } = await supabase
      .from("admin_profiles")
      .select("name, role")
      .eq("user_id", session.user.id)
      .single();

    if (error || !profile) {
      await supabase.auth.signOut();
      navigate("/admin");
      toast({
        title: "Acesso negado",
        description: "Você não tem permissões administrativas.",
        variant: "destructive",
      });
      return;
    }

    setAdminProfile(profile);
  };

  const loadSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("casting_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const generatePDF = (submission: CastingSubmission) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("CASTING CALY II - INSCRIÇÃO", 20, 30);
    
    // Submission details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    let yPosition = 50;
    const lineHeight = 8;
    
    doc.text(`Nome: ${submission.full_name}`, 20, yPosition);
    yPosition += lineHeight;
    
    doc.text(`Idade: ${submission.age} anos`, 20, yPosition);
    yPosition += lineHeight;
    
    doc.text(`Sexo: ${submission.gender}`, 20, yPosition);
    yPosition += lineHeight;
    
    doc.text(`Telefone: ${submission.phone}`, 20, yPosition);
    yPosition += lineHeight;
    
    doc.text(`Província: ${submission.province}`, 20, yPosition);
    yPosition += lineHeight;
    
    doc.text(`Data de Inscrição: ${format(new Date(submission.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, 20, yPosition);
    yPosition += lineHeight * 2;
    
    // Motivation
    doc.setFont("helvetica", "bold");
    doc.text("Motivação:", 20, yPosition);
    yPosition += lineHeight;
    
    doc.setFont("helvetica", "normal");
    const motivationLines = doc.splitTextToSize(submission.motivation, 170);
    doc.text(motivationLines, 20, yPosition);
    yPosition += lineHeight * motivationLines.length + 10;
    
    // Photos info
    doc.setFont("helvetica", "bold");
    doc.text(`Fotos anexadas: ${submission.photos.length}`, 20, yPosition);
    yPosition += lineHeight;
    
    if (submission.cv_portfolio) {
      doc.text("CV/Portfólio: Anexado", 20, yPosition);
    }
    
    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Casting Caly II - Filme de Ação Moçambicano", 20, 280);
    doc.text("Diretor: Alcy Caluamba", 20, 290);
    
    doc.save(`casting-${submission.full_name.replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };

  const downloadAllPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("CASTING CALY II - RELATÓRIO COMPLETO", 20, 30);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Total de inscrições: ${submissions.length}`, 20, 50);
    doc.text(`Relatório gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, 20, 60);
    
    let yPosition = 80;
    const lineHeight = 6;
    
    submissions.forEach((submission, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${submission.full_name}`, 20, yPosition);
      yPosition += lineHeight;
      
      doc.setFont("helvetica", "normal");
      doc.text(`   Idade: ${submission.age} | Sexo: ${submission.gender} | Província: ${submission.province}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`   Telefone: ${submission.phone}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`   Inscrição: ${format(new Date(submission.created_at), "dd/MM/yyyy", { locale: ptBR })}`, 20, yPosition);
      yPosition += lineHeight * 2;
    });
    
    doc.save(`casting-caly-ii-relatorio-completo-${format(new Date(), "dd-MM-yyyy")}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Casting Caly II - {adminProfile?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {adminProfile?.role}
              </Badge>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Inscrições</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{submissions.length}</div>
              <p className="text-xs text-gray-600">candidatos inscritos</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inscrições Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {submissions.filter(s => 
                  format(new Date(s.created_at), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                ).length}
              </div>
              <p className="text-xs text-gray-600">novas inscrições</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ações</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <Button 
                onClick={downloadAllPDF}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Relatório PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Inscrições Recebidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>Sexo</TableHead>
                    <TableHead>Província</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.full_name}</TableCell>
                      <TableCell>{submission.age}</TableCell>
                      <TableCell>{submission.gender}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          {submission.province}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {submission.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(submission.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedSubmission(submission)}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => generatePDF(submission)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal for viewing submission details */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Detalhes da Inscrição
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSubmission(null)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                  <p className="text-gray-900">{selectedSubmission.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Idade</label>
                  <p className="text-gray-900">{selectedSubmission.age} anos</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Sexo</label>
                  <p className="text-gray-900">{selectedSubmission.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Telefone</label>
                  <p className="text-gray-900">{selectedSubmission.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Província</label>
                  <p className="text-gray-900">{selectedSubmission.province}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Data de Inscrição</label>
                  <p className="text-gray-900">
                    {format(new Date(selectedSubmission.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Motivação</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.motivation}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Fotos</label>
                <p className="text-gray-600">{selectedSubmission.photos.length} foto(s) anexada(s)</p>
              </div>

              {selectedSubmission.cv_portfolio && (
                <div>
                  <label className="text-sm font-medium text-gray-700">CV/Portfólio</label>
                  <p className="text-gray-600">Arquivo anexado</p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSubmission(null)}
                >
                  Fechar
                </Button>
                <Button
                  onClick={() => generatePDF(selectedSubmission)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;