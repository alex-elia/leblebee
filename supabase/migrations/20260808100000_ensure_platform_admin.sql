-- Idempotent: keep platform admin email on admin role (prod safety after signup fixes).

update public.profiles p
set role = 'admin'
from auth.users u
where p.id = u.id
  and lower(u.email) = 'alex.gon@eliago.com'
  and p.role is distinct from 'admin';
