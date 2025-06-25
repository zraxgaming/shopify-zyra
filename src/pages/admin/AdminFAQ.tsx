
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order_index?: number;
  is_active: boolean;
  created_at: string;
}

// Static FAQ data since we don't have the table in Supabase
const staticFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-5 business days within the UAE. International shipping takes 7-14 business days.',
    category: 'Shipping',
    order_index: 1,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2', 
    question: 'Can I customize my products?',
    answer: 'Yes! Most of our products offer customization options. Look for the "Customize" button on product pages.',
    category: 'Customization',
    order_index: 2,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    question: 'What payment methods do you accept?',
    answer: 'We accept credit cards, PayPal, and Ziina payments. All transactions are secure.',
    category: 'Payment',
    order_index: 3,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    question: 'What is your return policy?',
    answer: 'We offer 30-day returns for non-customized items. Custom products have a 7-day return window for defects only.',
    category: 'Returns',
    order_index: 4,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>(staticFAQs);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    category: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const handleAddFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      toast({
        title: "Validation Error",
        description: "Question and answer are required",
        variant: "destructive",
      });
      return;
    }

    const newFaqItem: FAQ = {
      id: Date.now().toString(),
      question: newFaq.question,
      answer: newFaq.answer,
      category: newFaq.category || undefined,
      order_index: faqs.length + 1,
      is_active: true,
      created_at: new Date().toISOString()
    };

    setFaqs(prev => [...prev, newFaqItem]);
    setNewFaq({ question: "", answer: "", category: "" });
    setShowAddForm(false);

    toast({
      title: "Success",
      description: "FAQ added successfully",
    });
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
    toast({
      title: "Success", 
      description: "FAQ deleted successfully",
    });
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, is_active: !isActive } : faq
    ));
    
    toast({
      title: "Success",
      description: `FAQ ${!isActive ? 'activated' : 'deactivated'} successfully`,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
        </div>

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Question</label>
                <Input
                  value={newFaq.question}
                  onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter question..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Answer</label>
                <Textarea
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                  placeholder="Enter answer..."
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category (Optional)</label>
                <Input
                  value={newFaq.category}
                  onChange={(e) => setNewFaq(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Orders, Shipping, Products..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddFaq}>
                  <Save className="h-4 w-4 mr-2" />
                  Save FAQ
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {faqs.map((faq) => (
            <Card key={faq.id} className={!faq.is_active ? "opacity-60" : ""}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground mb-2">{faq.answer}</p>
                    {faq.category && (
                      <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {faq.category}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(faq.id, faq.is_active)}
                    >
                      {faq.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(faq.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteFaq(faq.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {faqs.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No FAQs found. Add your first FAQ to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFAQ;
