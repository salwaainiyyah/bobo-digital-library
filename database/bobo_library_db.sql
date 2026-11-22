--
-- PostgreSQL database dump
--

\restrict bejZE4Ny9OAKlXaEQ1nbumlmULMIfmBMYJX79IidOM9I181rlY6mQTd6ERwaZdN

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-11-21 16:58:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 18971)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 19108)
-- Name: announcements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.announcements (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    category character varying(30) NOT NULL,
    release_at date DEFAULT CURRENT_DATE NOT NULL,
    status character varying(20) DEFAULT 'DRAFT'::character varying NOT NULL,
    created_by integer,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT announcements_category_check CHECK (((category)::text = ANY ((ARRAY['OPERASIONAL'::character varying, 'LAYANAN'::character varying, 'ACARA'::character varying])::text[]))),
    CONSTRAINT announcements_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'PUBLISHED'::character varying])::text[])))
);


ALTER TABLE public.announcements OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 19107)
-- Name: announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.announcements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.announcements_id_seq OWNER TO postgres;

--
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 227
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;


--
-- TOC entry 226 (class 1259 OID 19070)
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    isbn character varying(30) NOT NULL,
    author character varying(150) NOT NULL,
    publisher character varying(150) NOT NULL,
    publication_year integer NOT NULL,
    category_id integer NOT NULL,
    stock_total integer NOT NULL,
    stock_available integer NOT NULL,
    loan_duration_days integer DEFAULT 7 NOT NULL,
    fine_per_day numeric(12,2) DEFAULT 1000.00 NOT NULL,
    cover_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT books_check CHECK (((stock_available >= 0) AND (stock_available <= stock_total))),
    CONSTRAINT books_fine_per_day_check CHECK ((fine_per_day >= (0)::numeric)),
    CONSTRAINT books_loan_duration_days_check CHECK ((loan_duration_days > 0)),
    CONSTRAINT books_publication_year_check CHECK (((publication_year >= 1500) AND (publication_year <= 2100))),
    CONSTRAINT books_stock_total_check CHECK ((stock_total >= 0))
);


ALTER TABLE public.books OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 19069)
-- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.books_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.books_id_seq OWNER TO postgres;

--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 225
-- Name: books_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.books_id_seq OWNED BY public.books.id;


--
-- TOC entry 224 (class 1259 OID 19051)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    classification_code character varying(30) NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 19050)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 223
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 234 (class 1259 OID 19206)
-- Name: fines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fines (
    id integer NOT NULL,
    loan_id integer NOT NULL,
    student_id integer NOT NULL,
    days_late integer DEFAULT 0 NOT NULL,
    daily_rate_snapshot numeric(12,2) NOT NULL,
    amount numeric(12,2) DEFAULT 0.00 NOT NULL,
    status character varying(20) DEFAULT 'UNPAID'::character varying NOT NULL,
    assessed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    paid_at timestamp with time zone,
    paid_by integer,
    payment_method character varying(50) DEFAULT 'Tunai'::character varying,
    payment_note text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fines_amount_check CHECK ((amount >= (0)::numeric)),
    CONSTRAINT fines_daily_rate_snapshot_check CHECK ((daily_rate_snapshot >= (0)::numeric)),
    CONSTRAINT fines_days_late_check CHECK ((days_late >= 0)),
    CONSTRAINT fines_status_check CHECK (((status)::text = ANY ((ARRAY['UNPAID'::character varying, 'PAID'::character varying])::text[])))
);


ALTER TABLE public.fines OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 19205)
-- Name: fines_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fines_id_seq OWNER TO postgres;

--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 233
-- Name: fines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fines_id_seq OWNED BY public.fines.id;


--
-- TOC entry 230 (class 1259 OID 19134)
-- Name: loans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loans (
    id integer NOT NULL,
    student_id integer NOT NULL,
    book_id integer NOT NULL,
    status character varying(25) DEFAULT 'PENDING'::character varying NOT NULL,
    requested_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    approved_at timestamp with time zone,
    borrowed_at date,
    due_date date,
    returned_at date,
    approved_by integer,
    rejected_by integer,
    reject_reason text,
    duration_snapshot integer DEFAULT 7 NOT NULL,
    fine_rate_snapshot numeric(12,2) DEFAULT 1000.00 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT loans_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'BORROWED'::character varying, 'COMPLETED'::character varying, 'REJECTED'::character varying])::text[])))
);


ALTER TABLE public.loans OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 19133)
-- Name: loans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loans_id_seq OWNER TO postgres;

--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 229
-- Name: loans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loans_id_seq OWNED BY public.loans.id;


--
-- TOC entry 232 (class 1259 OID 19176)
-- Name: renewal_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.renewal_requests (
    id integer NOT NULL,
    loan_id integer NOT NULL,
    status character varying(25) DEFAULT 'PENDING'::character varying NOT NULL,
    requested_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    reviewed_at timestamp with time zone,
    reviewed_by integer,
    old_due_date date NOT NULL,
    new_due_date date,
    extension_days integer DEFAULT 7 NOT NULL,
    rejection_reason text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT renewal_requests_extension_days_check CHECK ((extension_days > 0)),
    CONSTRAINT renewal_requests_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying])::text[])))
);


ALTER TABLE public.renewal_requests OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 19175)
-- Name: renewal_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.renewal_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.renewal_requests_id_seq OWNER TO postgres;

--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 231
-- Name: renewal_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.renewal_requests_id_seq OWNED BY public.renewal_requests.id;


--
-- TOC entry 236 (class 1259 OID 19250)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    loan_id integer NOT NULL,
    student_id integer NOT NULL,
    book_id integer NOT NULL,
    rating integer NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 19249)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 235
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 222 (class 1259 OID 19032)
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id integer NOT NULL,
    token_hash character varying(64) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoked_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 19010)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash text NOT NULL,
    role character varying(20) NOT NULL,
    identity_number character varying(50),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'pegawai'::character varying, 'mahasiswa'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 19009)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4948 (class 2604 OID 19111)
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);


--
-- TOC entry 4942 (class 2604 OID 19073)
-- Name: books id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books ALTER COLUMN id SET DEFAULT nextval('public.books_id_seq'::regclass);


--
-- TOC entry 4939 (class 2604 OID 19054)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 4965 (class 2604 OID 19209)
-- Name: fines id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fines ALTER COLUMN id SET DEFAULT nextval('public.fines_id_seq'::regclass);


--
-- TOC entry 4953 (class 2604 OID 19137)
-- Name: loans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans ALTER COLUMN id SET DEFAULT nextval('public.loans_id_seq'::regclass);


--
-- TOC entry 4960 (class 2604 OID 19179)
-- Name: renewal_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.renewal_requests ALTER COLUMN id SET DEFAULT nextval('public.renewal_requests_id_seq'::regclass);


--
-- TOC entry 4973 (class 2604 OID 19253)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 4933 (class 2604 OID 19013)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5212 (class 0 OID 19108)
-- Dependencies: 228
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.announcements VALUES (1, 'Layanan Perpustakaan Digital Bo''bo Resmi Beroperasi', 'Selamat datang di Perpustakaan Digital Kampus Bo''bo (ᨅᨚᨅᨚ). Seluruh civitas akademika kini dapat menelusuri katalog buku, mengajukan permohonan peminjaman, serta memantau status sirkulasi secara daring. Pengambilan buku fisik tetap dilayani di meja sirkulasi Lantai 1.', 'LAYANAN', '2026-11-13', 'PUBLISHED', 1, '2026-11-13 17:15:40.331895+08', '2026-11-18 17:15:40.331895+08', '2026-11-18 17:15:40.331895+08');
INSERT INTO public.announcements VALUES (4, 'Pemberitahuan Rencana Pemeliharaan Server Database (Draft)', 'Akan dilakukan upgrade berkala pada server basis data PostgreSQL sirkulasi pada akhir pekan ini. Pengumuman ini masih dalam tahap peninjauan internal staf perpustakaan.', 'OPERASIONAL', '2026-11-21', 'DRAFT', 1, NULL, '2026-11-18 17:15:40.331895+08', '2026-11-18 17:15:40.331895+08');
INSERT INTO public.announcements VALUES (2, 'Jadwal Layanan Meja Sirkulasi Selama Pekan Ujian Akhir', 'Diberitahukan kepada seluruh mahasiswa bahwa selama pekan Ujian Akhir Semester (UAS), jam buka meja sirkulasi diperpanjang hingga pukul 18.00 WITA (Senin - Jumat) dan pukul 14.00 WITA pada hari Sabtu.', 'OPERASIONAL', '2026-11-16', 'PUBLISHED', NULL, '2026-11-16 17:15:40.331895+08', '2026-11-18 17:15:40.331895+08', '2026-11-18 17:15:40.331895+08');
INSERT INTO public.announcements VALUES (3, 'Workshop Digitalisasi Naskah Kuno & Preservasi Lontara', 'Perpustakaan Bo''bo bekerja sama dengan Departemen Sastra Daerah menyelenggarakan workshop teknik digitalisasi naskah kuno Lontara. Kegiatan akan dilaksanakan pada hari Sabtu, 28 November 2026 di Ruang Multimedia Perpustakaan.', 'ACARA', '2026-11-18', 'PUBLISHED', NULL, '2026-11-18 17:15:40.331895+08', '2026-11-18 17:15:40.331895+08', '2026-11-18 17:15:40.331895+08');


--
-- TOC entry 5210 (class 0 OID 19070)
-- Dependencies: 226
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.books VALUES (1, 'Sistem Basis Data', '978-602-62-3266-3', 'Fathansyah', 'Informatika Bandung', 2018, 1, 15, 15, 7, 1000.00, '/uploads/books/sistem-basis-data-fathansyah.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (2, 'Algoritma dan Pemrograman dalam Bahasa Pascal, C, dan C++', '978-602-62-3211-3', 'Rinaldi Munir', 'Informatika Bandung', 2018, 1, 14, 14, 7, 1000.00, '/uploads/books/algoritma-pemrograman-rinaldi.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (3, 'Rekayasa Perangkat Lunak Terstruktur dan Berorientasi Objek', '978-602-62-3265-6', 'Rosa A.S. & M. Shalahuddin', 'Informatika Bandung', 2018, 1, 12, 12, 7, 1000.00, '/uploads/books/rekayasa-perangkat-lunak-rosa.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (4, 'Clean Code: A Handbook of Agile Software Craftsmanship', '978-013-23-5088-4', 'Robert C. Martin', 'Prentice Hall', 2008, 1, 10, 10, 7, 1500.00, '/uploads/books/clean-code.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (5, 'Manusia Bugis', '978-979-99-3812-1', 'Christian Pelras', 'Nalar & Forum Jakarta-Paris', 2006, 2, 10, 10, 7, 1000.00, '/uploads/books/manusia-bugis.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (6, 'Latoa: Satu Lukisan Analitis terhadap Antropologi Politik Orang Bugis', '978-602-25-8312-7', 'Prof. Dr. Mattulada', 'Penerbit Ombak', 2015, 2, 10, 10, 7, 1000.00, '/uploads/books/latoa-mattulada.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (7, 'I La Galigo', '978-979-42-8389-9', 'Arung Pancana Toa (Transkripsi Muhammad Salim)', 'Djambatan & KITLV', 2000, 2, 8, 8, 7, 1000.00, '/uploads/books/i-la-galigo.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (8, 'Pengantar Ilmu Hukum', '978-979-39-2589-9', 'Prof. Dr. Peter Mahmud Marzuki, S.H., M.S., LL.M.', 'Kencana Prenada Media', 2017, 3, 14, 14, 7, 1000.00, '/uploads/books/pengantar-ilmu-hukum-marzuki.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (10, 'Ilmu Kesehatan Masyarakat: Prinsip-Prinsip Dasar', '978-979-51-8892-6', 'Prof. Dr. Soekidjo Notoatmodjo', 'Rineka Cipta', 2011, 4, 15, 15, 7, 1000.00, '/uploads/books/ilmu-kesehatan-masyarakat-soekidjo.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (11, 'Dasar-Dasar Epidemiologi', '978-979-44-8612-2', 'Dr. Eko Budiarto, SKM', 'Penerbit Buku Kedokteran EGC', 2003, 4, 12, 12, 7, 1000.00, '/uploads/books/dasar-dasar-epidemiologi-eko.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (12, 'Pengantar Ilmu Ekonomi (Mikroekonomi & Makroekonomi)', '978-979-92-4265-5', 'Prathama Rahardja & Mandala Manurung', 'Lembaga Penerbit FEUI', 2008, 5, 14, 14, 7, 1000.00, '/uploads/books/pengantar-ilmu-ekonomi-prathama.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (13, 'Manajemen (Edisi Ketiga Belas)', '978-602-29-8841-0', 'Stephen P. Robbins & Mary Coulter', 'Erlangga', 2016, 5, 12, 12, 7, 1000.00, '/uploads/books/manajemen-robbins-coulter.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (14, 'Entrok', '978-979-22-5589-8', 'Okky Madasari', 'Gramedia Pustaka Utama', 2010, 6, 3, 3, 7, 1000.00, '/uploads/books/entrok.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (15, 'Dari Dalam Kubur', '978-979-12-6071-8', 'Soe Tjen Marching', 'Marjin Kiri', 2020, 6, 2, 2, 7, 1000.00, '/uploads/books/dari-dalam-kubur.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (16, 'Lebih Putih Dariku', '978-602-06-4412-7', 'Penulis Indonesia', 'Gramedia Pustaka Utama', 2021, 6, 2, 2, 7, 1000.00, '/uploads/books/lebih-putih-dariku.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (17, 'Ronggeng Dukuh Paruk', '978-979-22-0196-3', 'Ahmad Tohari', 'Gramedia Pustaka Utama', 2003, 6, 3, 3, 7, 1000.00, '/uploads/books/ronggeng-dukuh-paruk.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (18, 'The Kite Runner', '978-159-46-3193-1', 'Khaled Hosseini', 'Riverhead Books', 2003, 6, 3, 3, 7, 1000.00, '/uploads/books/the-kite-runner.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (19, 'A Thousand Splendid Suns', '978-159-44-8950-1', 'Khaled Hosseini', 'Riverhead Books', 2007, 6, 3, 3, 7, 1000.00, '/uploads/books/a-thousand-splendid-suns.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (20, 'And the Mountains Echoed', '978-159-46-3176-4', 'Khaled Hosseini', 'Riverhead Books', 2013, 6, 2, 2, 7, 1000.00, '/uploads/books/and-the-mountains-echoed.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (21, 'Pulang', '978-979-91-0515-8', 'Leila S. Chudori', 'Kepustakaan Populer Gramedia', 2012, 6, 3, 3, 7, 1000.00, '/uploads/books/pulang-leila-chudori.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (22, 'Namaku Alam', '978-602-48-1998-9', 'Leila S. Chudori', 'Kepustakaan Populer Gramedia', 2023, 6, 3, 3, 7, 1000.00, '/uploads/books/namaku-alam.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (23, '9 dari Nadira', '978-979-91-0174-7', 'Leila S. Chudori', 'Kepustakaan Populer Gramedia', 2009, 6, 2, 2, 7, 1000.00, '/uploads/books/9-dari-nadira.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (24, 'Malam Terakhir', '978-979-91-0175-4', 'Leila S. Chudori', 'Kepustakaan Populer Gramedia', 1989, 6, 2, 2, 7, 1000.00, '/uploads/books/malam-terakhir.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (25, 'The Hunger Games', '978-043-90-2348-1', 'Suzanne Collins', 'Scholastic Press', 2008, 6, 3, 3, 7, 1000.00, '/uploads/books/the-hunger-games-1.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (26, 'The Hunger Games: Catching Fire', '978-043-90-2349-8', 'Suzanne Collins', 'Scholastic Press', 2009, 6, 3, 3, 7, 1000.00, '/uploads/books/the-hunger-games-2-catching-fire.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (27, 'The Hunger Games: Mockingjay', '978-054-56-6326-7', 'Suzanne Collins', 'Scholastic Press', 2010, 6, 3, 3, 7, 1000.00, '/uploads/books/the-hunger-games-3-mockingjay.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (28, 'The Ballad of Songbirds and Snakes', '978-133-86-3517-1', 'Suzanne Collins', 'Scholastic Press', 2020, 6, 2, 2, 7, 1000.00, '/uploads/books/the-hunger-games-4-ballad-songbirds-snakes.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (29, 'Bumi Manusia', '978-979-97-3123-4', 'Pramoedya Ananta Toer', 'Lentera Dipantara', 2005, 6, 3, 3, 7, 1000.00, '/uploads/books/bumi-manusia.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (30, 'Laut Bercerita', '978-602-42-4694-5', 'Leila S. Chudori', 'Kepustakaan Populer Gramedia', 2017, 6, 3, 3, 7, 1000.00, '/uploads/books/laut-bercerita.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (31, 'Madilog: Materialisme, Dialektika, dan Logika', '978-602-66-8205-5', 'Tan Malaka', 'Narasi', 2016, 7, 3, 3, 7, 1000.00, '/uploads/books/madilog.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (32, 'Pendidikan Kaum Tertindas (Pedagogy of the Oppressed)', '978-979-33-3074-7', 'Paulo Freire', 'LP3ES', 2008, 7, 2, 2, 7, 1000.00, '/uploads/books/pendidikan-kaum-tertindas.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (33, 'Kapital: Kritik atas Ekonomi Politik (Jilid I)', '978-602-83-3142-5', 'Karl Marx', 'Hasta Mitra & Ultimus', 2014, 7, 2, 2, 7, 1500.00, '/uploads/books/das-kapital.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (34, 'Di Bawah Bendera Revolusi (Jilid 1)', '978-979-95-4120-8', 'Ir. Soekarno', 'Yayasan Bung Karno', 2015, 7, 2, 2, 7, 1000.00, '/uploads/books/di-bawah-bendera-revolusi.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (35, 'Catatan Seorang Demonstran', '978-979-33-3041-9', 'Soe Hok Gie', 'LP3ES', 2011, 7, 3, 3, 7, 1000.00, '/uploads/books/catatan-seorang-demonstran.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 15:57:47.669491+08');
INSERT INTO public.books VALUES (36, 'Serikat Buruh 1945-1948: Menduduki Stasiun, Menguasai Perkebunan, Menjalankan Pabrik', '978-602-0788-57-9', 'Jafar Suryomenggolo', 'Marjin Kiri', 2014, 7, 5, 5, 7, 1000.00, '/uploads/books/1795250692785-53e6c8f3be5b.webp', true, '2026-11-21 16:44:52.792321+08', '2026-11-21 16:44:52.792321+08');
INSERT INTO public.books VALUES (9, 'Hukum Laut Internasional', '978-979-41-4052-9', 'Prof. Dr. Mochtar Kusumaatmadja', 'Binacipta', 2003, 3, 12, 12, 7, 1000.00, '/uploads/books/hukum-laut-internasional-mochtar.jpg', true, '2026-11-21 15:57:47.669491+08', '2026-11-21 16:51:31.922151+08');


--
-- TOC entry 5208 (class 0 OID 19051)
-- Dependencies: 224
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categories VALUES (1, 'Teknologi Informasi & Komputer', 'TIK-001', 'Buku ajar basis data, algoritma pemrograman, rekayasa perangkat lunak, dan komputasi.', true, '2026-11-21 15:56:03.815337+08');
INSERT INTO public.categories VALUES (2, 'Sastra & Budaya Bugis-Makassar', 'SBB-002', 'Kajian naskah Lontara, antropologi budaya, sejarah, dan falsafah Sulawesi Selatan.', true, '2026-11-21 15:56:03.815337+08');
INSERT INTO public.categories VALUES (3, 'Hukum & Kemaritiman', 'HKM-003', 'Buku ajar pengantar ilmu hukum, hukum laut internasional, dan tata negara.', true, '2026-11-21 15:56:03.815337+08');
INSERT INTO public.categories VALUES (4, 'Kedokteran & Ilmu Kesehatan', 'KDK-004', 'Referensi ilmu kesehatan masyarakat, epidemiologi, dan kesehatan komunitas.', true, '2026-11-21 15:56:03.815337+08');
INSERT INTO public.categories VALUES (5, 'Ekonomi & Manajemen Bisnis', 'EKB-007', 'Buku ajar pengantar ilmu ekonomi mikro-makro dan manajemen organisasi.', true, '2026-11-21 15:56:03.815337+08');
INSERT INTO public.categories VALUES (6, 'Sastra & Fiksi', 'SFI-005', 'Koleksi novel sastra Indonesia, fiksi sejarah, dan fiksi populer dunia.', true, '2026-11-21 15:56:03.815337+08');
INSERT INTO public.categories VALUES (7, 'Filsafat, Sosiologi & Pemikiran Kritis', 'FPK-006', 'Kajian filsafat materialisme, dialektika, sosiologi kritis, dan sejarah pergerakan.', true, '2026-11-21 15:56:03.815337+08');


--
-- TOC entry 5218 (class 0 OID 19206)
-- Dependencies: 234
-- Data for Name: fines; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5214 (class 0 OID 19134)
-- Dependencies: 230
-- Data for Name: loans; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5216 (class 0 OID 19176)
-- Dependencies: 232
-- Data for Name: renewal_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5220 (class 0 OID 19250)
-- Dependencies: 236
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5206 (class 0 OID 19032)
-- Dependencies: 222
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sessions VALUES ('93fae421-0944-40f4-88a6-0331a6794f96', 1, 'b3b0d9df8711fd944acf452085f72428d1eaf2c6349fe2f9da31314248c603ae', '2026-11-25 17:41:25.986+08', '2026-11-18 17:42:48.955924+08', '2026-11-18 17:41:25.988095+08');
INSERT INTO public.sessions VALUES ('6f5e4682-51d9-42db-af9e-4420482d4103', 1, 'e14bae27931312438234f4cc824bb29fab63860efcb7b84410381abcce85814e', '2026-11-27 21:28:36.263+08', '2026-11-20 21:31:44.309667+08', '2026-11-20 21:28:36.264603+08');
INSERT INTO public.sessions VALUES ('73f4f8ef-d8b5-42e8-8fb0-e8424b6074f2', 1, '6e71a4c4d1989e5d1ace242571669f233459b750488b51e8b1ca9bc5248895bc', '2026-11-27 23:31:28.287+08', '2026-11-20 23:36:51.392671+08', '2026-11-20 23:31:28.290759+08');
INSERT INTO public.sessions VALUES ('988d85c7-cf9f-4eda-af80-541ef2098446', 1, 'cfc27a2bb8794c0f06aa9905e23406f3823b6e74195666be619c866ac0c6b39b', '2026-11-27 23:38:13.225+08', '2026-11-21 01:12:02.837177+08', '2026-11-20 23:38:13.225704+08');
INSERT INTO public.sessions VALUES ('c790f73b-8297-4eb1-9046-32e1d168c09c', 1, 'cfbffcff281a8d3b1bbad6cd935450c8e8702a779747153ac250f23768161159', '2026-11-28 01:12:05.884+08', '2026-11-21 01:13:39.176657+08', '2026-11-21 01:12:05.885227+08');
INSERT INTO public.sessions VALUES ('d41e82ad-df5a-488c-90f9-78f45217beed', 1, 'f162055cea00b44ead7a2c0882518a069cd50c2d985b08be79bdbdb058fdd5d1', '2026-11-28 02:18:48.493+08', NULL, '2026-11-21 02:18:48.494336+08');
INSERT INTO public.sessions VALUES ('ce06f123-7bcf-421f-80a2-9dfc97fa5dca', 1, '668eb53ccb526dc859226852e25787ca3b14ce164fe04d6fa579a1fd5d1466e8', '2026-11-28 16:29:46.584+08', '2026-11-21 16:33:39.331874+08', '2026-11-21 16:29:46.588034+08');
INSERT INTO public.sessions VALUES ('6262fc4f-19d5-4bd5-8a46-d6aafa70327f', 7, 'cab4f1337bc099f09127ddd2880179d6a6f7fa09cee419165755ee5cfbdd78e0', '2026-11-28 16:33:53.955+08', '2026-11-21 16:34:05.828108+08', '2026-11-21 16:33:53.957057+08');
INSERT INTO public.sessions VALUES ('b49b1dae-b85c-4cf2-9d5e-5668d88060e4', 1, '2bcc16515460d70eae1e0f960ac5199404d4b0f08cfee3a1e93a906aeacb67e4', '2026-11-28 16:34:42.17+08', NULL, '2026-11-21 16:34:42.171419+08');


--
-- TOC entry 5205 (class 0 OID 19010)
-- Dependencies: 221
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'Administrator Bo''bo', 'admin@unhas.ac.id', '$2b$10$65MruMyjarCXKCmlEvLdauOW1MvOocGZMy9MsznG.77Y8NTQ/6bfC', 'admin', 'ADM-2026-001', true, '2026-11-18 17:15:40.331895+08', '2026-11-18 17:15:40.331895+08');
INSERT INTO public.users VALUES (6, 'Salwa Ainiyyah', 'salwa@student.unhas.ac.id', '$2b$12$mzD7DtXTs3KDC3v4Beoije84ZXwZmOkSyNiP32JMCrGan784yfPKa', 'mahasiswa', 'H071251032', true, '2026-11-21 16:32:19.901642+08', '2026-11-21 16:32:19.901642+08');
INSERT INTO public.users VALUES (7, 'Mahasiswa', 'mahasiswa@student.unhas.ac.id', '$2b$12$vGGavtcEc5/Ghfqj/kVpN.Gq/Op8mmk0Pp2vYyPiKFKIc06DOsRpW', 'mahasiswa', 'H123456789', true, '2026-11-21 16:33:02.071001+08', '2026-11-21 16:33:02.071001+08');
INSERT INTO public.users VALUES (8, 'pegawai 1', 'pegawai@unhas.ac.id', '$2b$12$./eRMLbd9/bX.0nqS6NPYuUncXruBOmgz1iloHPXzmJWtriwiWHNm', 'pegawai', 'P001', true, '2026-11-21 16:36:28.799307+08', '2026-11-21 16:36:28.799307+08');


--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 227
-- Name: announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.announcements_id_seq', 4, true);


--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 225
-- Name: books_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.books_id_seq', 36, true);


--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 223
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 7, true);


--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 233
-- Name: fines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fines_id_seq', 1, false);


--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 229
-- Name: loans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loans_id_seq', 1, false);


--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 231
-- Name: renewal_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.renewal_requests_id_seq', 1, false);


--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 235
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- TOC entry 5021 (class 2606 OID 19127)
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- TOC entry 5013 (class 2606 OID 19101)
-- Name: books books_isbn_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_isbn_key UNIQUE (isbn);


--
-- TOC entry 5015 (class 2606 OID 19099)
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- TOC entry 5007 (class 2606 OID 19068)
-- Name: categories categories_classification_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_classification_code_key UNIQUE (classification_code);


--
-- TOC entry 5009 (class 2606 OID 19066)
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- TOC entry 5011 (class 2606 OID 19064)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5033 (class 2606 OID 19233)
-- Name: fines fines_loan_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fines
    ADD CONSTRAINT fines_loan_id_key UNIQUE (loan_id);


--
-- TOC entry 5035 (class 2606 OID 19231)
-- Name: fines fines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fines
    ADD CONSTRAINT fines_pkey PRIMARY KEY (id);


--
-- TOC entry 5028 (class 2606 OID 19154)
-- Name: loans loans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT loans_pkey PRIMARY KEY (id);


--
-- TOC entry 5031 (class 2606 OID 19194)
-- Name: renewal_requests renewal_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.renewal_requests
    ADD CONSTRAINT renewal_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 5039 (class 2606 OID 19267)
-- Name: reviews reviews_loan_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_loan_id_key UNIQUE (loan_id);


--
-- TOC entry 5041 (class 2606 OID 19265)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 5003 (class 2606 OID 19042)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 5005 (class 2606 OID 19044)
-- Name: sessions sessions_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_token_hash_key UNIQUE (token_hash);


--
-- TOC entry 4995 (class 2606 OID 19029)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4997 (class 2606 OID 19031)
-- Name: users users_identity_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_identity_number_key UNIQUE (identity_number);


--
-- TOC entry 4999 (class 2606 OID 19027)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5022 (class 1259 OID 19291)
-- Name: idx_announcements_status_release; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_announcements_status_release ON public.announcements USING btree (status, release_at DESC);


--
-- TOC entry 5016 (class 1259 OID 19287)
-- Name: idx_books_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_books_category_id ON public.books USING btree (category_id);


--
-- TOC entry 5017 (class 1259 OID 19290)
-- Name: idx_books_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_books_is_active ON public.books USING btree (is_active);


--
-- TOC entry 5018 (class 1259 OID 19288)
-- Name: idx_books_isbn; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_books_isbn ON public.books USING btree (isbn);


--
-- TOC entry 5019 (class 1259 OID 19289)
-- Name: idx_books_title_trgm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_books_title_trgm ON public.books USING btree (title);


--
-- TOC entry 5036 (class 1259 OID 19296)
-- Name: idx_fines_student_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fines_student_status ON public.fines USING btree (student_id, status);


--
-- TOC entry 5023 (class 1259 OID 19293)
-- Name: idx_loans_book_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_loans_book_status ON public.loans USING btree (book_id, status);


--
-- TOC entry 5024 (class 1259 OID 19295)
-- Name: idx_loans_due_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_loans_due_date ON public.loans USING btree (due_date);


--
-- TOC entry 5025 (class 1259 OID 19294)
-- Name: idx_loans_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_loans_status ON public.loans USING btree (status);


--
-- TOC entry 5026 (class 1259 OID 19292)
-- Name: idx_loans_student_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_loans_student_status ON public.loans USING btree (student_id, status);


--
-- TOC entry 5029 (class 1259 OID 19298)
-- Name: idx_renewal_loan_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_renewal_loan_status ON public.renewal_requests USING btree (loan_id, status);


--
-- TOC entry 5037 (class 1259 OID 19297)
-- Name: idx_reviews_book_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_book_id ON public.reviews USING btree (book_id);


--
-- TOC entry 5000 (class 1259 OID 19286)
-- Name: idx_sessions_expires_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_expires_at ON public.sessions USING btree (expires_at);


--
-- TOC entry 5001 (class 1259 OID 19285)
-- Name: idx_sessions_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_user_id ON public.sessions USING btree (user_id);


--
-- TOC entry 4992 (class 1259 OID 19283)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 4993 (class 1259 OID 19284)
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- TOC entry 5044 (class 2606 OID 19128)
-- Name: announcements announcements_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5043 (class 2606 OID 19102)
-- Name: books books_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT;


--
-- TOC entry 5051 (class 2606 OID 19234)
-- Name: fines fines_loan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fines
    ADD CONSTRAINT fines_loan_id_fkey FOREIGN KEY (loan_id) REFERENCES public.loans(id) ON DELETE RESTRICT;


--
-- TOC entry 5052 (class 2606 OID 19244)
-- Name: fines fines_paid_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fines
    ADD CONSTRAINT fines_paid_by_fkey FOREIGN KEY (paid_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5053 (class 2606 OID 19239)
-- Name: fines fines_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fines
    ADD CONSTRAINT fines_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5045 (class 2606 OID 19165)
-- Name: loans loans_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT loans_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5046 (class 2606 OID 19160)
-- Name: loans loans_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT loans_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE RESTRICT;


--
-- TOC entry 5047 (class 2606 OID 19170)
-- Name: loans loans_rejected_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT loans_rejected_by_fkey FOREIGN KEY (rejected_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5048 (class 2606 OID 19155)
-- Name: loans loans_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT loans_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5049 (class 2606 OID 19195)
-- Name: renewal_requests renewal_requests_loan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.renewal_requests
    ADD CONSTRAINT renewal_requests_loan_id_fkey FOREIGN KEY (loan_id) REFERENCES public.loans(id) ON DELETE RESTRICT;


--
-- TOC entry 5050 (class 2606 OID 19200)
-- Name: renewal_requests renewal_requests_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.renewal_requests
    ADD CONSTRAINT renewal_requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5054 (class 2606 OID 19278)
-- Name: reviews reviews_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE RESTRICT;


--
-- TOC entry 5055 (class 2606 OID 19268)
-- Name: reviews reviews_loan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_loan_id_fkey FOREIGN KEY (loan_id) REFERENCES public.loans(id) ON DELETE RESTRICT;


--
-- TOC entry 5056 (class 2606 OID 19273)
-- Name: reviews reviews_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5042 (class 2606 OID 19045)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-11-21 16:58:48

--
-- PostgreSQL database dump complete
--

\unrestrict bejZE4Ny9OAKlXaEQ1nbumlmULMIfmBMYJX79IidOM9I181rlY6mQTd6ERwaZdN

