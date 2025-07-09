import React from 'react';
import { useI18n } from '../hooks/useI18n';

const LoadingSpinner = () => {
  const { t } = useI18n();

  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>{t('messages.loading')}</p>
    </div>
  );
};

export default LoadingSpinner;