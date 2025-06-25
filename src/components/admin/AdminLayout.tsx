
import React from 'react';
import { Container } from '@/components/ui/container';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-12">
        {children}
      </Container>
      <Footer />
    </div>
  );
};

export default AdminLayout;
