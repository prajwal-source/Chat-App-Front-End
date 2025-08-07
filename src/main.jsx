import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import  { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router'
import AppRoute from '../config/AppRoutes';
import { ChatProvider } from '../Context/ChatContext';



createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <ChatProvider>
        <AppRoute />
      </ChatProvider>
      <Toaster position="top-center" />
   
    </BrowserRouter>

);
