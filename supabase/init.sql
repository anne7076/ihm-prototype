-- ============================================================
-- Agenda Musique Rennes - Supabase PostgreSQL Schema & Seed
-- Paste this entire file into Supabase SQL Editor and click Run.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.venues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION DEFAULT 48.1113,
  lng DOUBLE PRECISION DEFAULT -1.68
);

CREATE TABLE IF NOT EXISTS public.creators (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL,
  friend_followers INTEGER DEFAULT 0,
  bio TEXT,
  avatar_url TEXT,
  followers_count INTEGER DEFAULT 120,
  main_genre_id TEXT REFERENCES public.tags(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  tag_id TEXT NOT NULL REFERENCES public.tags(id),
  creator_id TEXT REFERENCES public.creators(id) ON DELETE SET NULL,
  venue_id TEXT REFERENCES public.venues(id) ON DELETE SET NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  image_url TEXT NOT NULL,
  site_url TEXT,
  ticket_url TEXT,
  hashtags TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  creator_id TEXT NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL DEFAULT 'user-001',
  PRIMARY KEY (creator_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.favorites (
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL DEFAULT 'user-001',
  PRIMARY KEY (event_id, user_id)
);

-- Public prototype access (RLS disabled + open grants for anon/authenticated)
ALTER TABLE public.tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites DISABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Seed tags
INSERT INTO public.tags (id, name, color) VALUES ('rock', 'Rock', '#ef5a5a') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.tags (id, name, color) VALUES ('electro', 'Electro', '#4e8ff7') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.tags (id, name, color) VALUES ('jazz', 'Jazz', '#e0a800') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.tags (id, name, color) VALUES ('pop', 'Pop', '#a86ae3') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.tags (id, name, color) VALUES ('reggae', 'Reggae', '#55ae78') ON CONFLICT (id) DO NOTHING;

-- Seed venues
INSERT INTO public.venues (id, name, address, lat, lng) VALUES ('etage', 'L''Étage', '1 Esplanade Charles de Gaulle, Rennes', 48.1054, -1.6775) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venues (id, name, address, lat, lng) VALUES ('gilbert', 'Chez Gilbert', 'Place Sainte-Anne, Rennes', 48.1144, -1.6808) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venues (id, name, address, lat, lng) VALUES ('ubu', 'L''Ubu', '1 Rue Saint-Hélier, Rennes', 48.1077, -1.6738) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venues (id, name, address, lat, lng) VALUES ('antipode', 'L''Antipode', '75 Avenue Jules Maniez, Rennes', 48.0988, -1.7126) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venues (id, name, address, lat, lng) VALUES ('barhic', 'Le Bar''Hic', '24 Place des Lices, Rennes', 48.113, -1.683) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venues (id, name, address, lat, lng) VALUES ('triangle', 'Le Triangle', 'Boulevard de Yougoslavie, Rennes', 48.1113, -1.68) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venues (id, name, address, lat, lng) VALUES ('mondo', 'Le Mondo Bizarro', 'Rue de la Santé, Rennes', 48.112, -1.679) ON CONFLICT (id) DO NOTHING;

-- Seed creators
INSERT INTO public.creators (id, name, kind, friend_followers, bio, avatar_url, followers_count, main_genre_id) VALUES ('etage', 'L''Étage', 'Salle', 0, 'Salle de concert moderne perchée au-dessus du Liberté, dédiée aux musiques actuelles, découvertes émergentes et têtes d''affiche rock et pop.', '/images/events/rock-concert.jpg', 1420, 'rock') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.creators (id, name, kind, friend_followers, bio, avatar_url, followers_count, main_genre_id) VALUES ('neon', 'Neon Pulse', 'Artiste', 0, 'Duo rennais de synthwave et musique électronique modulaire créant des atmosphères cinématiques rétro-futuristes.', '/images/events/electro-lights.jpg', 890, 'electro') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.creators (id, name, kind, friend_followers, bio, avatar_url, followers_count, main_genre_id) VALUES ('gilbert', 'Chez Gilbert', 'Bar', 0, 'Bistrot chaleureux de la place Sainte-Anne réputé pour ses sessions acoustiques, ses jams jazz et son ambiance conviviale.', '/images/events/jazz-band.jpg', 650, 'jazz') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.creators (id, name, kind, friend_followers, bio, avatar_url, followers_count, main_genre_id) VALUES ('lola', 'Lola Vance', 'Artiste', 0, 'Autrice-compositrice-interprète rennaise mêlant indie pop solaire, textes poétiques en français et mélodies entraînantes.', '/images/events/pop-singer.jpg', 1240, 'pop') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.creators (id, name, kind, friend_followers, bio, avatar_url, followers_count, main_genre_id) VALUES ('antipode', 'L''Antipode', 'Salle', 0, 'Scène majeure et tiers-lieu culturel rennais axé sur les musiques actuelles, le dub, le hip-hop et la création citoyenne.', '/images/events/reggae-outdoor.jpg', 3100, 'reggae') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.creators (id, name, kind, friend_followers, bio, avatar_url, followers_count, main_genre_id) VALUES ('ubu', 'L''Ubu', 'Salle', 4, 'Le temple historique des Trans Musicales de Rennes. Une acoustique brute et une programmation défricheuse depuis plus de 30 ans.', '/images/events/electro-lights.jpg', 4200, 'electro') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.creators (id, name, kind, friend_followers, bio, avatar_url, followers_count, main_genre_id) VALUES ('moon', 'Møon', 'Artiste', 3, 'Quatuor rock alternatif et post-punk aux guitares acérées et riffs puissants, révélation des scènes rennaises.', '/images/events/rock-concert.jpg', 520, 'rock') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.creators (id, name, kind, friend_followers, bio, avatar_url, followers_count, main_genre_id) VALUES ('barhic', 'Le Bar''Hic', 'Bar', 2, 'Institution festive des Lices, accueillant DJ sets, concerts pop-rock intimistes et scènes ouvertes hebdomadaires.', '/images/events/pop-singer.jpg', 980, 'pop') ON CONFLICT (id) DO NOTHING;

-- Seed events
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-001', 'Soirée Garage Rennaise', 'Trois groupes garage de la scène locale pour une soirée sans compromis.', 'rock', 'moon', 'mondo', '2026-10-28', '20:00', '23:00', 'https://images.unsplash.com/photo-1473691955023-da1c49c95c78?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'scenelocale') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-002', 'Neon Pulse Live', 'Sets modulaires et visuels immersifs sous les voûtes de l''Ubu.', 'electro', 'neon', 'ubu', '2026-10-30', '21:00', '01:00', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'live') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-003', 'Sunday Reggae Brunch', 'Brunch dominical, vinyles roots et sound system en terrasse.', 'reggae', 'antipode', 'antipode', '2026-11-01', '11:00', '15:00', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'gratuit') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-004', 'The Velvet Club', 'Une immersion rock chaleureuse pour démarrer la semaine en musique au cœur de Rennes.', 'rock', 'etage', 'etage', '2026-11-02', '19:00', '22:00', 'https://images.unsplash.com/photo-1473691955023-da1c49c95c78?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'concert') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-005', 'Jazz à midi', 'Pause déjeuner en musique : standards bebop et jazz acoustique feutré au bar.', 'jazz', 'gilbert', 'gilbert', '2026-11-03', '12:00', '14:00', 'https://images.unsplash.com/photo-1577042816206-2e85c23f2392?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'gratuit,dejeuner') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-006', 'Neon Pulse', 'Sets live d''électro mélodique et projections lumineuses. Ouverture des portes à 20h30.', 'electro', 'neon', 'ubu', '2026-11-03', '21:00', '01:00', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, 'https://www.rennes.fr', 'live') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-007', 'Open Air', 'Session dub et reggae en plein air avec sound system local.', 'reggae', 'antipode', 'antipode', '2026-11-04', '18:00', '22:00', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'plein-air,gratuit') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-008', 'Pop Session', 'Découverte des nouvelles voix pop alternatives de Bretagne, en format acoustique.', 'pop', 'lola', 'barhic', '2026-11-05', '20:00', '23:00', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'acoustique') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-009', 'Festival Bars ''n Breizh', 'Une soirée électrique au cœur de Rennes avec trois groupes bretons. Guitares, énergie live et découvertes locales au programme. Au programme : The Velvet Club, le trio garage Møon et les riffs électriques de Red Harbor. Ouverture des portes à 20h.', 'rock', 'etage', 'etage', '2026-11-06', '20:30', '23:30', 'https://images.unsplash.com/photo-1473691955023-da1c49c95c78?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', 'https://www.rennes.fr', 'https://www.rennes.fr', 'festival,scenelocale') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-010', 'Jam Session Jazz', 'Musiciens confirmés et jeunes talents se retrouvent pour une session libre, chaleureuse et pleine d''improvisations.', 'jazz', 'gilbert', 'gilbert', '2026-11-06', '21:00', '00:00', 'https://images.unsplash.com/photo-1577042816206-2e85c23f2392?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'jam,gratuit') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-011', 'Electric Night', 'Nuit électro underground avec sets continus et scénographie lumineuse.', 'electro', 'neon', 'triangle', '2026-11-06', '22:00', '03:00', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, 'https://www.rennes.fr', 'nuit') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-012', 'Rock Garden', 'Après-midi indie et garage rock en accès libre, bar et food trucks sur place.', 'rock', 'etage', 'etage', '2026-11-07', '16:00', '19:00', 'https://images.unsplash.com/photo-1473691955023-da1c49c95c78?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'gratuit,indie') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-013', 'Nuit Électro', 'Line-up de DJ rennais et invités pour une nuit de techno et house.', 'electro', NULL, 'triangle', '2026-11-07', '22:00', '04:00', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'nuit,dj') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-014', 'Sunday Groove', 'Brunch dominical musical : vinyles, groove et détente.', 'reggae', 'antipode', 'antipode', '2026-11-08', '11:00', '15:00', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'brunch') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-015', 'Lundi Acoustique', 'Scène ouverte acoustique : viens jouer ou simplement écouter.', 'pop', 'lola', 'barhic', '2026-11-09', '20:00', '23:00', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'scene-ouverte,gratuit') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-016', 'Blues & Bretagne', 'Un quartet blues-jazz revisite des classiques avec des accents celtiques.', 'jazz', 'gilbert', 'gilbert', '2026-11-10', '19:30', '22:30', 'https://images.unsplash.com/photo-1577042816206-2e85c23f2392?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'concert') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-017', 'Afterwork Reggae', 'Pour terminer la journée en douceur : reggae et rocksteady en terrasse.', 'reggae', 'antipode', 'antipode', '2026-11-11', '18:30', '20:30', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'afterwork') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-018', 'Garage Night', 'Soirée garage rock avec Møon et ses invités.', 'rock', 'moon', 'mondo', '2026-11-11', '20:00', '23:00', 'https://images.unsplash.com/photo-1473691955023-da1c49c95c78?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'scenelocale') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-019', 'Indie Pop Showcase', 'Quatre artistes pop indé en showcase, découvertes garanties.', 'pop', 'lola', 'ubu', '2026-11-12', '20:30', '23:30', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, 'https://www.rennes.fr', 'showcase') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-020', 'Rennes Rock Fest', 'Le rendez-vous annuel des amateurs de rock : six groupes sur deux scènes.', 'rock', 'ubu', 'ubu', '2026-11-13', '19:00', '23:00', 'https://images.unsplash.com/photo-1473691955023-da1c49c95c78?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', 'https://www.rennes.fr', 'https://www.rennes.fr', 'festival') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-021', 'Techno Warehouse', 'Soirée techno dans un décor industriel, son massif et lumières laser.', 'electro', 'neon', 'triangle', '2026-11-13', '21:00', '02:00', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'nuit') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-022', 'Jazz Brunch Concert', 'Concert jazz en terrasse, brunch servi toute l''après-midi.', 'jazz', 'gilbert', 'gilbert', '2026-11-14', '15:00', '18:00', 'https://images.unsplash.com/photo-1577042816206-2e85c23f2392?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'brunch') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-023', 'Dub Sound System', 'Soirée dub avec sound system et invités.', 'reggae', 'antipode', 'antipode', '2026-11-14', '20:00', '00:00', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'dub') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-024', 'Concert de clôture', 'Concert de clôture de la semaine : formats courts et invités surprise.', 'pop', 'lola', 'barhic', '2026-11-15', '17:00', '20:00', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'gratuit') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-025', 'Open Mic Rock', 'Scène ouverte rock : inscris ton groupe sur place.', 'rock', 'etage', 'etage', '2026-11-17', '20:00', '23:00', 'https://images.unsplash.com/photo-1473691955023-da1c49c95c78?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'scene-ouverte') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-026', 'Synthwave Night', 'Voyage rétro-futuriste en synthwave et italo disco.', 'electro', 'neon', 'ubu', '2026-11-19', '21:00', '01:00', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'retro') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.events (id, title, description, tag_id, creator_id, venue_id, date, start_time, end_time, image_url, site_url, ticket_url, hashtags) VALUES ('evt-027', 'Pop Revival', 'Les hits pop qui ont marqué les années 2000 en version live.', 'pop', NULL, 'mondo', '2026-11-21', '20:30', '23:30', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000', NULL, NULL, 'live') ON CONFLICT (id) DO NOTHING;

-- Seed subscriptions
INSERT INTO public.subscriptions (creator_id, user_id) VALUES ('etage', 'user-001') ON CONFLICT DO NOTHING;
INSERT INTO public.subscriptions (creator_id, user_id) VALUES ('neon', 'user-001') ON CONFLICT DO NOTHING;
INSERT INTO public.subscriptions (creator_id, user_id) VALUES ('gilbert', 'user-001') ON CONFLICT DO NOTHING;
INSERT INTO public.subscriptions (creator_id, user_id) VALUES ('lola', 'user-001') ON CONFLICT DO NOTHING;
INSERT INTO public.subscriptions (creator_id, user_id) VALUES ('antipode', 'user-001') ON CONFLICT DO NOTHING;

-- Seed favorites
INSERT INTO public.favorites (event_id, user_id) VALUES ('evt-009', 'user-001') ON CONFLICT DO NOTHING;
