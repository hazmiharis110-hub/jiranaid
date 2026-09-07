import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';

import { HomePage } from '../pages/HomePage';
import { ItemListingPage } from '../pages/ItemListingPage';
import { ItemDetailPage } from '../pages/ItemDetailPage';
import { CreateItemPage } from '../pages/CreateItemPage';
import { EditItemPage } from '../pages/EditItemPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { BorrowingPage } from '../pages/BorrowingPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Layout for Login & Register */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Main Application Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/items" element={<ItemListingPage />} />
        <Route path="/items/create" element={<CreateItemPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/items/:id/edit" element={<EditItemPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/borrowings" element={<BorrowingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
