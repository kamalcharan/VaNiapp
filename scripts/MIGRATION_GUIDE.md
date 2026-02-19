# VaNi Database Migration Guide

VaNi is moving from a shared Supabase project to its own dedicated instance.
This guide walks through the complete migration process.

---

## Prerequisites

- Access to the **old** Supabase project (shared DB)
- A **new** Supabase project created at [supabase.com/dashboard](https://supabase.com/dashboard)
- Node.js 18+ installed
- The VaNi repo cloned locally

---

## Step 1: Create a New Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Choose your organization, name it (e.g., `vani-prod`), set a strong DB password, pick a region close to your users (e.g., `ap-south-1` for India)
4. Wait for the project to finish provisioning

### Collect credentials

From **Settings → API** in the new project dashboard, note down:

| Key | Where to find it |
|-----|-----------------|
| **Project URL** | `https://xxxx.supabase.co` |
| **Anon Key** | Under "Project API keys" → `anon` / `public` |
| **Service Role Key** | Under "Project API keys" → `service_role` (keep secret!) |

---

## Step 2: Run the Consolidated Migration

1. Open the new Supabase project dashboard
2. Go to **SQL Editor**
3. Open the file `supabase/migrations/00000000000000_consolidated_schema.sql`
4. Copy-paste the entire contents into the SQL Editor
5. Click **Run**

This creates all tables, indexes, RLS policies, triggers, and seed data (exams, subjects, chapters, topics) in one go.

### Verify

Run this in the SQL Editor to confirm:

```sql
SELECT 'med_exams' as tbl, count(*) FROM med_exams
UNION ALL SELECT 'med_subjects', count(*) FROM med_subjects
UNION ALL SELECT 'med_chapters', count(*) FROM med_chapters
UNION ALL SELECT 'med_topics', count(*) FROM med_topics;
```

Expected: 3 exams, 29+ subjects, 200+ chapters, 150+ topics.

---

## Step 3: Set Up Google Auth

### 3a. Configure Google OAuth in Supabase

1. In the new Supabase project, go to **Authentication → Providers → Google**
2. Toggle **Enable Google provider**
3. Enter your **Google Client ID** and **Client Secret**
   - Same ones you used in the old project (from Google Cloud Console)
4. Note the **Callback URL** shown by Supabase:
   ```
   https://your-vani-project-id.supabase.co/auth/v1/callback
   ```

### 3b. Update Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Navigate to **APIs & Services → Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add the new callback URL:
   ```
   https://your-vani-project-id.supabase.co/auth/v1/callback
   ```
5. (Optional) Remove the old Supabase callback URL once migration is complete
6. Save

### 3c. Configure Deep Link Redirect

In **Authentication → URL Configuration**:
- Set **Site URL** to your app's deep link scheme (e.g., `vani://` or `exp://`)
- Add redirect URLs as needed for your Expo setup

---

## Step 4: Migrate Question Data

This migrates questions, options, hints, and generation jobs from the old DB to the new one. User data is NOT migrated (users will re-register).

### 4a. Set up credentials

```bash
export OLD_SUPABASE_URL="https://old-shared-project.supabase.co"
export OLD_SUPABASE_SERVICE_KEY="your-old-service-role-key"
export NEW_SUPABASE_URL="https://your-vani-project-id.supabase.co"
export NEW_SUPABASE_SERVICE_KEY="your-new-service-role-key"
```

### 4b. Dry run (read-only, check counts)

```bash
node scripts/migrate-data.mjs --dry-run
```

This shows how many rows exist in each table without writing anything.

### 4c. Run the migration

```bash
node scripts/migrate-data.mjs
```

The script migrates tables in foreign-key order and logs progress for each table.

### 4d. Verify

Run counts on the new DB to confirm data matches:

```sql
SELECT 'med_questions' as tbl, count(*) FROM med_questions
UNION ALL SELECT 'med_question_options', count(*) FROM med_question_options
UNION ALL SELECT 'med_elimination_hints', count(*) FROM med_elimination_hints
UNION ALL SELECT 'med_generation_jobs', count(*) FROM med_generation_jobs;
```

---

## Step 5: Update App Configuration

### 5a. Mobile App (.env)

Update your `.env` file with the new project credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-vani-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 5b. Qbank Admin (Qbank/config.json)

Update `Qbank/config.json`:

```json
{
  "supabase": {
    "url": "https://your-vani-project-id.supabase.co",
    "anonKey": "your-new-anon-key"
  }
}
```

---

## Step 6: Test

1. **Mobile App**: Run the app, sign in with Google, complete onboarding
2. **Qbank Admin**: Open `Qbank/index.html`, verify dashboard loads with correct question counts
3. **Questions**: Browse chapters, verify questions and options display correctly

---

## Post-Migration Cleanup

Once everything is confirmed working on the new Supabase project:

1. Remove the old Supabase callback URL from Google Cloud Console
2. Remove `OLD_SUPABASE_*` env vars
3. Update any CI/CD pipelines with new credentials
4. (Optional) Remove the old `med_*` tables from the shared project if no longer needed

---

## Troubleshooting

### "Supabase is not configured" error
- Check that `.env` has the correct `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Make sure they start with `https://` and are not placeholder values

### Google sign-in not working
- Verify the new Supabase callback URL is added to Google Cloud Console redirect URIs
- Check that Google provider is enabled in Supabase Authentication settings
- Ensure the Client ID matches in both `.env` and Supabase dashboard

### Migration script errors
- Use `--dry-run` first to verify connectivity
- Ensure you're using **service role keys** (not anon keys) for migration
- Check that the consolidated schema was run on the new DB first
