import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Tenant } from '../../types';

interface FloatingWhatsAppButtonProps {
  tenant: Tenant;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({ tenant }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cleanNumber = tenant.whatsapp_number.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    `Hello ${tenant.name}! I have an inquiry regarding your wedding and event rental inventory.`
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="animate-whatsapp-pulse"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 45,
        backgroundColor: '#25D366',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: isHovered ? '12px 20px' : '14px',
        borderRadius: 'var(--radius-pill)',
        boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
        textDecoration: 'none',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      aria-label="Direct WhatsApp Chat"
    >
      <MessageCircle size={24} />
      {isHovered && (
        <span
          style={{
            fontSize: '13px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          Chat with Us
        </span>
      )}
    </a>
  );
};
