-- =======================================================
-- PREMIUM HOMESTAY SYSTEM DATABASE SCHEMA
-- RUN THIS IN THE SUPABASE SQL EDITOR TO SETUP YOUR TABLES
-- =======================================================

-- Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 1. ROLES
create table if not exists public.roles (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PROFILES
create table if not exists public.profiles (
    id uuid primary key references auth.users on delete cascade,
    email text not null unique,
    role_id uuid references public.roles(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ROOM CATEGORIES
create table if not exists public.room_categories (
    id uuid primary key default uuid_generate_v4(),
    name_en text not null,
    name_id text not null,
    slug text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ROOMS
create table if not exists public.rooms (
    id uuid primary key default uuid_generate_v4(),
    category_id uuid references public.room_categories(id) on delete set null,
    name text not null,
    slug text not null unique,
    description_en text not null,
    description_id text not null,
    short_description_en text not null,
    short_description_id text not null,
    price_per_night numeric not null check (price_per_night >= 0),
    weekend_price numeric check (weekend_price >= 0),
    seasonal_price jsonb default '[]'::jsonb, -- [{ "start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD", "price": 1200000 }]
    capacity integer not null check (capacity > 0),
    bed_type text not null,
    room_size numeric not null check (room_size > 0),
    is_available boolean default true not null,
    main_thumbnail text not null,
    gallery_images text[] default '{}'::text[] not null,
    facilities text[] default '{}'::text[] not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. BOOKING STATUS
create table if not exists public.booking_status (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique, -- pending, confirmed, cancelled, completed
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. CUSTOMERS
create table if not exists public.customers (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    email text not null,
    whatsapp text not null,
    country text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. BOOKINGS
create table if not exists public.bookings (
    id uuid primary key default uuid_generate_v4(),
    room_id uuid references public.rooms(id) on delete cascade not null,
    customer_id uuid references public.customers(id) on delete cascade not null,
    check_in date not null,
    check_out date not null,
    guest_count integer not null check (guest_count > 0),
    notes text,
    status_id uuid references public.booking_status(id) on delete set null,
    status_code text default 'pending' not null, -- pending, confirmed, cancelled, completed
    total_nights integer not null,
    total_amount numeric not null,
    discount_amount numeric default 0 not null,
    promo_code text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. TESTIMONIALS
create table if not exists public.testimonials (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    avatar text,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment_en text not null,
    comment_id text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. GALLERIES
create table if not exists public.galleries (
    id uuid primary key default uuid_generate_v4(),
    image_url text not null,
    title_en text,
    title_id text,
    category text default 'general' not null,
    sort_order integer default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. BLOG CATEGORIES
create table if not exists public.blog_categories (
    id uuid primary key default uuid_generate_v4(),
    name_en text not null,
    name_id text not null,
    slug text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. BLOGS
create table if not exists public.blogs (
    id uuid primary key default uuid_generate_v4(),
    category_id uuid references public.blog_categories(id) on delete set null,
    title_en text not null,
    title_id text not null,
    slug text not null unique,
    content_en text not null,
    content_id text not null,
    summary_en text not null,
    summary_id text not null,
    thumbnail_url text not null,
    tags text[] default '{}'::text[] not null,
    is_published boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. FAQ
create table if not exists public.faq (
    id uuid primary key default uuid_generate_v4(),
    question_en text not null,
    question_id text not null,
    answer_en text not null,
    answer_id text not null,
    sort_order integer default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. COUPONS
create table if not exists public.coupons (
    id uuid primary key default uuid_generate_v4(),
    code text not null unique,
    discount_percentage numeric not null check (discount_percentage >= 0 and discount_percentage <= 100),
    expiry_date date not null,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 14. PROMOTIONS
create table if not exists public.promotions (
    id uuid primary key default uuid_generate_v4(),
    banner_url text not null,
    title_en text not null,
    title_id text not null,
    description_en text,
    description_id text,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 15. NOTIFICATIONS
create table if not exists public.notifications (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    message text not null,
    type text default 'info' not null, -- info, booking, alert
    is_read boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 16. ACTIVITY LOGS
create table if not exists public.activity_logs (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid,
    user_email text,
    action text not null, -- LOGIN, LOGOUT, CREATE, EDIT, DELETE
    details text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 17. SITE SETTINGS
create table if not exists public.site_settings (
    id text primary key default 'general',
    site_name text default 'Aurelia Luxury Homestay' not null,
    logo_url text,
    favicon_url text,
    hero_title_en text default 'Uncover the True Meaning of Luxury Living' not null,
    hero_title_id text default 'Temukan Arti Sebenarnya dari Hunian Mewah' not null,
    hero_subtitle_en text default 'A premium retreat tucked away in pure nature, designed for absolute serenity.' not null,
    hero_subtitle_id text default 'Tempat peristirahatan premium yang tersembunyi di alam murni, dirancang untuk ketenangan mutlak.' not null,
    hero_image text,
    whatsapp_number text default '6281234567890' not null,
    whatsapp_template text default 'Halo Aurelia Homestay, saya ingin memesan kamar.' not null,
    email text default 'info@aureliahomestay.com' not null,
    address text default 'Jl. Raya Luxury No. 1, Ubud, Bali, Indonesia' not null,
    social_facebook text,
    social_instagram text,
    social_youtube text,
    footer_text_en text default 'Experience premium living and high-end serenity at our selected luxury homestays.' not null,
    footer_text_id text default 'Rasakan hunian premium dan ketenangan kelas atas di homestay mewah pilihan kami.' not null,
    copyright_text text default '© 2026 Aurelia Luxury Retreats. All rights reserved.' not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 18. SEO SETTINGS
create table if not exists public.seo_settings (
    id text primary key, -- home, about, rooms, gallery, blog, faq, testimonials, contact
    meta_title_en text not null,
    meta_title_id text not null,
    meta_desc_en text not null,
    meta_desc_id text not null,
    og_image text,
    twitter_card text default 'summary_large_image' not null,
    canonical_url text,
    robots text default 'index, follow' not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =======================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================

alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.room_categories enable row level security;
alter table public.rooms enable row level security;
alter table public.booking_status enable row level security;
alter table public.customers enable row level security;
alter table public.bookings enable row level security;
alter table public.testimonials enable row level security;
alter table public.galleries enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blogs enable row level security;
alter table public.faq enable row level security;
alter table public.coupons enable row level security;
alter table public.promotions enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;
alter table public.site_settings enable row level security;
alter table public.seo_settings enable row level security;

-- Setup read access for public
create policy "Public Select Categories" on public.room_categories for select using (true);
create policy "Public Select Rooms" on public.rooms for select using (true);
create policy "Public Select Testimonials" on public.testimonials for select using (true);
create policy "Public Select Galleries" on public.galleries for select using (true);
create policy "Public Select Blog Categories" on public.blog_categories for select using (true);
create policy "Public Select Blogs" on public.blogs for select using (true);
create policy "Public Select FAQ" on public.faq for select using (true);
create policy "Public Select Coupons" on public.coupons for select using (true);
create policy "Public Select Promotions" on public.promotions for select using (true);
create policy "Public Select Settings" on public.site_settings for select using (true);
create policy "Public Select SEO" on public.seo_settings for select using (true);

-- Guest Actions
create policy "Guest Insert Customer" on public.customers for insert with check (true);
create policy "Guest Insert Booking" on public.bookings for insert with check (true);

-- Admin Full Access Policies (Authenticated users)
create policy "Admin All Roles" on public.roles for all using (auth.role() = 'authenticated');
create policy "Admin All Profiles" on public.profiles for all using (auth.role() = 'authenticated');
create policy "Admin All Categories" on public.room_categories for all using (auth.role() = 'authenticated');
create policy "Admin All Rooms" on public.rooms for all using (auth.role() = 'authenticated');
create policy "Admin All Statuses" on public.booking_status for all using (auth.role() = 'authenticated');
create policy "Admin All Customers" on public.customers for all using (auth.role() = 'authenticated');
create policy "Admin All Bookings" on public.bookings for all using (auth.role() = 'authenticated');
create policy "Admin All Testimonials" on public.testimonials for all using (auth.role() = 'authenticated');
create policy "Admin All Galleries" on public.galleries for all using (auth.role() = 'authenticated');
create policy "Admin All Blog Categories" on public.blog_categories for all using (auth.role() = 'authenticated');
create policy "Admin All Blogs" on public.blogs for all using (auth.role() = 'authenticated');
create policy "Admin All FAQ" on public.faq for all using (auth.role() = 'authenticated');
create policy "Admin All Coupons" on public.coupons for all using (auth.role() = 'authenticated');
create policy "Admin All Promotions" on public.promotions for all using (auth.role() = 'authenticated');
create policy "Admin All Notifications" on public.notifications for all using (auth.role() = 'authenticated');
create policy "Admin All Logs" on public.activity_logs for all using (auth.role() = 'authenticated');
create policy "Admin All Settings" on public.site_settings for all using (auth.role() = 'authenticated');
create policy "Admin All SEO" on public.seo_settings for all using (auth.role() = 'authenticated');

-- =======================================================
-- INITIAL SEED RECORDS FOR STATUS & SETTINGS
-- =======================================================
insert into public.booking_status (name) values ('pending'), ('confirmed'), ('cancelled'), ('completed') on conflict do nothing;

insert into public.site_settings (id, site_name, hero_title_en, hero_title_id, hero_subtitle_en, hero_subtitle_id, whatsapp_number, email, address, footer_text_en, footer_text_id)
values (
    'general',
    'Aurelia Luxury Retreats',
    'Uncover the True Meaning of Luxury Living',
    'Temukan Arti Sebenarnya dari Hunian Mewah',
    'A premium retreat tucked away in pure nature, designed for absolute serenity.',
    'Tempat peristirahatan premium yang tersembunyi di alam murni, dirancang untuk ketenangan mutlak.',
    '6281234567890',
    'concierge@aureliaretreats.com',
    'Jl. Raya Tirta Tawar No. 88, Ubud, Bali, Indonesia',
    'Experience premium living and high-end serenity at our selected luxury homestays.',
    'Rasakan hunian premium dan ketenangan kelas atas di homestay mewah pilihan kami.'
) on conflict do nothing;
