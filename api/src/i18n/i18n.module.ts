import { Module } from '@nestjs/common';

import { I18nService } from './i18n.service.js';

@Module({
  exports: [I18nService],
  providers: [I18nService]
})
export class I18nModule {}
