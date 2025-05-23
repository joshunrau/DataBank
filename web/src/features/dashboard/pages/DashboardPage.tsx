import { Heading } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import type { RouteObject } from 'react-router-dom';

import { PageHeading } from '@/components/PageHeading';

import { Summary } from '../components/Summary';

const DashboardPage = () => {
  const { t } = useTranslation('common');

  return (
    <div className="flex grow flex-col justify-center text-center">
      <PageHeading>{t('dashboard')}</PageHeading>
      <section className="flex grow flex-col gap-5">
        <div className="flex w-full flex-col flex-wrap justify-between gap-3 md:flex-row md:items-center">
          <Heading className="m-3 whitespace-nowrap" variant="h3">
            {t('dashboardSummary')}
          </Heading>
        </div>
        <Summary />
      </section>
    </div>
  );
};

export const dashboardRoute: RouteObject = {
  element: <DashboardPage />,
  path: 'dashboard'
};
