import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { BottomNav } from '../components/BottomNav';
import { NeighborhoodModal } from '../components/NeighborhoodModal';
import { UserProfileModal } from '../components/UserProfileModal';
import { AuthModal } from '../components/AuthModal';
import { ChatModal } from '../components/ChatModal';
import { ReviewModal } from '../components/ReviewModal';
import { useAuthStore } from '../store/useAuthStore';
import { useItemStore } from '../store/useItemStore';
import type { BorrowRequest, ChatMessage, User } from '../types';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    currentUser,
    neighborhoods,
    currentNeighborhood,
    fetchInitialData,
    login,
    register,
    logout,
    verifyLocation,
  } = useAuthStore();

  const { fetchTools, fetchStats } = useItemStore();

  // Modals state
  const [isNeighborhoodModalOpen, setIsNeighborhoodModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Chat & Review Modal state
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeChatTarget, setActiveChatTarget] = useState<{
    requestId?: string;
    toolTitle?: string;
    otherUserId: string;
    otherUserName: string;
  } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRequestForReview, setSelectedRequestForReview] = useState<BorrowRequest | null>(null);

  useEffect(() => {
    fetchInitialData();
    fetchTools();
    fetchStats();
  }, [fetchInitialData, fetchTools, fetchStats]);

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // Convert current path to BottomNav tab identifier
  const getActiveTab = (): 'catalog' | 'requests' | 'feedback' | 'lender' => {
    if (location.pathname.startsWith('/items') || location.pathname === '/') return 'catalog';
    if (location.pathname.startsWith('/borrowings')) return 'requests';
    if (location.pathname.startsWith('/dashboard')) return 'lender';
    return 'catalog';
  };

  const handleBottomNavSelect = (tab: 'catalog' | 'requests' | 'feedback' | 'lender') => {
    if (tab === 'catalog') navigate('/items');
    else if (tab === 'requests') navigate('/borrowings');
    else if (tab === 'lender') navigate('/dashboard');
    else if (tab === 'feedback') navigate('/items');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#24211d]">
      {/* Top Navbar */}
      <Navbar
        onOpenNeighborhoodModal={() => setIsNeighborhoodModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Routed Content Area */}
      <main className="flex-1 pb-16 sm:pb-0">
        <Outlet
          context={{
            onOpenAuth: handleOpenAuth,
            onOpenNeighborhood: () => setIsNeighborhoodModalOpen(true),
            onOpenProfile: () => setIsProfileModalOpen(true),
            onOpenChat: (target: any) => {
              setActiveChatTarget(target);
              setIsChatModalOpen(true);
            },
            onOpenReview: (request: BorrowRequest) => {
              setSelectedRequestForReview(request);
              setIsReviewModalOpen(true);
            },
          }}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentUser={currentUser}
        activeTab={getActiveTab()}
        onSelectTab={handleBottomNavSelect}
        onOpenAddModal={() => navigate('/items/create')}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAuthModal={() => handleOpenAuth('login')}
        onOpenNeighborhoodModal={() => setIsNeighborhoodModalOpen(true)}
        unreadMessagesCount={0}
        pendingRequestsCount={0}
      />

      {/* Global Modals */}
      <NeighborhoodModal
        isOpen={isNeighborhoodModalOpen}
        onClose={() => setIsNeighborhoodModalOpen(false)}
        neighborhoods={neighborhoods}
        currentNeighborhood={currentNeighborhood}
        currentUser={currentUser}
        onVerifyAndSwitch={async (neighborhoodId, postcode, method) => {
          await verifyLocation(neighborhoodId, postcode, method);
          setIsNeighborhoodModalOpen(false);
        }}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onOpenNeighborhoodModal={() => {
          setIsProfileModalOpen(false);
          setIsNeighborhoodModalOpen(true);
        }}
        onLogout={async () => {
          await logout();
          setIsProfileModalOpen(false);
          navigate('/login');
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        neighborhoods={neighborhoods}
        onLogin={async (credentials) => {
          await login(credentials);
        }}
        onSignUp={async (userData) => {
          await register(userData);
        }}
      />

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        currentUser={currentUser}
        selectedConversation={activeChatTarget}
        messages={messages}
        onSendMessage={(receiverId, receiverName, content, toolTitle) => {
          const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: currentUser?.id || 'guest',
            senderName: currentUser?.name || 'You',
            senderAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            receiverId,
            receiverName,
            toolTitle,
            message: content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, newMsg]);
        }}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        request={selectedRequestForReview}
        onSubmitReview={() => {
          setIsReviewModalOpen(false);
        }}
      />
    </div>
  );
};

export default MainLayout;
