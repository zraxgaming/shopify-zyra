
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

const staticFAQs = [
  {
    id: '1',
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-5 business days within the UAE. International shipping takes 7-14 business days.',
    category: 'Shipping',
    is_active: true
  },
  {
    id: '2',
    question: 'Can I customize my products?',
    answer: 'Yes! Most of our products offer customization options. Look for the "Customize" button on product pages.',
    category: 'Customization',
    is_active: true
  },
  {
    id: '3',
    question: 'What payment methods do you accept?',
    answer: 'We accept credit cards, PayPal, and Ziina payments. All transactions are secure.',
    category: 'Payment',
    is_active: true
  },
  {
    id: '4',
    question: 'What is your return policy?',
    answer: 'We offer 30-day returns for non-customized items. Custom products have a 7-day return window for defects only.',
    category: 'Returns',
    is_active: true
  }
];

export const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {staticFAQs.filter(faq => faq.is_active).map((faq) => {
        const isOpen = openItems.includes(faq.id);
        
        return (
          <Card key={faq.id} className="bg-card/50 backdrop-blur-sm border border-border/50">
            <Collapsible open={isOpen} onOpenChange={() => toggleItem(faq.id)}>
              <CollapsibleTrigger className="w-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-left">
                    <h3 className="text-lg font-semibold text-foreground pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <ChevronDown className="h-5 w-5 text-primary transition-transform duration-200" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="px-6 pb-6 pt-0">
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
};
