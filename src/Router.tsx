import React from 'react';
import {createBrowserRouter, Outlet} from 'react-router-dom';
import ErrorBoundary from './ErrorHandling/ErrorBoundary';
import Home from './Pages/Home/Home';
import Layout from './Layout';
import NoteModal from './component/Note/NoteModal';
import BackgroundLayout from './component/Note/BackgroundLayout';

interface ProviderWrapperProps {
  children: React.ReactNode;
}
//eslint-disable-next-line
const ProviderWrapper: React.FC<ProviderWrapperProps> = () => {
  return (
    <ErrorBoundary>
      <Layout>
        <Outlet />
      </Layout>
    </ErrorBoundary>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProviderWrapper>
        <div />
      </ProviderWrapper>
    ),
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/notes/:id',
        element: (
          <BackgroundLayout>
            <NoteModal />
          </BackgroundLayout>
        )
      },
      {
        path: '/reminders',
        element: <div>Reminders</div>
      },
      {
        path: '/editlabel'
      },
      {
        path: '/editlabel/:title'
      },
      {
        path: '/archieve'
      },
      {
        path: '/bin'
      },
      {
        path: '*',
        element: <div>404</div>
      }
    ]
  }
]);

export default router;
