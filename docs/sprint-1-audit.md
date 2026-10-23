# Sprint 1 — CBCC-08 Tampering Audit

Before Sprint 1, these endpoints accepted requests from anyone:
`/api/update-user`, `/api/users`, `/api/delete-user`, `/api/elder/elder-update`, `/api/announce/announce-create`.
This audit checks whether anyone abused them. Run it **after** the Sprint 1 fixes are deployed.

All queries are read-only (`SELECT`). Run them in **Supabase Dashboard → SQL Editor**.

---

## 1. Who has elevated roles?

Confirm every row is a real, expected person with the right role.

```sql
select t.name, t.email, t.role, t.created_at, u.last_sign_in_at
from public."userTB" t
left join auth.users u on u.id = t.auth_id
order by t.role, t.created_at;
```

## 2. Accounts out of sync

`userTB` rows with no login account (deleted via `/api/delete-user`, or partial writes):

```sql
select t.*
from public."userTB" t
left join auth.users u on u.id = t.auth_id
where u.id is null;
```

Login accounts with no `userTB` row (their `userTB` row may have been deleted):

```sql
select u.id, u.email, u.created_at, u.last_sign_in_at
from auth.users u
left join public."userTB" t on t.auth_id = u.id
where t.auth_id is null;
```

## 3. Unexpected announcements

```sql
select id, title, created_at
from public.announce_tb
order by created_at desc
limit 50;
```

## 4. Elder files — recent changes

```sql
select f.id, f.title, f.file_name, f.created_at, f.updated_at, t.name as owner
from public."elder-storage_tb" f
left join public."userTB" t on t.id = f.user_id
order by coalesce(f.updated_at, f.created_at) desc
limit 50;
```

## 5. Files deleted from storage (`old_file_path` abuse)

Rows that point at a storage object that no longer exists:

```sql
-- Elder files
select f.id, f.title, f.file_path
from public."elder-storage_tb" f
where not exists (
  select 1 from storage.objects o
  where o.bucket_id = 'cbcc-bucket' and o.name = f.file_path
);

-- Recent activity images
select r.id, r.title, r.img
from public.recent_activities r
where r.img like '%/cbcc-bucket/%'
  and not exists (
    select 1 from storage.objects o
    where o.bucket_id = 'cbcc-bucket'
      and o.name = split_part(r.img, '/cbcc-bucket/', 2)
  );

-- Weekly devotion files
select w.id, w.title, w.file
from public.weekly_devotion_tb w
where w.file like '%/cbcc-bucket/%'
  and not exists (
    select 1 from storage.objects o
    where o.bucket_id = 'cbcc-bucket'
      and o.name = split_part(w.file, '/cbcc-bucket/', 2)
  );
```

## 6. Unreferenced uploads in `elder-files/`

Objects nobody's row points to (possible uploads through the old open `elder-update`):

```sql
select o.name, o.created_at, o.metadata->>'size' as size
from storage.objects o
where o.bucket_id = 'cbcc-bucket'
  and o.name like 'elder-files/%'
  and not exists (
    select 1 from public."elder-storage_tb" f where f.file_path = o.name
  )
order by o.created_at desc;
```

## 7. Vercel function logs

**Vercel Dashboard → Project → Logs**, filter by each path:

- [ ] `/api/update-user`
- [ ] `/api/delete-user`
- [ ] `/api/users`
- [ ] `/api/elder/elder-update`
- [ ] `/api/announce/announce-create`

Look for calls at unexpected times or from unfamiliar IPs or user agents. Log retention is short on most Vercel plans, so check soon after deploying.

---

## Findings

| Date | Check | Finding | Action taken | By |
|---|---|---|---|---|
| | | | | |
