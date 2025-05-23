/* eslint-disable perfectionist/sort-objects */

import { BrowserRouter, useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { Layout } from './components';
import { authRoutes } from './features/auth';
import { dashboardRoute, publicDatasetsRoute } from './features/dashboard';
import { createDatasetRoute } from './features/dataset/pages/CreateDatasetPage';
import { editDatasetInfoRoute } from './features/dataset/pages/EditDatasetInfoPage';
import { manageDatasetManagersRoute } from './features/dataset/pages/ManageDatasetManagersPage';
import { viewDatasetsRoute } from './features/dataset/pages/ViewDatasetsPage';
import { viewOneDatasetRoute } from './features/dataset/pages/ViewOneDatasetPage';
import { LandingPage } from './features/landing';
import { addProjectDatasetColumnRoute } from './features/projects/pages/AddProjectDatasetColumnPage';
import { addProjectDatasetRoute } from './features/projects/pages/AddProjectDatasetPage';
import { createProjectRoute } from './features/projects/pages/CreateProjectPage';
import { editProjectInfoRoute } from './features/projects/pages/EditProjectInfoPage';
import { manageProjectUsersRoute } from './features/projects/pages/ManageProjectUsersPage';
import { viewOneProjectDatasetRoute } from './features/projects/pages/ViewOneProjectDatasetPage';
import { viewOneProjectRoute } from './features/projects/pages/ViewOneProjectPage';
import { viewProjectsRoute } from './features/projects/pages/ViewProjectsPage';
import { userRoute } from './features/user';
import { useAuthStore } from './stores/auth-store';

const publicRoutes: RouteObject[] = [
  authRoutes,
  publicDatasetsRoute,
  {
    index: true,
    path: '*',
    element: <LandingPage />
  }
];

const protectedRoutes: RouteObject[] = [
  authRoutes,
  publicDatasetsRoute,
  {
    index: true,
    element: <LandingPage />
  },
  {
    children: [
      createDatasetRoute,
      dashboardRoute,
      viewDatasetsRoute,
      viewOneDatasetRoute,
      viewOneProjectDatasetRoute,
      viewProjectsRoute,
      viewOneProjectRoute,
      userRoute,
      createProjectRoute,
      addProjectDatasetRoute,
      manageDatasetManagersRoute,
      manageProjectUsersRoute,
      editDatasetInfoRoute,
      editProjectInfoRoute,
      addProjectDatasetColumnRoute
    ],
    element: <Layout />,
    path: 'portal'
  }
];

const AppRoutes = () => {
  /**
   * component to return the routes depending on the state of the access token
   * in the auth store
   *
   * at the first render, if the environment is DEV and the developer configured
   * the app to bypass auth, then a post request will be send to the backend to
   * fake the creation of a user and get back an access token
   */
  const { accessToken } = useAuthStore();

  return useRoutes(accessToken ? protectedRoutes : publicRoutes);
};

export const Router = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
