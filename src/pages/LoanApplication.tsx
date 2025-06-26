
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoanApplication = () => {
  const [formData, setFormData] = useState({
    no_of_dependents: "",
    income_annum: "",
    loan_amount: "",
    loan_term: "",
    cibil_score: "",
    residential_assets_value: "",
    commercial_assets_value: "",
    luxury_assets_value: "",
    bank_asset_value: "",
    self_employed: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = ['no_of_dependents', 'income_annum', 'loan_amount', 'loan_term', 'cibil_score', 'self_employed'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/process-loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        navigate('/loan-results', { state: { result, formData } });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to process loan application",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/')} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Loan Application</CardTitle>
              <CardDescription>
                Submit your loan application for AI-powered processing and approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dependents">Number of Dependents *</Label>
                    <Input
                      id="dependents"
                      type="number"
                      value={formData.no_of_dependents}
                      onChange={(e) => handleInputChange('no_of_dependents', e.target.value)}
                      placeholder="e.g., 2"
                      min="0"
                      max="10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="income">Annual Income *</Label>
                    <Input
                      id="income"
                      type="number"
                      value={formData.income_annum}
                      onChange={(e) => handleInputChange('income_annum', e.target.value)}
                      placeholder="e.g., 500000"
                      min="1000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loan-amount">Loan Amount *</Label>
                    <Input
                      id="loan-amount"
                      type="number"
                      value={formData.loan_amount}
                      onChange={(e) => handleInputChange('loan_amount', e.target.value)}
                      placeholder="e.g., 1000000"
                      min="1000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loan-term">Loan Term (months) *</Label>
                    <Input
                      id="loan-term"
                      type="number"
                      value={formData.loan_term}
                      onChange={(e) => handleInputChange('loan_term', e.target.value)}
                      placeholder="e.g., 240"
                      min="1"
                      max="480"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cibil">CIBIL Score *</Label>
                    <Input
                      id="cibil"
                      type="number"
                      value={formData.cibil_score}
                      onChange={(e) => handleInputChange('cibil_score', e.target.value)}
                      placeholder="e.g., 750"
                      min="300"
                      max="900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="self-employed">Self Employed *</Label>
                    <Select 
                      value={formData.self_employed} 
                      onValueChange={(value) => handleInputChange('self_employed', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value=" Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Asset Information (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="residential">Residential Assets Value</Label>
                      <Input
                        id="residential"
                        type="number"
                        value={formData.residential_assets_value}
                        onChange={(e) => handleInputChange('residential_assets_value', e.target.value)}
                        placeholder="e.g., 2000000"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="commercial">Commercial Assets Value</Label>
                      <Input
                        id="commercial"
                        type="number"
                        value={formData.commercial_assets_value}
                        onChange={(e) => handleInputChange('commercial_assets_value', e.target.value)}
                        placeholder="e.g., 1000000"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="luxury">Luxury Assets Value</Label>
                      <Input
                        id="luxury"
                        type="number"
                        value={formData.luxury_assets_value}
                        onChange={(e) => handleInputChange('luxury_assets_value', e.target.value)}
                        placeholder="e.g., 500000"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bank">Bank Asset Value</Label>
                      <Input
                        id="bank"
                        type="number"
                        value={formData.bank_asset_value}
                        onChange={(e) => handleInputChange('bank_asset_value', e.target.value)}
                        placeholder="e.g., 300000"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-purple-500 hover:bg-purple-600" 
                  disabled={loading}
                >
                  {loading ? "Processing Application..." : "Submit Loan Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;
