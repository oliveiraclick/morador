
/* ADD BRANDING COLUMNS TO APP_SETTINGS */

do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'app_settings' and column_name = 'splash_logo_url') then
    alter table public.app_settings add column splash_logo_url text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name = 'app_settings' and column_name = 'login_logo_url') then
    alter table public.app_settings add column login_logo_url text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name = 'app_settings' and column_name = 'pwa_icon_url') then
    alter table public.app_settings add column pwa_icon_url text;
  end if;
end $$;
