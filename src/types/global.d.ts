declare namespace NodeJS {
  interface ProcessEnv {
    ENV?: 'local' | 'stage' | 'prod';
    HEADLESS?: string;
    SLOW_MO?: string;
    TZ_ID?: string;
    BASE_URL?: string;
    API_BASE_URL?: string;
    API_TIMEOUT?: string;
    CASHIER_USER?: string;
    CASHIER_PASS?: string;
    ADMIN_USER?: string;
    ADMIN_PASS?: string;
    VIDEO?: 'on' | 'retain-on-failure' | 'off';
    LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
    PLAYWRIGHT_RUN_ID?: string;
  }
}
