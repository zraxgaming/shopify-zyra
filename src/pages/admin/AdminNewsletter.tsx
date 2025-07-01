import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Users, Send, Trash2, Phone } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import PhoneCallInterface from "@/components/admin/PhoneCallInterface";

const AdminNewsletter = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns' | 'calls'>('subscribers');
  
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    subject: '',
    content: '',
    html_content: ''
  });

  useEffect(() => {
    fetchSubscribers();
    fetchCampaigns();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error: any) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: "Error",
        description: "Failed to load subscribers",
        variant: "destructive",
      });
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error: any) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const removeSubscriber = async (subscriberId: string) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) return;

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .delete()
        .eq('id', subscriberId);

      if (error) throw error;

      await fetchSubscribers();
      toast({
        title: "Success",
        description: "Subscriber removed successfully",
      });
    } catch (error: any) {
      console.error('Error removing subscriber:', error);
      toast({
        title: "Error",
        description: "Failed to remove subscriber",
        variant: "destructive",
      });
    }
  };

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.title || !campaignForm.subject || !campaignForm.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('email_campaigns')
        .insert({
          title: campaignForm.title,
          subject: campaignForm.subject,
          content: campaignForm.content,
          html_content: campaignForm.html_content,
          status: 'draft',
          recipient_count: subscribers.filter(s => s.is_active).length
        });

      if (error) throw error;

      setCampaignForm({
        title: '',
        subject: '',
        content: '',
        html_content: ''
      });

      await fetchCampaigns();
      toast({
        title: "Success",
        description: "Campaign created successfully",
      });
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this campaign to all subscribers?')) return;
    setLoading(true);
    try {
      // Fetch campaign details
      const { data: campaign, error: campaignError } = await supabase
        .from('email_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();
      if (campaignError || !campaign) {
        toast({
          title: "Error",
          description: "Campaign not found.",
          variant: "destructive",
        });
        throw campaignError || new Error('Campaign not found');
      }
      if (campaign.status === 'sent') {
        toast({
          title: "Already Sent",
          description: "This campaign has already been sent.",
          variant: "destructive",
        });
        return;
      }
      // Fetch all active subscribers
      const { data: activeSubscribers, error: subError } = await supabase
        .from('newsletter_subscriptions')
        .select('email')
        .eq('is_active', true);
      if (subError) {
        toast({
          title: "Error",
          description: "Failed to fetch subscribers.",
          variant: "destructive",
        });
        throw subError;
      }
      if (!activeSubscribers || activeSubscribers.length === 0) {
        toast({
          title: "No Active Subscribers",
          description: "There are no active subscribers to send this campaign to.",
          variant: "destructive",
        });
        return;
      }
      // Send campaign email to each subscriber using backend API
      try {
        for (const sub of activeSubscribers) {
          const response = await fetch('/api/send-email-generic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: sub.email,
              subject: campaign.subject,
              html: `
                <div style="background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); padding: 32px 0; min-height: 100vh; font-family: 'Segoe UI', Arial, sans-serif;">
                  <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(80,0,120,0.08); overflow: hidden;">
                    <div style="background: #7c3aed; padding: 24px 0; text-align: center;">
                      <img src='https://www.shopzyra.site/favicon.ico' alt='Zyra Logo' style='width:48px;height:48px;border-radius:8px;box-shadow:0 2px 8px #a18cd1;' />
                      <h1 style="color: #fff; font-size: 2rem; margin: 16px 0 0 0; letter-spacing: 1px;">${campaign.title || 'Newsletter'}</h1>
                    </div>
                    <div style="padding: 32px 24px 24px 24px; text-align: center;">
                      <div style="color: #4b006e; margin-bottom: 16px;">${campaign.html_content || campaign.content || ''}</div>
                    </div>
                    <div style="background: #f3e8ff; padding: 16px; text-align: center; color: #7c3aed; font-size: 0.95rem; border-top: 1px solid #e9d5ff;">
                      <p style="margin:0;">Thank you for being with us!<br/>Zyra Custom Craft</p>
                    </div>
                  </div>
                </div>
              `
            })
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error || 'Failed to send emails via backend API.');
          }
        }
      } catch (apiError: any) {
        toast({
          title: "Email Sending Failed",
          description: apiError?.message || "Failed to send emails via backend API.",
          variant: "destructive",
        });
        throw apiError;
      }
      // Mark campaign as sent
      const { error: updateError } = await supabase
        .from('email_campaigns')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', campaignId);
      if (updateError) {
        toast({
          title: "Database Error",
          description: "Emails sent, but failed to update campaign status.",
          variant: "destructive",
        });
        throw updateError;
      }
      await fetchCampaigns();
      toast({
        title: "Campaign Sent! 📧",
        description: `Email campaign has been sent to ${activeSubscribers.length} subscribers`,
      });
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      // ...toast already handled above...
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Newsletter Management - Admin Dashboard"
        description="Manage newsletter subscribers, create campaigns, and make AI phone calls to customers."
      />
      <AdminLayout>
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-between animate-slide-in-left">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-primary animate-bounce" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Newsletter & Communications
              </h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl animate-scale-in">
            {[
              { id: 'subscribers', label: 'Subscribers', icon: Users },
              { id: 'campaigns', label: 'Campaigns', icon: Mail },
              { id: 'calls', label: 'AI Phone Calls', icon: Phone }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === id
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>

          {/* Subscribers Tab */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 animate-slide-in-left">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Subscribers</p>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">{subscribers.length}</p>
                      </div>
                      <Users className="h-12 w-12 text-green-500 animate-bounce" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 animate-scale-in">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Active</p>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                          {subscribers.filter(s => s.is_active).length}
                        </p>
                      </div>
                      <Mail className="h-12 w-12 text-blue-500 animate-pulse" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 animate-slide-in-right">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Campaigns Sent</p>
                        <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                          {campaigns.filter(c => c.status === 'sent').length}
                        </p>
                      </div>
                      <Send className="h-12 w-12 text-purple-500 animate-bounce" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm animate-slide-in-up">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Users className="h-6 w-6 animate-bounce" />
                    Subscriber Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subscribed</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {subscribers.map((subscriber, index) => (
                          <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                              {subscriber.email}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                              {subscriber.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={subscriber.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}>
                                {subscriber.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                              {new Date(subscriber.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeSubscriber(subscriber.id)}
                                className="hover:scale-105 transition-transform duration-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {subscribers.length === 0 && (
                      <div className="text-center py-12 animate-bounce-in">
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-float" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Subscribers Yet</h3>
                        <p className="text-gray-500 dark:text-gray-400">Subscribers will appear here once they sign up</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm animate-slide-in-left">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Mail className="h-6 w-6 animate-bounce" />
                    Create Campaign
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={createCampaign} className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-blue-700 dark:text-blue-300 font-semibold">
                        Campaign Title *
                      </Label>
                      <Input
                        id="title"
                        value={campaignForm.title}
                        onChange={(e) => setCampaignForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Monthly Newsletter"
                        className="border-2 border-blue-200 focus:border-blue-500 h-12 text-lg"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-blue-700 dark:text-blue-300 font-semibold">
                        Email Subject *
                      </Label>
                      <Input
                        id="subject"
                        value={campaignForm.subject}
                        onChange={(e) => setCampaignForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Exciting Updates from Zyra!"
                        className="border-2 border-blue-200 focus:border-blue-500 h-12 text-lg"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="content" className="text-blue-700 dark:text-blue-300 font-semibold">
                        Email Content *
                      </Label>
                      <Textarea
                        id="content"
                        value={campaignForm.content}
                        onChange={(e) => setCampaignForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Write your email content here..."
                        rows={8}
                        className="border-2 border-blue-200 focus:border-blue-500 resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      {loading ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Creating...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5" />
                          Create Campaign
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm animate-slide-in-right">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Send className="h-6 w-6 animate-bounce" />
                    Campaign History
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {campaigns.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {campaigns.length === 0 ? (
                      <div className="text-center py-12 animate-bounce-in">
                        <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-float" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Campaigns Yet</h3>
                        <p className="text-gray-500 dark:text-gray-400">Create your first campaign to get started</p>
                      </div>
                    ) : (
                      campaigns.map((campaign, index) => (
                        <div
                          key={campaign.id}
                          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border hover:shadow-lg transition-all duration-300 animate-slide-in-up"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{campaign.title}</h4>
                            <Badge className={campaign.status === 'sent' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'}>
                              {campaign.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{campaign.subject}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              Recipients: {campaign.recipient_count || 0}
                            </div>
                            {campaign.status === 'draft' && (
                              <Button
                                size="sm"
                                onClick={() => sendCampaign(campaign.id)}
                                className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-300"
                                disabled={loading}
                              >
                                {loading ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4 mr-2" />
                                )}
                                Send
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI Phone Calls Tab */}
          {activeTab === 'calls' && (
            <div className="animate-fade-in">
              <PhoneCallInterface />
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminNewsletter;
